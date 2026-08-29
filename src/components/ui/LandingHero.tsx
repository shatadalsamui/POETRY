"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Divider from "@/components/ui/Divider";
import { motion, AnimatePresence } from "framer-motion";
import { Poem, Story } from "@/lib/data";
import ShareButton from "@/components/ui/ShareButton";

interface LandingHeroProps {
  newPoems: Poem[];
  newStories: Story[];
}

interface WispItem {
  id: string;
  type: "poem" | "story";
  title: string;
  book?: string;
  excerpt: string[];
  href: string;
}

export default function LandingHero({ newPoems, newStories }: LandingHeroProps) {
  // 1. Build list of only new items
  const allNewItems: WispItem[] = [
    ...newPoems.map((p) => {
      const lines = p.content
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      return {
        id: p.id,
        type: "poem" as const,
        title: p.title,
        book: p.book,
        excerpt: lines.slice(0, 2),
        href: `/poems/${p.id}`,
      };
    }),
    ...newStories.map((s) => {
      const sentences = s.content
        .split("।")
        .map((sen) => sen.trim())
        .filter(Boolean);
      const excerpt = sentences.length >= 2 
        ? [sentences[0] + "।", sentences[1] + "।"]
        : [sentences[0] + "।"];
      return {
        id: s.id,
        type: "story" as const,
        title: s.title,
        excerpt: excerpt,
        href: `/stories/${s.id}`,
      };
    }),
  ];

  // 2. Randomly shuffle queue on mount so poems and stories appear evenly on every reload
  const [items, setItems] = useState<WispItem[]>(allNewItems);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allNewItems.length > 0) {
      // True Fisher-Yates random shuffle on every reload
      const shuffled = [...allNewItems];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setItems(shuffled);
      setCurrentIndex(0);
    }
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;

    // Cycle to next item in the shuffled queue every 7.5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 7500);

    return () => clearInterval(interval);
  }, [items.length]);

  const currentItem = items[currentIndex] || items[0];

  return (
    <main className="relative h-[calc(100svh-4rem)] w-full flex flex-col items-center justify-between px-4 sm:px-8 pt-3 pb-3 sm:pt-6 sm:pb-5 overflow-hidden">
      
      {/* Top spacer for optical centering */}
      <div className="w-full shrink-0 h-0 sm:h-2" />

      {/* Central Content — Perfectly vertically centered */}
      <section className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full my-auto">
        
        {/* 1. Big Poetic Quote */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-ink)] leading-snug drop-shadow-sm px-4 font-serif mb-3 sm:mb-4 max-w-5xl"
        >
          <span className="inline-block">"কবিতা আর গল্পে বোনা জীবনের</span>{" "}
          <span className="inline-block">কিছু খণ্ডচিত্র..."</span>
        </motion.h1>

        {/* ========================================================================= */}
        {/* 2. LITERARY SNIPPET (Uniform gap below big quote)                         */}
        {/* ========================================================================= */}
        {currentItem && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full max-w-md sm:max-w-lg px-2 my-1 sm:my-2"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Link
                  href={currentItem.href}
                  className="group block text-left p-3.5 sm:p-4.5 rounded-2xl bg-[#fbf9f4]/60 hover:bg-[#fbf9f4]/95 backdrop-blur-md border border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)]/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(152,43,27,0.15)] transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Top Header Tag */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold font-serif px-2.5 py-0.5 rounded-full bg-[var(--color-accent)] text-white shadow-2xs tracking-wider">
                      ✨ {currentItem.type === "poem" ? "নতুন কবিতা" : "নতুন গল্প"}
                    </span>
                    {currentItem.book ? (
                      <span className="text-[11px] sm:text-xs text-[var(--color-ink)]/70 italic font-serif truncate">
                        ‘{currentItem.book}’ কাব্যগ্রন্থ
                      </span>
                    ) : (
                      <span className="text-[11px] sm:text-xs text-[var(--color-ink)]/70 italic font-serif">
                        {currentItem.type === "poem" ? "কবিতা সংকলন" : "গল্প সংকলন"}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors mb-1.5 line-clamp-1">
                    {currentItem.title}
                  </h3>

                  {/* 2 Lines of Verses / Opening Excerpt */}
                  <div className="text-xs sm:text-sm text-[var(--color-ink)]/85 italic font-serif leading-relaxed line-clamp-2 border-l-2 border-[var(--color-accent)]/50 pl-2.5 mb-2.5">
                    {currentItem.excerpt.map((line, idx) => (
                      <p key={idx} className="line-clamp-1">
                        {line}
                        {idx === currentItem.excerpt.length - 1 ? "..." : ""}
                      </p>
                    ))}
                  </div>

                  {/* Bottom Link Prompt */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-antique-gold)]/20">
                    <ShareButton path={currentItem.href} />
                    <span className="text-[11px] sm:text-xs font-bold text-[var(--color-accent)] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-serif">
                      পড়ুন <span>&rarr;</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* 3. Subtitle / Welcoming line */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-[var(--color-ink)] font-medium max-w-2xl opacity-85 font-serif mt-3 sm:mt-4 mb-2 sm:mb-3"
        >
          দীপালী সামুইয়ের সাহিত্য জগতে আপনাকে স্বাগতম
        </motion.p>

        {/* 4. Ornamental Divider (Below welcoming line) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.4 }}
          className="w-full max-w-xl"
        >
          <Divider className="my-1 sm:my-2" />
        </motion.div>

      </section>
      
      {/* Footer — Permanently visible at bottom without scrolling */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }}
        className="w-full text-center text-[var(--color-ink)]/75 font-medium text-xs sm:text-sm md:text-base z-10 px-4 drop-shadow-xs font-serif shrink-0 pb-1"
      >
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </motion.footer>
    </main>
  );
}
