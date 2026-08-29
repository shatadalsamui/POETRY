"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Story, formatBengaliDate, getLatestStoryBatch } from "@/lib/data";
import { StaggerContainer, StaggerItem } from "@/components/ui/Stagger";

interface StoriesListProps {
  stories: Story[];
}

const ITEMS_PER_PAGE = 20;

export default function StoriesList({ stories }: StoriesListProps) {
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const latestBatch = getLatestStoryBatch(stories);
  const displayedStories = stories.slice(0, visibleCount);
  const hasMore = visibleCount < stories.length;

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

  return (
    <div>
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayedStories.map((story) => (
          <StaggerItem key={story.id}>
            <Link href={`/stories/${story.id}`} className="block h-full group">
              <article className="h-full bg-[var(--color-vintage-ivory)]/95 backdrop-blur-md p-8 md:p-10 rounded-sm shadow-sm border border-[var(--color-antique-gold)]/40 relative overflow-hidden group-hover:shadow-[0_10px_30px_rgb(179,139,77,0.15)] transition-all duration-500 flex flex-col group-hover:-translate-y-1">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-80" />
                
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-sm text-[var(--color-ink)] font-medium block tracking-wider">
                    {formatBengaliDate(story.date)}
                  </span>
                  {latestBatch > 0 && story.batch === latestBatch && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-serif bg-[var(--color-accent)] text-white shadow-xs tracking-wider">
                      ✨ নতুন
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-6 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2 font-serif">
                  {story.title}
                </h3>
                <p className="text-lg text-[var(--color-ink)]/70 leading-relaxed text-justify line-clamp-4 mb-8 font-serif">
                  {story.content}
                </p>
                <div className="mt-auto pt-4">
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
            <span>আরও গল্প লোড হচ্ছে...</span>
          </div>
        </div>
      )}
    </div>
  );
}
