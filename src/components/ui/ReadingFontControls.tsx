"use client";

import React, { useEffect, useSyncExternalStore } from "react";

type ReadingScale = "sm" | "md" | "lg" | "xl";

const SCALES: ReadingScale[] = ["sm", "md", "lg", "xl"];
const STORAGE_KEY = "depali-reading-scale";
const EVENT_NAME = "depali-reading-scale-change";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): ReadingScale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ReadingScale | null;
    if (saved && SCALES.includes(saved)) return saved;
  } catch {
    // ignore
  }
  return "md";
}

function getServerSnapshot(): ReadingScale {
  return "md";
}

export default function ReadingFontControls() {
  const scale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.dataset.readingScale = scale;
  }, [scale]);

  const updateScale = (next: ReadingScale) => {
    document.documentElement.dataset.readingScale = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch {
      // ignore storage errors
    }
  };

  const currentIdx = SCALES.indexOf(scale);

  return (
    <div
      className="inline-flex items-center rounded-full bg-[var(--color-vintage-ivory)] border border-[var(--color-antique-gold)]/45 shadow-2xs overflow-hidden text-xs font-serif"
      role="group"
      aria-label="অক্ষরের আকার পরিবর্তন করুন"
    >
      <button
        type="button"
        disabled={currentIdx <= 0}
        onClick={() => updateScale(SCALES[Math.max(0, currentIdx - 1)])}
        title="ছোট অক্ষর"
        aria-label="অক্ষর ছোট করুন"
        className="px-2.5 py-1 text-[var(--color-ink)]/80 hover:text-[var(--color-accent)] hover:bg-white/80 disabled:opacity-35 disabled:pointer-events-none transition-colors font-semibold cursor-pointer"
      >
        অ−
      </button>
      <span className="w-[1px] h-3.5 bg-[var(--color-antique-gold)]/35" />
      <button
        type="button"
        disabled={currentIdx >= SCALES.length - 1}
        onClick={() =>
          updateScale(SCALES[Math.min(SCALES.length - 1, currentIdx + 1)])
        }
        title="বড় অক্ষর"
        aria-label="অক্ষর বড় করুন"
        className="px-2.5 py-1 text-[var(--color-ink)]/85 hover:text-[var(--color-accent)] hover:bg-white/80 disabled:opacity-35 disabled:pointer-events-none transition-colors font-bold cursor-pointer"
      >
        অ+
      </button>
    </div>
  );
}
