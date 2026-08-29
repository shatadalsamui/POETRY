"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Poem, formatBengaliDate, toBengaliNumerals, getLatestPoemBatch } from "@/lib/data";
import { StaggerContainer, StaggerItem } from "@/components/ui/Stagger";

interface PoemsListWithFilterProps {
  poems: Poem[];
}

const ITEMS_PER_PAGE = 20;

export default function PoemsListWithFilter({ poems }: PoemsListWithFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const latestBatch = getLatestPoemBatch(poems);

  // Reset pagination count when filter tab changes
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const filteredPoems = selectedFilter === "all" 
    ? poems 
    : poems.filter(p => p.book === selectedFilter || p.bookId === selectedFilter);

  const displayedPoems = filteredPoems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPoems.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    }
  }, [hasMore]);

  // Infinite scroll trigger via IntersectionObserver
  useEffect(() => {
    const observerTarget = loadMoreRef.current;
    if (!observerTarget || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(observerTarget);

    return () => {
      if (observerTarget) observer.unobserve(observerTarget);
    };
  }, [hasMore, loadMore]);

  const jibonlataCount = poems.filter(p => p.book === "জীবনলতা" || p.bookId === "jibonlata").length;
  const neelKuyashaCount = poems.filter(p => p.book === "নীল কুয়াশা" || p.bookId === "neel-kuyasha").length;

  return (
    <div>
      {/* Book Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-8 relative z-10">
        <button
          onClick={() => handleFilterChange("all")}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-serif font-semibold transition-all duration-300 cursor-pointer border ${
            selectedFilter === "all"
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md scale-105"
              : "bg-[var(--color-vintage-ivory)]/90 text-[var(--color-ink)] border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)]"
          }`}
        >
          সব কবিতা ({toBengaliNumerals(poems.length)})
        </button>

        <button
          onClick={() => handleFilterChange("জীবনলতা")}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-serif font-semibold transition-all duration-300 cursor-pointer border ${
            selectedFilter === "জীবনলতা"
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md scale-105"
              : "bg-[var(--color-vintage-ivory)]/90 text-[var(--color-ink)] border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)]"
          }`}
        >
          📖 জীবনলতা ({toBengaliNumerals(jibonlataCount)})
        </button>

        <button
          onClick={() => handleFilterChange("নীল কুয়াশা")}
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
        {displayedPoems.map((poem) => (
          <StaggerItem key={poem.id}>
            <Link href={`/poems/${poem.id}`} className="block h-full group">
              <article className="h-full bg-[var(--color-vintage-ivory)]/95 backdrop-blur-md p-8 md:p-10 rounded-sm shadow-sm border border-[var(--color-antique-gold)]/40 relative overflow-hidden group-hover:shadow-[0_10px_30px_rgb(179,139,77,0.15)] transition-all duration-500 flex flex-col items-center text-center group-hover:-translate-y-1">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-80" />
                
                {/* Badges Row */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                  {latestBatch > 0 && poem.batch === latestBatch && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-serif bg-[var(--color-accent)] text-white shadow-xs tracking-wider">
                      ✨ নতুন
                    </span>
                  )}
                  {poem.book && (
                    <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold font-serif tracking-wider uppercase bg-[var(--color-antique-gold)]/15 text-[var(--color-accent)] border border-[var(--color-antique-gold)]/30">
                      ‘{poem.book}’ কাব্যগ্রন্থ
                    </span>
                  )}
                </div>

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

      {/* Infinite Scroll Sentinel / Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="w-full py-8 flex items-center justify-center relative z-10">
          <div className="flex items-center gap-2 text-xs font-serif text-[var(--color-antique-gold)] font-medium">
            <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            <span>আরও কবিতা লোড হচ্ছে...</span>
          </div>
        </div>
      )}
    </div>
  );
}
