"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Poem, formatBengaliDate, toBengaliNumerals } from "@/lib/data";
import { StaggerContainer, StaggerItem } from "@/components/ui/Stagger";

interface PoemsListWithFilterProps {
  poems: Poem[];
}

export default function PoemsListWithFilter({ poems }: PoemsListWithFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredPoems = selectedFilter === "all" 
    ? poems 
    : poems.filter(p => p.book === selectedFilter || p.bookId === selectedFilter);

  const jibonlataCount = poems.filter(p => p.book === "জীবনলতা" || p.bookId === "jibonlata").length;
  const neelKuyashaCount = poems.filter(p => p.book === "নীল কুয়াশা" || p.bookId === "neel-kuyasha").length;

  return (
    <div>
      {/* Book Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-8 relative z-10">
        <button
          onClick={() => setSelectedFilter("all")}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-serif font-semibold transition-all duration-300 cursor-pointer border ${
            selectedFilter === "all"
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md scale-105"
              : "bg-[var(--color-vintage-ivory)]/90 text-[var(--color-ink)] border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)]"
          }`}
        >
          সব কবিতা ({toBengaliNumerals(poems.length)})
        </button>

        <button
          onClick={() => setSelectedFilter("জীবনলতা")}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-serif font-semibold transition-all duration-300 cursor-pointer border ${
            selectedFilter === "জীবনলতা"
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md scale-105"
              : "bg-[var(--color-vintage-ivory)]/90 text-[var(--color-ink)] border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)]"
          }`}
        >
          📖 জীবনলতা ({toBengaliNumerals(jibonlataCount)})
        </button>

        <button
          onClick={() => setSelectedFilter("নীল কুয়াশা")}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-serif font-semibold transition-all duration-300 cursor-pointer border ${
            selectedFilter === "নীল কুয়াশা"
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md scale-105"
              : "bg-[var(--color-vintage-ivory)]/90 text-[var(--color-ink)] border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)]"
          }`}
        >
          📖 নীল কুয়াশা ({toBengaliNumerals(neelKuyashaCount)})
        </button>
      </div>

      {/* Poems Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPoems.map((poem) => (
          <StaggerItem key={poem.id}>
            <Link href={`/poems/${poem.id}`} className="block h-full group">
              <article className="h-full bg-[var(--color-vintage-ivory)]/95 backdrop-blur-md p-8 md:p-10 rounded-sm shadow-sm border border-[var(--color-antique-gold)]/40 relative overflow-hidden group-hover:shadow-[0_10px_30px_rgb(179,139,77,0.15)] transition-all duration-500 flex flex-col items-center text-center group-hover:-translate-y-1">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-80" />
                
                {/* Book Badge */}
                {poem.book && (
                  <span className="inline-block px-3 py-1 mb-3 rounded-full text-[11px] font-semibold font-serif tracking-wider uppercase bg-[var(--color-antique-gold)]/15 text-[var(--color-accent)] border border-[var(--color-antique-gold)]/30">
                    ‘{poem.book}’ কাব্যগ্রন্থ
                  </span>
                )}

                <span className="text-xs text-[var(--color-accent-green)] mb-3 tracking-widest font-medium">
                  {formatBengaliDate(poem.date)}
                </span>
                <h3 className="text-2xl font-bold mb-5 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2 font-serif text-[var(--color-ink)]">
                  {poem.title}
                </h3>
                <p className="text-base text-[var(--color-ink)]/75 font-serif line-clamp-3 mb-8 leading-relaxed">
                  {poem.content}
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-[var(--color-accent)] uppercase group-hover:gap-3 transition-all">
                    পড়ুন <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </article>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
