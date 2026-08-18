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
  const poem = await getPoemById(params.id);

  if (!poem) {
    notFound();
  }

  return (
    <main className="relative min-h-screen max-w-4xl mx-auto px-6 sm:px-8 pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="mb-6 relative z-10">
        <Link 
          href="/poems" 
          className="inline-flex items-center gap-2 text-[var(--color-ink)] hover:text-[var(--color-accent)] font-semibold transition-colors group"
        >
          <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">&larr;</span> কবিতায় ফিরে যান
        </Link>
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

      <Divider />
      
      <footer className="text-center pb-8 pt-4 text-[var(--color-ink)] font-medium text-sm relative z-10">
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </main>
  );
}
