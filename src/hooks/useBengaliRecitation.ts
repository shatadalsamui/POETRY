"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildRecitationChunks } from "@/lib/audio/chunkBengaliText";
import {
  recitationStore,
  RecitationStatus,
} from "@/lib/audio/recitationStore";
import { speakWithWebSpeechFallback } from "@/lib/audio/webSpeechFallback";
import {
  computeSpokenProgress,
  loadAudioChunk,
  preloadAudioChunk,
  resolveEffectiveDuration,
} from "@/lib/audio/audioChunkLoader";

export type { RecitationStatus };

export interface UseBengaliRecitationParams {
  workId?: string;
  title: string;
  content: string;
  book?: string;
  type?: "poem" | "story";
}

export function useBengaliRecitation({
  workId,
  title,
  content,
  book,
  type = "poem",
}: UseBengaliRecitationParams) {
  const effectiveWorkId = workId || title;

  const chunks = useMemo(
    () => buildRecitationChunks({ title, content, book, type }),
    [title, content, book, type]
  );

  const [status, setStatus] = useState<RecitationStatus>("idle");
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackDurRef = useRef<number>(1);
  const progressTimerRef = useRef<number | null>(null);
  const activeRunIdRef = useRef<number>(0);
  const statusRef = useRef<RecitationStatus>("idle");
  const chunkIndexRef = useRef<number>(0);

  const clearProgressTimer = useCallback(() => {
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const updateStatus = useCallback(
    (next: RecitationStatus, chunkIdx = chunkIndexRef.current, progress?: number) => {
      statusRef.current = next;
      setStatus(next);
      if (next === "idle") {
        recitationStore.reset(effectiveWorkId);
      } else {
        recitationStore.setState({
          workId: effectiveWorkId,
          status: next,
          chunkIndex: chunkIdx,
          ...(progress !== undefined ? { chunkProgress: progress } : {}),
        });
      }
    },
    [effectiveWorkId]
  );

  const cleanupPlayback = useCallback(() => {
    activeRunIdRef.current += 1;
    clearProgressTimer();

    if (audioRef.current) {
      const a = audioRef.current;
      a.onended = a.onerror = a.ontimeupdate = a.onplaying = a.onloadedmetadata = null;
      a.pause();
      a.src = "";
      audioRef.current = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }, [clearProgressTimer]);

  const stop = useCallback(() => {
    cleanupPlayback();
    chunkIndexRef.current = 0;
    setCurrentChunkIndex(0);
    updateStatus("idle", 0, 0);
  }, [cleanupPlayback, updateStatus]);

  const runFallback = useCallback(
    (index: number, runId: number) => {
      speakWithWebSpeechFallback({
        chunks,
        index,
        runId,
        workId: effectiveWorkId,
        getActiveRunId: () => activeRunIdRef.current,
        onChunkAdvance: (nextIdx) => {
          chunkIndexRef.current = nextIdx;
          setCurrentChunkIndex(nextIdx);
        },
        onStatusChange: updateStatus,
        onStop: stop,
      });
    },
    [chunks, effectiveWorkId, stop, updateStatus]
  );

  const playChunkAt = useCallback(
    function playStep(index: number, runId: number, initialRatio = 0) {
      if (activeRunIdRef.current !== runId) return;
      if (index >= chunks.length) {
        stop();
        return;
      }

      clearProgressTimer();
      chunkIndexRef.current = index;
      setCurrentChunkIndex(index);
      recitationStore.setState({
        workId: effectiveWorkId,
        chunkIndex: index,
        chunkProgress: initialRatio,
      });

      preloadAudioChunk(chunks[index + 1]);
      preloadAudioChunk(chunks[index + 2]);

      loadAudioChunk(chunks[index])
        .then(({ objectUrl, fallbackDuration }) => {
          if (activeRunIdRef.current !== runId) return;

          fallbackDurRef.current = fallbackDuration;
          const audio = new Audio(objectUrl);
          audio.playbackRate = 1.0;
          audioRef.current = audio;

          const publishProgress = () => {
            if (activeRunIdRef.current !== runId) return;
            const effDur = resolveEffectiveDuration(audio, fallbackDuration);
            recitationStore.setState({
              workId: effectiveWorkId,
              chunkIndex: index,
              chunkProgress: computeSpokenProgress(audio.currentTime, effDur),
            });
          };

          if (initialRatio > 0) {
            const applySeek = () => {
              audio.currentTime =
                initialRatio * resolveEffectiveDuration(audio, fallbackDuration);
            };
            if (audio.readyState >= 1) applySeek();
            else audio.onloadedmetadata = applySeek;
          }

          audio.onplaying = () => {
            if (activeRunIdRef.current !== runId) return;
            updateStatus("playing", index);
            clearProgressTimer();
            progressTimerRef.current = window.setInterval(publishProgress, 75);
          };

          audio.ontimeupdate = publishProgress;

          audio.onended = () => {
            if (activeRunIdRef.current !== runId) return;
            clearProgressTimer();
            if (index + 1 < chunks.length) playStep(index + 1, runId, 0);
            else stop();
          };

          audio.onerror = () => {
            if (activeRunIdRef.current !== runId) return;
            clearProgressTimer();
            runFallback(index, runId);
          };

          audio.play().catch(() => {
            if (activeRunIdRef.current !== runId) return;
            clearProgressTimer();
            runFallback(index, runId);
          });
        })
        .catch(() => {
          if (activeRunIdRef.current !== runId) return;
          runFallback(index, runId);
        });
    },
    [chunks, clearProgressTimer, effectiveWorkId, runFallback, stop, updateStatus]
  );

  useEffect(() => {
    if (status === "idle") return;
    const handleSeek = (targetChunk: number, ratio: number) => {
      const audio = audioRef.current;
      if (audio && chunkIndexRef.current === targetChunk) {
        const effDur = resolveEffectiveDuration(audio, fallbackDurRef.current);
        audio.currentTime = ratio * effDur;
        recitationStore.setState({
          workId: effectiveWorkId,
          chunkIndex: targetChunk,
          chunkProgress: ratio,
        });
        if (statusRef.current === "paused") {
          updateStatus("playing", targetChunk, ratio);
          audio.play().catch(() => {});
        }
        return;
      }

      cleanupPlayback();
      const runId = activeRunIdRef.current;
      updateStatus("loading", targetChunk, ratio);
      playChunkAt(targetChunk, runId, ratio);
    };

    recitationStore.registerSeekHandler(handleSeek);
    return () => recitationStore.registerSeekHandler(null);
  }, [cleanupPlayback, effectiveWorkId, playChunkAt, status, updateStatus]);

  const togglePlayPause = useCallback(() => {
    if (status === "idle") {
      cleanupPlayback();
      const runId = activeRunIdRef.current;
      updateStatus("loading", 0, 0);
      playChunkAt(0, runId, 0);
      return;
    }

    if (status === "playing" || status === "loading") {
      clearProgressTimer();
      if (audioRef.current) audioRef.current.pause();
      else if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.pause();
      }
      updateStatus("paused", chunkIndexRef.current);
      return;
    }

    if (status === "paused") {
      updateStatus("playing", chunkIndexRef.current);
      if (audioRef.current && !audioRef.current.ended) {
        audioRef.current.play().catch(() => {
          playChunkAt(chunkIndexRef.current, activeRunIdRef.current, 0);
        });
      } else {
        const nextIdx =
          audioRef.current?.ended && currentChunkIndex + 1 < chunks.length
            ? currentChunkIndex + 1
            : currentChunkIndex;
        playChunkAt(nextIdx, activeRunIdRef.current, 0);
      }
    }
  }, [
    chunks.length,
    cleanupPlayback,
    clearProgressTimer,
    currentChunkIndex,
    playChunkAt,
    status,
    updateStatus,
  ]);

  useEffect(() => {
    return () => {
      cleanupPlayback();
      recitationStore.reset(effectiveWorkId);
    };
  }, [title, content, cleanupPlayback, effectiveWorkId]);

  return {
    status,
    currentChunkIndex,
    totalChunks: chunks.length,
    togglePlayPause,
    stop,
  };
}
