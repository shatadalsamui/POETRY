"use client";

import React from "react";
import { Poem, toBengaliNumerals, formatBengaliDate } from "@/lib/data";
import { BookInfo } from "./BookShelfCard";
import ShareButton from "@/components/ui/ShareButton";

interface BookPoemLeafProps {
  currentBook: BookInfo;
  currentPoem: Poem;
  activePoemIndex: number;
  totalPoems: number;
  onPrevPoem: () => void;
  onNextPoem: () => void;
}

export default function BookPoemLeaf({
  currentBook,
  currentPoem,
  activePoemIndex,
  totalPoems,
  onPrevPoem,
  onNextPoem,
}: BookPoemLeafProps) {
  return (
    <article className="w-full bg-[#fbf9f4] border-2 border-[var(--color-antique-gold)]/45 rounded-xs shadow-[0_20px_50px_rgba(0,0,0,0.12),_inset_14px_0_18px_-10px_rgba(0,0,0,0.08)] px-6 pt-6 pb-10 sm:px-14 sm:pt-8 sm:pb-16 md:px-20 md:pt-10 md:pb-20 relative overflow-hidden flex flex-col items-center min-h-[640px] justify-between">
      {/* Subtle Spine Crease shadow along left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/10 via-black/3 to-transparent pointer-events-none hidden sm:block" />
      {/* Fine Crimson Edge Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-85" />

      {/* Top Action Row: Share Button */}
      <div className="w-full flex items-center justify-end mb-3 sm:mb-4 relative z-10">
        <ShareButton path={`/poems/${currentPoem.id}`} />
      </div>

      {/* 1. Running Book Header */}
      <div className="w-full pb-4 mb-8 sm:mb-12 border-b border-[var(--color-antique-gold)]/40 flex items-center justify-between text-xs sm:text-sm font-serif text-[var(--color-ink)]/70 tracking-wider">
        <span className="font-semibold text-[var(--color-accent)]">দীপালী সামুই</span>
        <span className="italic font-medium text-[var(--color-accent-green)]">
          ‘{currentBook.title}’ কাব্যগ্রন্থ
        </span>
        <span className="text-[var(--color-ink)]/60 font-medium">
          {formatBengaliDate(currentPoem.date)}
        </span>
      </div>

      {/* 2. Poem Title & Decorative Ornamental Divider */}
      <div className="w-full text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-5 text-[var(--color-ink)] leading-tight font-serif">
          {currentPoem.title}
        </h2>
        <div className="flex items-center justify-center gap-3 text-[var(--color-antique-gold)] opacity-75">
          <span className="w-14 h-[1px] bg-current" />
          <span className="text-sm">❦</span>
          <span className="w-14 h-[1px] bg-current" />
        </div>
      </div>

      {/* 3. Poem Verses Body */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl px-2 my-4">
        <div className="text-[16px] sm:text-xl md:text-2xl text-[var(--color-ink)] font-medium leading-[2.6] sm:leading-[2.9] whitespace-pre-wrap font-serif w-full text-center tracking-normal selection:bg-[#982b1b]/15 break-normal">
          {currentPoem.content}
        </div>

        {/* Author Signature Block */}
        <div className="mt-12 pt-4 border-t border-[var(--color-antique-gold)]/25 flex flex-col items-end self-end">
          <span className="text-base sm:text-xl font-serif font-semibold text-[var(--color-accent)] italic">
            — দীপালী সামুই
          </span>
        </div>
      </div>

      {/* 4. Page Indicator & Next / Previous Page Navigation */}
      <div className="w-full mt-10 pt-4 border-t border-[var(--color-antique-gold)]/40 flex items-center justify-between text-xs sm:text-sm font-serif">
        <button
          onClick={onPrevPoem}
          disabled={activePoemIndex === 0}
          className="px-4 py-2 rounded-xs border border-[var(--color-antique-gold)]/50 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-bold bg-white/60"
        >
          ← পূর্ববর্তী পাতা
        </button>

        <span className="text-xs sm:text-sm font-bold text-[var(--color-accent)] tracking-wider">
          — পৃষ্ঠা {toBengaliNumerals(activePoemIndex + 1)} —
        </span>

        <button
          onClick={onNextPoem}
          disabled={activePoemIndex === totalPoems - 1}
          className="px-4 py-2 rounded-xs border border-[var(--color-antique-gold)]/50 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-bold bg-white/60"
        >
          পরবর্তী পাতা →
        </button>
      </div>
    </article>
  );
}
