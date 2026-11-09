/**
 * Lightweight external store (`useSyncExternalStore` compatible) that syncs
 * real-time playback progress (`chunkIndex` + `chunkProgress` in [0, 1])
 * between `BengaliAudioButton` and `RecitableContent` without converting
 * Server Component pages into Client Components.
 */

export type RecitationStatus = "idle" | "loading" | "playing" | "paused";

export interface RecitationPlaybackState {
  workId: string | null;
  status: RecitationStatus;
  chunkIndex: number;
  chunkProgress: number; // 0..1 within the current chunk
}

type Listener = () => void;
type SeekHandler = (chunkIndex: number, progressRatio: number) => void;

const INITIAL_STATE: RecitationPlaybackState = {
  workId: null,
  status: "idle",
  chunkIndex: 0,
  chunkProgress: 0,
};

let currentState: RecitationPlaybackState = INITIAL_STATE;
const listeners = new Set<Listener>();
let activeSeekHandler: SeekHandler | null = null;

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const recitationStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot(): RecitationPlaybackState {
    return currentState;
  },

  getServerSnapshot(): RecitationPlaybackState {
    return INITIAL_STATE;
  },

  setState(patch: Partial<RecitationPlaybackState>): void {
    const next: RecitationPlaybackState = {
      ...currentState,
      ...patch,
    };
    if (
      next.workId === currentState.workId &&
      next.status === currentState.status &&
      next.chunkIndex === currentState.chunkIndex &&
      Math.abs(next.chunkProgress - currentState.chunkProgress) < 0.004
    ) {
      return;
    }
    currentState = next;
    emitChange();
  },

  reset(workId?: string): void {
    if (workId && currentState.workId !== workId) return;
    currentState = INITIAL_STATE;
    emitChange();
  },

  registerSeekHandler(handler: SeekHandler | null): void {
    activeSeekHandler = handler;
  },

  requestSeek(chunkIndex: number, progressRatio: number): void {
    activeSeekHandler?.(chunkIndex, Math.max(0, Math.min(1, progressRatio)));
  },
};

