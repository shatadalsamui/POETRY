/**
 * Fetches `/api/tts` MP3 chunks into in-memory `Blob` URLs so that:
 * 1. `fallbackDuration` (`byteLength / 6000` for 48kbps CBR MP3) is always finite
 *    even when `HTMLAudioElement.duration` is `Infinity` on headerless MP3 streams.
 * 2. Intra-chunk seeking (`audio.currentTime = ...`) works instantaneously in all browsers.
 * 3. Upcoming sentence chunks can be preloaded in parallel for gapless playback.
 */

export interface LoadedAudioChunk {
  objectUrl: string;
  fallbackDuration: number; // seconds (exact for 96kbps CBR MP3: 12000 bytes/sec)
}

const BYTES_PER_SECOND_96KBPS = 12000;
const MAX_CACHE_ENTRIES = 45;
const chunkCache = new Map<string, Promise<LoadedAudioChunk>>();

export function loadAudioChunk(text: string): Promise<LoadedAudioChunk> {
  const key = text.trim();
  const existing = chunkCache.get(key);
  if (existing) return existing;

  const url = `/api/tts?v=7&q=${encodeURIComponent(key)}`;
  const promise = fetch(url)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`TTS HTTP ${res.status}`);
      }
      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 100) {
        throw new Error("Empty TTS buffer");
      }
      const blob = new Blob([buffer], { type: "audio/mpeg" });
      const objectUrl = URL.createObjectURL(blob);
      const fallbackDuration = Math.max(
        0.4,
        buffer.byteLength / BYTES_PER_SECOND_96KBPS
      );
      return { objectUrl, fallbackDuration };
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
 * Maps `audio.currentTime` into a normalized `[0, 1]` progress across the spoken words
 * of a chunk, trimming Edge TTS's brief leading/trailing silence.
 */
export function computeSpokenProgress(
  currentTime: number,
  effectiveDuration: number
): number {
  if (effectiveDuration <= 0) return 0;
  const leadIn = Math.min(0.1, effectiveDuration * 0.04);
  const trailOut = Math.min(0.22, effectiveDuration * 0.08);
  const spokenSpan = Math.max(0.2, effectiveDuration - leadIn - trailOut);
  const ratio = (currentTime - leadIn) / spokenSpan;
  return Math.min(1, Math.max(0, ratio));
}

