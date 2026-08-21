import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPoemById, formatBengaliDate, getPoems, toBengaliNumerals } from "@/lib/data";
import Divider from "@/components/ui/Divider";
import Watermark from "@/components/ui/Watermark";

export async function generateStaticParams() {
  const poems = await getPoems();
  return poems.map((poem) => ({
    id: poem.id,
  }));
}

export async function generateMetadata(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const poem = await getPoemById(params.id);
  if (!poem) return { title: "কবিতা পাওয়া যায়নি" };
  return { title: `দীপালী সামুই | ${poem.title}` };
}

export default async function PoemReadingPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const poems = await getPoems();
  const currentIndex = poems.findIndex((p) => p.id === params.id);
  const poem = currentIndex !== -1 ? poems[currentIndex] : undefined;

  if (!poem) {
    notFound();
  }

  const prevPoem = currentIndex > 0 ? poems[currentIndex - 1] : null;
  const nextPoem = currentIndex < poems.length - 1 ? poems[currentIndex + 1] : null;

  return (
    <main className="relative min-h-screen max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-16 md:pt-10 md:pb-20">
      <Watermark />

      {/* Top Breadcrumb Navigation */}
      <div className="mb-6 relative z-10 flex items-center justify-between">
        <Link 
          href="/poems" 
          className="inline-flex items-center gap-2 text-[var(--color-ink)] hover:text-[var(--color-accent)] font-semibold transition-colors group text-sm sm:text-base"
        >
          <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">&larr;</span> সব কবিতা
        </Link>
        <span className="text-xs font-semibold tracking-widest text-[var(--color-accent-green)] uppercase">
          কবিতা {toBengaliNumerals(currentIndex + 1)} / {toBengaliNumerals(poems.length)}
        </span>
      </div>

      {/* The Authentic Printed Book Page Leaf */}
      <article className="bg-[#fbf9f4] border border-[var(--color-antique-gold)]/45 rounded-xs shadow-[0_20px_50px_rgba(0,0,0,0.12),_inset_14px_0_18px_-10px_rgba(0,0,0,0.08)] p-8 sm:p-14 md:p-20 relative overflow-hidden flex flex-col items-center">
        
        {/* Subtle Spine Crease along left edge simulating physical book binding */}
        <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/10 via-black/3 to-transparent pointer-events-none" />
        {/* Fine Crimson Edge Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-85" />

        {/* 1. Running Book Header */}
        <div className="w-full pb-4 mb-12 border-b border-[var(--color-antique-gold)]/40 flex items-center justify-between text-xs sm:text-sm font-serif text-[var(--color-ink)]/70 tracking-wider">
          <span className="font-semibold text-[var(--color-accent)]">দীপালী সামুই</span>
          <span className="italic hidden sm:inline">কবিতা সংকলন</span>
          <span className="text-[var(--color-accent-green)] font-medium">{formatBengaliDate(poem.date)}</span>
        </div>

        {/* 2. Poem Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-[var(--color-ink)] leading-tight text-center font-serif">
          {poem.title}
        </h1>

        {/* Decorative Ornamental Divider */}
        <div className="flex items-center gap-3 mb-12 text-[var(--color-antique-gold)] opacity-75">
          <span className="w-12 h-[1px] bg-current" />
          <span className="text-xs">❦</span>
          <span className="w-12 h-[1px] bg-current" />
        </div>
        
        {/* 3. Poem Verses Body */}
        <div className="flex flex-col items-center w-full max-w-2xl">
          <div className="text-lg sm:text-xl md:text-2xl text-[var(--color-ink)] font-medium leading-[2.6] sm:leading-[2.8] whitespace-pre-wrap font-serif w-full text-center tracking-normal selection:bg-[#982b1b]/15">
            {poem.content}
          </div>

          {/* 4. Author Signature & Stamp */}
          <div className="mt-14 pt-8 border-t border-[var(--color-antique-gold)]/30 flex flex-col items-end self-end">
            <span className="text-lg sm:text-xl font-serif font-semibold text-[var(--color-accent)] italic">
              — দীপালী সামুই
            </span>
          </div>
        </div>
        
        {/* 5. Running Book Page Footer */}
        <div className="w-full mt-16 pt-6 border-t border-[var(--color-antique-gold)]/30 flex items-center justify-center text-xs sm:text-sm font-serif text-[var(--color-ink)]/60">
          <span>— পৃষ্ঠা {toBengaliNumerals(currentIndex + 1)} —</span>
        </div>
      </article>

      {/* Next & Previous Navigation Bar */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full relative z-10">
        {prevPoem ? (
          <Link
            href={`/poems/${prevPoem.id}`}
            className="flex flex-col p-4 sm:p-5 bg-[var(--color-vintage-ivory)] border border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)] rounded-sm shadow-sm transition-all hover:-translate-y-0.5 group"
          >
            <span className="text-xs font-semibold text-[var(--color-accent)] tracking-wider uppercase flex items-center gap-1.5 mb-1">
              <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">←</span> পূর্ববর্তী পাতা
            </span>
            <span className="text-base sm:text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
              {prevPoem.title}
            </span>
          </Link>
        ) : <div className="hidden sm:block" />}

        {nextPoem ? (
          <Link
            href={`/poems/${nextPoem.id}`}
            className="flex flex-col items-end text-right p-4 sm:p-5 bg-[var(--color-vintage-ivory)] border border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)] rounded-sm shadow-sm transition-all hover:-translate-y-0.5 group sm:col-start-2"
          >
            <span className="text-xs font-semibold text-[var(--color-accent)] tracking-wider uppercase flex items-center gap-1.5 mb-1">
              পরবর্তী পাতা <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <span className="text-base sm:text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
              {nextPoem.title}
            </span>
          </Link>
        ) : null}
      </div>

      <Divider />
      
      <footer className="text-center pb-8 pt-4 text-[var(--color-ink)] font-medium text-sm relative z-10">
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </main>
  );
}
