/**
 * Fetches `/api/tts` MP3 chunks into in-memory `Blob` URLs and parses
 * exact neural `WordBoundary` timestamps (`X-Word-Offsets` & `X-Speech-End`)
 * so verse/sentence highlighting is locked to the millisecond of speech.
 */

export interface LoadedAudioChunk {
  objectUrl: string;
  fallbackDuration: number;
  wordOffsets: number[];
  speechEnd: number;
}

const BYTES_PER_SECOND_96KBPS = 12000;
const MAX_CACHE_ENTRIES = 45;
const chunkCache = new Map<string, Promise<LoadedAudioChunk>>();

export function loadAudioChunk(text: string): Promise<LoadedAudioChunk> {
  const key = text.trim();
  const existing = chunkCache.get(key);
  if (existing) return existing;

  const url = `/api/tts?v=8&q=${encodeURIComponent(key)}`;
  const promise = fetch(url)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`TTS HTTP ${res.status}`);
      }
      const offsetsHeader = res.headers.get("X-Word-Offsets") || "";
      const speechEndHeader = res.headers.get("X-Speech-End") || "0";

      const wordOffsets = offsetsHeader
        .split(",")
        .map((s) => Number.parseFloat(s))
        .filter((n) => Number.isFinite(n) && n >= 0);

      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 100) {
        throw new Error("Empty TTS buffer");
      }

      const blob = new Blob([buffer], { type: "audio/mpeg" });
      const objectUrl = URL.createObjectURL(blob);
      const fallbackDuration = Math.max(
        0.35,
        buffer.byteLength / BYTES_PER_SECOND_96KBPS
      );
      const parsedEnd = Number.parseFloat(speechEndHeader);
      const speechEnd =
        Number.isFinite(parsedEnd) && parsedEnd > 0.1
          ? parsedEnd
          : fallbackDuration;

      return { objectUrl, fallbackDuration, wordOffsets, speechEnd };
    })
    .catch((err) => {
      chunkCache.delete(key);
      throw err;
    });

  if (chunkCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = chunkCache.keys().next().value;
    if (oldestKey) {
      const oldPromise = chunkCache.get(oldestKey);
      chunkCache.delete(oldestKey);
      oldPromise
        ?.then((item) => URL.revokeObjectURL(item.objectUrl))
        .catch(() => {});
    }
  }

  chunkCache.set(key, promise);
  return promise;
}

export function preloadAudioChunk(text?: string): void {
  if (!text) return;
  loadAudioChunk(text).catch(() => {});
}

export function resolveEffectiveDuration(
  audio: HTMLAudioElement,
  fallbackDuration: number
): number {
  const raw = audio.duration;
  if (Number.isFinite(raw) && raw > 0.2) {
    return raw;
  }
  return fallbackDuration;
}

/**
 * Maps `audio.currentTime` into a normalized `[0, 1]` word-index progress
 * using the exact neural `WordBoundary` timestamps from Edge TTS.
 */
export function computeSpokenProgress(
  currentTime: number,
  effectiveDuration: number,
  wordOffsets?: number[],
  speechEnd?: number
): number {
  const t = currentTime + 0.08; // 80ms visual anticipation lead

  if (wordOffsets && wordOffsets.length > 0) {
    const n = wordOffsets.length;
    if (t <= wordOffsets[0]) return 0;

    const endSec =
      speechEnd && speechEnd > wordOffsets[n - 1]
        ? speechEnd
        : Math.max(effectiveDuration, wordOffsets[n - 1] + 0.35);

    if (t >= endSec) return 1;

    let k = 0;
    for (let i = n - 1; i >= 0; i--) {
      if (t >= wordOffsets[i]) {
        k = i;
        break;
      }
    }

    const wordStart = wordOffsets[k];
    const wordEnd = k + 1 < n ? wordOffsets[k + 1] : endSec;
    const span = Math.max(0.05, wordEnd - wordStart);
    const frac = Math.min(1, Math.max(0, (t - wordStart) / span));
    return Math.min(1, (k + frac) / n);
  }

  if (effectiveDuration <= 0) return 0;
  const span = speechEnd && speechEnd > 0.2 ? speechEnd : effectiveDuration * 0.9;
  return Math.min(1, Math.max(0, (t - 0.1) / Math.max(0.2, span - 0.1)));
}

export function resolveSeekTime(
  ratio: number,
  effectiveDuration: number,
  wordOffsets?: number[]
): number {
  if (wordOffsets && wordOffsets.length > 0) {
    const idx = Math.min(
      wordOffsets.length - 1,
      Math.max(0, Math.floor(ratio * wordOffsets.length))
    );
    return Math.max(0, wordOffsets[idx] - 0.04);
  }
  return ratio * effectiveDuration;
}
