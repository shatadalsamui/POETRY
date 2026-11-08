"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildRecitationChunks } from "@/lib/audio/chunkBengaliText";

export type RecitationStatus = "idle" | "loading" | "playing" | "paused";

export interface UseBengaliRecitationParams {
  title: string;
  content: string;
  book?: string;
  type?: "poem" | "story";
}

export function useBengaliRecitation({
  title,
  content,
  book,
  type = "poem",
}: UseBengaliRecitationParams) {
  const chunks = useMemo(
    () => buildRecitationChunks({ title, content, book, type }),
    [title, content, book, type]
  );

  const [status, setStatus] = useState<RecitationStatus>("idle");
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const activeRunIdRef = useRef<number>(0);
  const statusRef = useRef<RecitationStatus>("idle");

  const updateStatus = useCallback((next: RecitationStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const cleanupPlayback = useCallback(() => {
    activeRunIdRef.current += 1;

    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    if (preloadAudioRef.current) {
      preloadAudioRef.current.src = "";
      preloadAudioRef.current = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }, []);

  const stop = useCallback(() => {
    cleanupPlayback();
    setCurrentChunkIndex(0);
    updateStatus("idle");
  }, [cleanupPlayback, updateStatus]);

  // Fallback to browser Web Speech API if network/proxy fails
  const speakWithWebSpeechFallback = useCallback(
    (index: number, runId: number) => {
      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window) ||
        index >= chunks.length
      ) {
        stop();
        return;
      }

      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = "bn-IN";
      utterance.rate = 0.93;

      const voices = synth.getVoices();
      const bnInVoice =
        voices.find((v) => v.lang.toLowerCase() === "bn-in") ||
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("bn") ||
            v.name.toLowerCase().includes("bengali") ||
            v.name.includes("বাংলা")
        );
      if (bnInVoice) utterance.voice = bnInVoice;

      utterance.onstart = () => {
        if (activeRunIdRef.current !== runId) return;
        updateStatus("playing");
      };

      utterance.onend = () => {
        if (activeRunIdRef.current !== runId) return;
        if (index + 1 < chunks.length) {
          setCurrentChunkIndex(index + 1);
          speakWithWebSpeechFallback(index + 1, runId);
        } else {
          stop();
        }
      };

      utterance.onerror = () => {
        if (activeRunIdRef.current === runId) stop();
      };

      synth.speak(utterance);
    },
    [chunks, stop, updateStatus]
  );

  const playChunkAt = useCallback(
    function playStep(index: number, runId: number) {
      if (activeRunIdRef.current !== runId) return;
      if (index >= chunks.length) {
        stop();
        return;
      }

      setCurrentChunkIndex(index);
      const chunkUrl = `/api/tts?v=4&q=${encodeURIComponent(chunks[index])}`;

      // Reuse preloaded audio if it matches the next chunk
      let audio: HTMLAudioElement;
      if (
        preloadAudioRef.current &&
        preloadAudioRef.current.dataset.chunkIndex === String(index)
      ) {
        audio = preloadAudioRef.current;
        preloadAudioRef.current = null;
      } else {
        audio = new Audio(chunkUrl);
      }

      audio.playbackRate = 1.0;
      audioRef.current = audio;

      // Preload the next chunk in background for gapless stanza transitions
      if (index + 1 < chunks.length) {
        const nextAudio = new Audio(
          `/api/tts?v=4&q=${encodeURIComponent(chunks[index + 1])}`
        );
        nextAudio.preload = "auto";
        nextAudio.dataset.chunkIndex = String(index + 1);
        nextAudio.load();
        preloadAudioRef.current = nextAudio;
      }

      audio.onplaying = () => {
        if (activeRunIdRef.current === runId) {
          updateStatus("playing");
        }
      };

      audio.onended = () => {
        if (activeRunIdRef.current !== runId) return;
        if (index + 1 < chunks.length) {
          playStep(index + 1, runId);
        } else {
          stop();
        }
      };

      audio.onerror = () => {
        if (activeRunIdRef.current !== runId) return;
        speakWithWebSpeechFallback(index, runId);
      };

      audio.play().catch(() => {
        if (activeRunIdRef.current !== runId) return;
        speakWithWebSpeechFallback(index, runId);
      });
    },
    [chunks, speakWithWebSpeechFallback, stop, updateStatus]
  );

  const togglePlayPause = useCallback(() => {
    if (status === "idle") {
      cleanupPlayback();
      const runId = activeRunIdRef.current;
      updateStatus("loading");
      playChunkAt(0, runId);
      return;
    }

    if (status === "playing" || status === "loading") {
      if (pauseTimerRef.current !== null) {
        window.clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
      } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.pause();
      }
      updateStatus("paused");
      return;
    }

    if (status === "paused") {
      updateStatus("playing");
      if (audioRef.current && !audioRef.current.ended) {
        audioRef.current.play().catch(() => {
          const runId = activeRunIdRef.current;
          playChunkAt(currentChunkIndex, runId);
        });
      } else {
        const nextIdx =
          audioRef.current?.ended && currentChunkIndex + 1 < chunks.length
            ? currentChunkIndex + 1
            : currentChunkIndex;
        playChunkAt(nextIdx, activeRunIdRef.current);
      }
    }
  }, [cleanupPlayback, chunks.length, currentChunkIndex, playChunkAt, status, updateStatus]);

  // Stop playback automatically when poem/story changes or component unmounts
  useEffect(() => {
    return () => {
      cleanupPlayback();
    };
  }, [title, content, cleanupPlayback]);

  return {
    status,
    currentChunkIndex,
    totalChunks: chunks.length,
    togglePlayPause,
    stop,
  };
}

