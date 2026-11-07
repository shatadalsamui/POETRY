"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Poem, formatBengaliDate, toBengaliNumerals, getLatestPoemBatch } from "@/lib/data";
import { StaggerContainer, StaggerItem } from "@/components/ui/Stagger";
import ShareButton from "@/components/ui/ShareButton";

interface PoemsListWithFilterProps {
  poems: Poem[];
}

const ITEMS_PER_PAGE = 20;

export default function PoemsListWithFilter({ poems }: PoemsListWithFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const latestBatch = getLatestPoemBatch(poems);

  // Reset pagination count when filter tab changes
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPoems = poems.filter((p) => {
    const matchesBook =
      selectedFilter === "all" ||
      p.book === selectedFilter ||
      p.bookId === selectedFilter;
    if (!matchesBook) return false;
    if (!normalizedQuery) return true;

    return (
      p.title.toLowerCase().includes(normalizedQuery) ||
      p.content.toLowerCase().includes(normalizedQuery) ||
      (p.book && p.book.toLowerCase().includes(normalizedQuery)) ||
      p.id.toLowerCase().includes(normalizedQuery)
    );
  });

  const displayedPoems = filteredPoems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPoems.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
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

  const jibonlataCount = poems.filter(
    (p) => p.book === "জীবনলতা" || p.bookId === "jibonlata"
  ).length;
  const neelKuyashaCount = poems.filter(
    (p) => p.book === "নীল কুয়াশা" || p.bookId === "neel-kuyasha"
  ).length;
  const okhorHridoyerCount = poems.filter(
    (p) =>
      p.book === "অক্ষর হৃদয়ের নিভৃত দীপ" ||
      p.bookId === "okhor-hridoyer-nibhrito-deep"
  ).length;

  return (
    <div>
      {/* Instant Poem Search Input */}
      <div className="max-w-md mx-auto mb-6 relative z-10">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[var(--color-antique-gold)] absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            placeholder="কবিতার নাম বা পঙক্তি খুঁজুন..."
            aria-label="কবিতা খুঁজুন"
            className="w-full pl-10 pr-9 py-2.5 rounded-full bg-[#fbf9f4]/95 border border-[var(--color-antique-gold)]/45 focus:border-[var(--color-accent)] focus:outline-none shadow-2xs text-sm font-serif text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/45 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="অনুসন্ধান মুছুন"
              className="absolute right-3 p-1 rounded-full text-[var(--color-ink)]/60 hover:text-[var(--color-accent)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

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
          onClick={() => handleFilterChange("অক্ষর হৃদয়ের নিভৃত দীপ")}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-serif font-semibold transition-all duration-300 cursor-pointer border ${
            selectedFilter === "অক্ষর হৃদয়ের নিভৃত দীপ"
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md scale-105"
              : "bg-[var(--color-vintage-ivory)]/90 text-[var(--color-ink)] border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)]"
          }`}
        >
          📖 অক্ষর হৃদয়ের নিভৃত দীপ ({toBengaliNumerals(okhorHridoyerCount)})
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
      </div>

      {/* Empty Search State */}
      {displayedPoems.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#fbf9f4]/90 border border-[var(--color-antique-gold)]/35 rounded-sm max-w-md mx-auto">
          <p className="font-serif text-base text-[var(--color-ink)]/80 mb-3">
            আপনার অনুসন্ধান অনুযায়ী কোনো কবিতা পাওয়া যায়নি।
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedFilter("all");
            }}
            className="px-4 py-1.5 rounded-full bg-[var(--color-accent)] text-white text-xs font-serif font-semibold cursor-pointer"
          >
            সব কবিতা দেখুন
          </button>
        </div>
      ) : (
        /* Poems Grid */
        <StaggerContainer
          key={`${selectedFilter}-${normalizedQuery}`}
          delay={normalizedQuery ? 0.02 : 0.06}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
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
                  <p className="text-base text-[var(--color-ink)]/75 font-serif line-clamp-3 mb-8 leading-relaxed text-center">
                    {poem.content}
                  </p>
                  <div className="mt-auto w-full pt-2 flex items-center justify-between border-t border-[var(--color-antique-gold)]/25">
                    <ShareButton
                      path={`/poems/${poem.id}`}
                      title={poem.title}
                      content={poem.content}
                      date={poem.date}
                      book={poem.book}
                      type="poem"
                    />
                    <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-[var(--color-accent)] uppercase group-hover:gap-3 transition-all font-serif">
                      পড়ুন <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

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
