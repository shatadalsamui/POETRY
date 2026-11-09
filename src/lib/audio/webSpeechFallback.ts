import { recitationStore, RecitationStatus } from "./recitationStore";

export interface SpeakFallbackParams {
  chunks: string[];
  index: number;
  runId: number;
  workId: string;
  getActiveRunId: () => number;
  onChunkAdvance: (nextIndex: number) => void;
  onStatusChange: (
    next: RecitationStatus,
    chunkIdx: number,
    progress?: number
  ) => void;
  onStop: () => void;
}

/**
 * Browser Web Speech API (`bn-IN`) fallback used only if the primary
 * server-side neural TTS stream is unreachable.
 */
export function speakWithWebSpeechFallback(params: SpeakFallbackParams): void {
  const {
    chunks,
    index,
    runId,
    workId,
    getActiveRunId,
    onChunkAdvance,
    onStatusChange,
    onStop,
  } = params;

  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    index >= chunks.length
  ) {
    onStop();
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
    if (getActiveRunId() !== runId) return;
    onStatusChange("playing", index, 0);
  };

  utterance.onboundary = (ev) => {
    if (getActiveRunId() !== runId) return;
    const len = chunks[index].length || 1;
    recitationStore.setState({
      workId,
      chunkIndex: index,
      chunkProgress: Math.min(1, Math.max(0, ev.charIndex / len)),
    });
  };

  utterance.onend = () => {
    if (getActiveRunId() !== runId) return;
    if (index + 1 < chunks.length) {
      onChunkAdvance(index + 1);
      speakWithWebSpeechFallback({
        ...params,
        index: index + 1,
      });
    } else {
      onStop();
    }
  };

  utterance.onerror = () => {
    if (getActiveRunId() === runId) onStop();
  };

  synth.speak(utterance);
}

