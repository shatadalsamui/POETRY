"use client";

import React from "react";
import { Volume2, Pause, Play, Square, Loader2 } from "lucide-react";
import { useBengaliRecitation } from "@/hooks/useBengaliRecitation";
import { toBengaliNumerals } from "@/lib/data";

interface BengaliAudioButtonProps {
  workId?: string;
  title: string;
  content: string;
  book?: string;
  type?: "poem" | "story";
}

export default function BengaliAudioButton({
  workId,
  title,
  content,
  book,
  type = "poem",
}: BengaliAudioButtonProps) {
  const { status, currentChunkIndex, totalChunks, togglePlayPause, stop } =
    useBengaliRecitation({
      workId,
      title,
      content,
      book,
      type,
    });

  const isActive = status !== "idle";

  return (
    <div className="inline-flex items-center rounded-full bg-[var(--color-vintage-ivory)] border border-[var(--color-antique-gold)]/45 shadow-2xs overflow-hidden text-xs font-serif">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          togglePlayPause();
        }}
        title={
          status === "idle"
            ? type === "poem"
              ? "কবিতাটি শুনুন"
              : "গল্পটি শুনুন"
            : status === "playing"
            ? "বিরতি দিন"
            : "আবার শুনুন"
        }
        aria-label={
          status === "idle"
            ? "শুনুন"
            : status === "playing"
            ? "বিরতি"
            : "চালিয়ে যান"
        }
        className={`inline-flex items-center gap-1.5 px-3 py-1 font-medium transition-colors cursor-pointer ${
          isActive
            ? "bg-[var(--color-accent)] text-white"
            : "text-[var(--color-ink)]/85 hover:text-[var(--color-accent)] hover:bg-white/90"
        }`}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>লোড হচ্ছে...</span>
          </>
        ) : status === "playing" ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>
              বিরতি ({toBengaliNumerals(currentChunkIndex + 1)}/
              {toBengaliNumerals(totalChunks)})
            </span>
          </>
        ) : status === "paused" ? (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>শুনুন</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>শুনুন</span>
          </>
        )}
      </button>

      {isActive && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            stop();
          }}
          title="পাঠ বন্ধ করুন"
          aria-label="পাঠ বন্ধ করুন"
          className="px-2.5 py-1 bg-[#f3ede0] hover:bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-l border-[var(--color-antique-gold)]/40 transition-colors cursor-pointer flex items-center justify-center"
        >
          <Square className="w-3 h-3 fill-current" />
        </button>
      )}
    </div>
  );
}

