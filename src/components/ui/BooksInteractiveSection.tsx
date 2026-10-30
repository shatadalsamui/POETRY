"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Poem } from "@/lib/data";
import { StaggerContainer, StaggerItem } from "@/components/ui/Stagger";
import BookShelfCard, { BookInfo } from "@/components/ui/BookShelfCard";
import BookReaderSidebar from "@/components/ui/BookReaderSidebar";
import BookPoemLeaf from "@/components/ui/BookPoemLeaf";

interface BooksInteractiveSectionProps {
  jibonlataPoems: Poem[];
  neelKuyashaPoems: Poem[];
  okhorHridoyerNibhrtoDeepPoems: Poem[];
}

export default function BooksInteractiveSection({
  jibonlataPoems,
  neelKuyashaPoems,
  okhorHridoyerNibhrtoDeepPoems,
}: BooksInteractiveSectionProps) {
  // selectedBook: null | "jibonlata" | "neel-kuyasha" | "okhor-hridoyer-nibhrito-deep"
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [activePoemIndex, setActivePoemIndex] = useState<number>(0);
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);

  const readingContainerRef = useRef<HTMLDivElement>(null);

  const booksData: Record<string, BookInfo> = {
    "okhor-hridoyer-nibhrito-deep": {
      id: "okhor-hridoyer-nibhrito-deep",
      title: "অক্ষর হৃদয়ের নিভৃত দীপ",
      publisher: "নোটবুক পাবলিশার্স",
      coverFront: "/b31.jpg",
      coverBack: "/b32.jpg",
      poems: okhorHridoyerNibhrtoDeepPoems,
    },
    "neel-kuyasha": {
      id: "neel-kuyasha",
      title: "নীল কুয়াশা",
      publisher: "নোটবুক পাবলিশার্স • কলকাতা আন্তর্জাতিক বইমেলা ২০২৬",
      coverFront: "/b21.jpg",
      coverBack: "/b22.jpg",
      poems: neelKuyashaPoems,
    },
    jibonlata: {
      id: "jibonlata",
      title: "জীবনলতা",
      publisher: "ধানসিড়ি প্রকাশনা • কলকাতা আন্তর্জাতিক বইমেলা ২০২৫",
      coverFront: "/b11.jpg",
      coverBack: "/b12.jpg",
      poems: jibonlataPoems,
    },
  };

  const currentBook = selectedBook ? booksData[selectedBook] : null;
  const currentPoem = currentBook ? currentBook.poems[activePoemIndex] : null;

  const scrollToPoemTop = (instant = false) => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: instant ? ("instant" as ScrollBehavior) : "smooth",
      });
      const scrollContainer = document.getElementById("main-scroll-container");
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: 0,
          behavior: instant ? ("instant" as ScrollBehavior) : "smooth",
        });
      }
    }
  };

  useEffect(() => {
    if (selectedBook !== null) {
      scrollToPoemTop(true);
      const timer = setTimeout(() => {
        scrollToPoemTop(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activePoemIndex, selectedBook]);

  const handleSelectPoem = (bookKey: string, poemIndex: number) => {
    setSelectedBook(bookKey);
    setActivePoemIndex(poemIndex);
    setOpenDrawer(null);
    scrollToPoemTop(true);
    setTimeout(() => {
      scrollToPoemTop(false);
    }, 50);
    setTimeout(() => {
      scrollToPoemTop(false);
    }, 360);
  };

  const handleNextPoem = () => {
    if (currentBook && activePoemIndex < currentBook.poems.length - 1) {
      setActivePoemIndex((prev) => prev + 1);
      scrollToPoemTop();
    }
  };

  const handlePrevPoem = () => {
    if (activePoemIndex > 0) {
      setActivePoemIndex((prev) => prev - 1);
      scrollToPoemTop();
    }
  };

  const handleSelectPoemFromList = (index: number) => {
    setActivePoemIndex(index);
    scrollToPoemTop();
  };

  const bookKeys = Object.keys(booksData);

  const handleSwitchBook = () => {
    if (!selectedBook) return;
    const currentIdx = bookKeys.indexOf(selectedBook);
    const nextIdx = (currentIdx + 1) % bookKeys.length;
    const nextBookKey = bookKeys[nextIdx];
    setSelectedBook(nextBookKey);
    setActivePoemIndex(0);
    scrollToPoemTop(true);
    setTimeout(() => {
      scrollToPoemTop(false);
    }, 360);
  };

  const nextBookKey = selectedBook ? bookKeys[(bookKeys.indexOf(selectedBook) + 1) % bookKeys.length] : "";
  const otherBookTitle = nextBookKey ? booksData[nextBookKey]?.title : "";

  return (
    <div>
      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* 📚 VIEW 1: 2-COLUMN VERTICAL GRID (JUST LIKE THE POEMS PAGE)               */}
        {/* ========================================================================= */}
        {!selectedBook && (
          <motion.div
            key="all-books"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
              {Object.values(booksData).map((book) => (
                <StaggerItem key={book.id}>
                  <BookShelfCard
                    book={book}
                    isOpen={openDrawer === book.id}
                    onToggleOpen={() =>
                      setOpenDrawer(openDrawer === book.id ? null : book.id)
                    }
                    onSelectPoem={(poemIndex) => handleSelectPoem(book.id, poemIndex)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 📖 VIEW 2: SIDE-BY-SIDE SPLIT VIEW (Selected Book on Left + Poem Card on Right) */}
        {/* ========================================================================= */}
        {selectedBook && currentBook && currentPoem && (
          <motion.div
            key="reading-mode"
            ref={readingContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-antique-gold)]/40 relative z-10">
              <button
                onClick={() => setSelectedBook(null)}
                className="inline-flex items-center gap-2 text-sm sm:text-base font-serif font-bold text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors cursor-pointer group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span>সব বই দেখুন (তালিকায় ফিরুন)</span>
              </button>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-serif text-[var(--color-accent-green)] font-semibold">
                <span>‘{currentBook.title}’ কাব্যগ্রন্থের কবিতা পাঠ</span>
              </div>
            </div>

            {/* Wide Side-by-Side Flex Layout */}
            <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start w-full">
              {/* 👈 LEFT COLUMN: Selected Book Card */}
              <BookReaderSidebar
                currentBook={currentBook}
                activePoemIndex={activePoemIndex}
                onSelectPoem={handleSelectPoemFromList}
                onSwitchBook={handleSwitchBook}
                otherBookTitle={otherBookTitle}
              />

              {/* 👉 RIGHT COLUMN: Full Sized Authentic Printed Poem Card / Leaf */}
              <div className="flex-1 w-full min-w-0">
                <BookPoemLeaf
                  currentBook={currentBook}
                  currentPoem={currentPoem}
                  activePoemIndex={activePoemIndex}
                  totalPoems={currentBook.poems.length}
                  onPrevPoem={handlePrevPoem}
                  onNextPoem={handleNextPoem}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
