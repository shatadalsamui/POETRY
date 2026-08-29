"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Poem, toBengaliNumerals } from "@/lib/data";

export interface BookInfo {
  id: string;
  title: string;
  publisher: string;
  coverFront: string;
  coverBack: string;
  poems: Poem[];
}

interface BookShelfCardProps {
  book: BookInfo;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectPoem: (poemIndex: number) => void;
}

export default function BookShelfCard({
  book,
  isOpen,
  onToggleOpen,
  onSelectPoem,
}: BookShelfCardProps) {
  return (
    <div className="flex flex-col items-center group bg-[var(--color-vintage-ivory)] p-6 sm:p-7 rounded-sm border-2 border-[var(--color-antique-gold)]/40 shadow-xl relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-80" />

      {/* Front and Back Covers */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-5 w-full relative z-10">
        <div className="relative w-44 sm:w-48 md:w-52 h-62 sm:h-68 md:h-70 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-[var(--color-antique-gold)]/40 flex-shrink-0 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(179,139,77,0.25)]">
          <Image
            src={book.coverFront}
            alt={`${book.title} প্রচ্ছদ`}
            fill
            priority
            className="object-cover"
            sizes="208px"
          />
          <div className="absolute left-0 inset-y-0 w-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none" />
        </div>
        <div className="relative w-44 sm:w-48 md:w-52 h-62 sm:h-68 md:h-70 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-[var(--color-antique-gold)]/40 flex-shrink-0 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(179,139,77,0.25)]">
          <Image
            src={book.coverBack}
            alt={`${book.title} ব্যাক কভার`}
            fill
            priority
            className="object-cover"
            sizes="208px"
          />
          <div className="absolute right-0 inset-y-0 w-3 bg-gradient-to-l from-black/40 via-black/10 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Book Details */}
      <div className="text-center w-full relative z-10 mb-3.5">
        <h3 className="text-2xl sm:text-3xl font-bold mb-1.5 text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)] font-serif">
          {book.title}
        </h3>
        <p className="text-sm font-semibold text-[var(--color-accent-green)] tracking-wider mb-0.5">
          {book.publisher}
        </p>
        <p className="text-sm sm:text-base font-semibold italic text-[var(--color-ink)]/75 font-serif">
          — দীপালী সামুই
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full mt-1 pt-3.5 border-t border-[var(--color-antique-gold)]/30 relative z-10 space-y-2.5">
        {/* Collapsible Dropdown for 5 Poems */}
        <button
          onClick={onToggleOpen}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 rounded-sm bg-[#fbf9f4] hover:bg-white border border-[var(--color-antique-gold)]/40 shadow-2xs hover:shadow-xs transition-all duration-300 group/btn cursor-pointer"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2.5 text-sm sm:text-base font-serif font-bold text-[var(--color-ink)] group-hover/btn:text-[var(--color-accent)] transition-colors">
            <span className="text-base sm:text-lg">📖</span>
            <span>নমুনা কবিতা পড়ুন ({toBengaliNumerals(book.poems.length)}টি কবিতা)</span>
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-[var(--color-antique-gold)] font-bold group-hover/btn:text-[var(--color-accent)]"
          >
            ▼
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-1 mb-2 space-y-2 p-3 rounded-xs bg-[#fdfbf7] border border-[var(--color-antique-gold)]/30 shadow-inner">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-accent-green)] mb-2 px-1 flex items-center justify-between">
                  <span>নমুনা কবিতা তালিকা:</span>
                  <span className="italic lowercase text-[var(--color-ink)]/60">ক্লিক করে পড়ুন</span>
                </div>

                {book.poems.map((poem, index) => (
                  <button
                    key={poem.id}
                    onClick={() => onSelectPoem(index)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xs bg-white/85 hover:bg-white border border-[var(--color-antique-gold)]/25 hover:border-[var(--color-accent)] shadow-2xs hover:shadow-xs transition-all duration-200 group/item cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2 font-serif">
                      <span className="text-xs font-bold text-[var(--color-accent)]">
                        {toBengaliNumerals(index + 1)}.
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-[var(--color-ink)] group-hover/item:text-[var(--color-accent)] transition-colors truncate">
                        {poem.title}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[var(--color-accent)] uppercase opacity-80 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all shrink-0">
                      পড়ুন →
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buy / Contact Button */}
        <Link
          href="/contact"
          className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-sm bg-[var(--color-accent)] hover:bg-[#7e2214] text-white border border-[var(--color-accent)] shadow-sm hover:shadow-md transition-all duration-300 group/buy font-serif font-bold text-sm sm:text-base text-center cursor-pointer"
        >
          <span className="text-base">🛒</span>
          <span>বইটি কিনতে চাইলে যোগাযোগ করুন</span>
          <span className="group-hover/buy:translate-x-1 transition-transform font-bold">→</span>
        </Link>
      </div>
    </div>
  );
}
