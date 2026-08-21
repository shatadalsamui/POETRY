import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPoemById, formatBengaliDate, getPoems } from "@/lib/data";
import Divider from "@/components/ui/Divider";

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
    <main className="relative min-h-screen max-w-4xl mx-auto px-6 sm:px-8 pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="mb-6 relative z-10 flex items-center justify-between">
        <Link 
          href="/poems" 
          className="inline-flex items-center gap-2 text-[var(--color-ink)] hover:text-[var(--color-accent)] font-semibold transition-colors group"
        >
          <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">&larr;</span> সব কবিতা
        </Link>
        <span className="text-xs font-semibold tracking-widest text-[var(--color-accent-green)] uppercase">
          কবিতা {currentIndex + 1} / {poems.length}
        </span>
      </div>

      <article className="bg-[var(--color-vintage-ivory)]/95 backdrop-blur-md p-10 md:p-20 rounded-sm shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-[var(--color-antique-gold)]/40 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-80" />
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-80" />
        
        <span className="text-sm text-[var(--color-accent-green)] mb-6 tracking-widest font-medium">
          {formatBengaliDate(poem.date)}
        </span>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-16 text-[var(--color-ink)] leading-tight">
          {poem.title}
        </h1>
        
        <div className="w-24 h-[1px] bg-[var(--color-antique-gold)]/50 mb-16" />
        
        <div className="flex flex-col items-center w-full max-w-2xl">
          <div className="text-xl md:text-2xl text-[var(--color-ink)] font-medium leading-[2.5] whitespace-pre-wrap font-serif w-full text-center">
            {poem.content}
          </div>
          <div className="mt-12 text-xl md:text-2xl text-[var(--color-ink)] font-semibold font-serif self-end">
            — দীপালী সামুই
          </div>
        </div>
        
        <div className="w-24 h-[1px] bg-[var(--color-antique-gold)]/50 mt-20 mb-8" />
        
        <p className="text-[var(--color-ink)]/60 italic font-serif">
          সমাপ্ত
        </p>
      </article>

      {/* Next & Previous Navigation Bar */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full relative z-10">
        {prevPoem ? (
          <Link
            href={`/poems/${prevPoem.id}`}
            className="flex flex-col p-4 sm:p-5 bg-[var(--color-vintage-ivory)] border border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)] rounded-sm shadow-sm transition-all hover:-translate-y-0.5 group"
          >
            <span className="text-xs font-semibold text-[var(--color-accent)] tracking-wider uppercase flex items-center gap-1.5 mb-1">
              <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">←</span> পূর্ববর্তী কবিতা
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
              পরবর্তী কবিতা <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
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
