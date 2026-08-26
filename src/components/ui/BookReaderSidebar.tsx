"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toBengaliNumerals } from "@/lib/data";
import { BookInfo } from "./BookShelfCard";

interface BookReaderSidebarProps {
  currentBook: BookInfo;
  activePoemIndex: number;
  onSelectPoem: (index: number) => void;
  onSwitchBook: () => void;
  otherBookTitle: string;
}

export default function BookReaderSidebar({
  currentBook,
  activePoemIndex,
  onSelectPoem,
  onSwitchBook,
  otherBookTitle,
}: BookReaderSidebarProps) {
  return (
    <div className="w-full lg:w-[380px] xl:w-[430px] shrink-0 bg-[var(--color-vintage-ivory)] p-6 sm:p-8 rounded-sm border-2 border-[var(--color-antique-gold)]/50 shadow-xl relative overflow-hidden lg:sticky lg:top-24">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-80" />

      {/* Book Covers Preview */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="relative w-32 sm:w-36 h-44 sm:h-48 bg-white shadow-md border border-[var(--color-antique-gold)]/40 rounded-xs overflow-hidden shrink-0">
          <Image
            src={currentBook.coverFront}
            alt={`${currentBook.title} ফ্রন্ট`}
            fill
            priority
            className="object-cover"
            sizes="144px"
          />
        </div>
        <div className="relative w-32 sm:w-36 h-44 sm:h-48 bg-white shadow-md border border-[var(--color-antique-gold)]/40 rounded-xs overflow-hidden shrink-0">
          <Image
            src={currentBook.coverBack}
            alt={`${currentBook.title} ব্যাক`}
            fill
            priority
            className="object-cover"
            sizes="144px"
          />
        </div>
      </div>

      {/* Book Info */}
      <div className="text-center mb-6 pb-5 border-b border-[var(--color-antique-gold)]/30">
        <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--color-ink)] mb-1">
          {currentBook.title}
        </h3>
        <p className="text-xs font-semibold text-[var(--color-accent-green)] tracking-wider mb-1">
          {currentBook.publisher}
        </p>
        <p className="text-sm font-semibold italic text-[var(--color-ink)]/70 font-serif">
          — দীপালী সামুই
        </p>
      </div>

      {/* 5 Poem Selection Tabs */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3 px-1 flex items-center justify-between">
          <span>নমুনা ৫টি কবিতা:</span>
          <span className="text-[11px] text-[var(--color-ink)]/60 italic lowercase">
            {toBengaliNumerals(activePoemIndex + 1)} / {toBengaliNumerals(currentBook.poems.length)}
          </span>
        </div>

        <div className="space-y-2.5">
          {currentBook.poems.map((poem, index) => {
            const isActive = index === activePoemIndex;
            return (
              <button
                key={poem.id}
                onClick={() => onSelectPoem(index)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xs font-serif transition-all duration-200 text-left cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-accent)] text-white shadow-md font-bold translate-x-1.5 border-l-4 border-l-[var(--color-antique-gold)]"
                    : "bg-white/80 hover:bg-white text-[var(--color-ink)] border border-[var(--color-antique-gold)]/30 hover:border-[var(--color-accent)]/60 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  <span className={`text-xs ${isActive ? "text-amber-200 font-bold" : "text-[var(--color-accent)] font-bold"}`}>
                    {toBengaliNumerals(index + 1)}.
                  </span>
                  <span className="text-base truncate font-semibold">
                    {poem.title}
                  </span>
                </div>
                <span className={`text-xs shrink-0 ${isActive ? "text-amber-100 font-bold" : "text-[var(--color-accent)] opacity-80"}`}>
                  {isActive ? "📖 পড়ছে" : "পড়ুন →"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Buy / Contact Button */}
      <div className="mt-6 pt-4 border-t border-[var(--color-antique-gold)]/30">
        <Link
          href="/contact"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-[var(--color-accent)] hover:bg-[#7e2214] text-white border border-[var(--color-accent)] shadow-2xs hover:shadow-xs transition-all duration-300 font-serif font-bold text-xs sm:text-sm text-center group/buy"
        >
          <span>🛒</span>
          <span>বইটি কিনতে চাইলে যোগাযোগ করুন</span>
          <span className="group-hover/buy:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Switch to Other Book Button */}
      <div className="mt-4 pt-3 border-t border-[var(--color-antique-gold)]/20 text-center">
        <button
          onClick={onSwitchBook}
          className="text-xs font-serif font-bold text-[var(--color-accent-green)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
        >
          🔄 অন্য বই দেখুন: ‘{otherBookTitle}’ →
        </button>
      </div>
    </div>
  );
}
