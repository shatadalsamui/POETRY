import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoryById, formatBengaliDate, getStories, toBengaliNumerals, getLatestStoryBatch } from "@/lib/data";
import Divider from "@/components/ui/Divider";
import ShareButton from "@/components/ui/ShareButton";

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.map((story) => ({
    id: story.id,
  }));
}

export async function generateMetadata(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const story = await getStoryById(params.id);
  if (!story) return { title: "গল্প পাওয়া যায়নি" };
  return { title: `দীপালী সামুই | ${story.title}` };
}

export default async function StoryReadingPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const stories = await getStories();
  const currentIndex = stories.findIndex((s) => s.id === params.id);
  const story = currentIndex !== -1 ? stories[currentIndex] : undefined;

  if (!story) {
    notFound();
  }

  const latestBatch = getLatestStoryBatch(stories);
  const isNew = latestBatch > 0 && story.batch === latestBatch;
  const prevStory = currentIndex > 0 ? stories[currentIndex - 1] : null;
  const nextStory = currentIndex < stories.length - 1 ? stories[currentIndex + 1] : null;

  // Simple splitting by double newline to create paragraphs
  const paragraphs = story.content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <main className="relative min-h-screen max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-16 md:pt-10 md:pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="mb-6 relative z-10 flex items-center justify-between">
        <Link 
          href="/stories" 
          className="inline-flex items-center gap-2 text-[var(--color-ink)] hover:text-[var(--color-accent)] font-semibold transition-colors group text-sm sm:text-base"
        >
          <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">&larr;</span> সব গল্প
        </Link>
        <span className="text-xs font-semibold tracking-widest text-[var(--color-accent-green)] uppercase">
          গল্প {toBengaliNumerals(currentIndex + 1)} / {toBengaliNumerals(stories.length)}
        </span>
      </div>

      {/* The Authentic Printed Book Page Leaf */}
      <article className={`bg-[#fbf9f4] border border-[var(--color-antique-gold)]/45 rounded-xs shadow-[0_20px_50px_rgba(0,0,0,0.12),_inset_14px_0_18px_-10px_rgba(0,0,0,0.08)] px-4 pb-8 sm:px-14 sm:pb-14 md:px-20 md:pb-20 relative overflow-hidden flex flex-col items-center ${isNew ? 'pt-3.5 sm:pt-4 md:pt-5' : 'pt-6 sm:pt-8 md:pt-10'}`}>
        
        {/* Subtle Spine Crease along left edge simulating physical book binding */}
        <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/10 via-black/3 to-transparent pointer-events-none" />
        {/* Fine Crimson Edge Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-85" />

        {/* Absolute Top Badge for New Additions */}
        {isNew && (
          <div className="mb-3.5 sm:mb-4 md:mb-5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full text-xs font-bold font-serif bg-[var(--color-accent)] text-white shadow-sm tracking-wider">
              ✨ নতুন গল্প
            </span>
          </div>
        )}

        {/* 1. Running Book Header (with Top-Right Share Button) */}
        <div className="w-full pb-4 mb-12 border-b border-[var(--color-antique-gold)]/40 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs sm:text-sm font-serif text-[var(--color-ink)]/70 tracking-wider">
          <div className="flex items-center gap-2">
            <span className="italic text-[var(--color-accent-green)] font-medium">গল্প সংকলন</span>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <span className="text-[var(--color-accent-green)] font-medium">{formatBengaliDate(story.date)}</span>
            <ShareButton path={`/stories/${story.id}`} />
          </div>
        </div>

        {/* 2. Story Title */}
        <header className="text-center mb-10 flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[var(--color-ink)] leading-tight font-serif">
            {story.title}
          </h1>

          {/* Decorative Ornamental Divider */}
          <div className="flex items-center justify-center gap-3 text-[var(--color-antique-gold)] opacity-75">
            <span className="w-12 h-[1px] bg-current" />
            <span className="text-xs">❦</span>
            <span className="w-12 h-[1px] bg-current" />
          </div>
        </header>
        
        {/* 3. Story Paragraphs Body */}
        <div className="flex flex-col items-center w-full">
          <div className="text-lg sm:text-xl text-[var(--color-ink)] font-medium leading-loose text-justify font-serif space-y-8 w-full selection:bg-[#113624]/15">
            {paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* 4. Author Signature & Stamp */}
          <div className="mt-14 pt-8 border-t border-[var(--color-antique-gold)]/30 flex flex-col items-end self-end">
            <span className="text-base sm:text-xl font-serif font-semibold text-[var(--color-accent)] italic">
              — দীপালী সামুই
            </span>
          </div>
        </div>
        
        {/* 5. Running Book Page Footer (with Bottom-Right Share Button) */}
        <div className="w-full mt-12 sm:mt-16 pt-4 sm:pt-6 border-t border-[var(--color-antique-gold)]/30 flex items-center justify-between text-xs sm:text-sm font-serif text-[var(--color-ink)]/60">
          <span className="w-20 hidden sm:inline-block" />
          <span className="font-medium text-center">— পৃষ্ঠা {toBengaliNumerals(currentIndex + 1)} —</span>
          <ShareButton path={`/stories/${story.id}`} />
        </div>
      </article>

      {/* Next & Previous Story Navigation */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full relative z-10">
        {prevStory ? (
          <Link
            href={`/stories/${prevStory.id}`}
            className="flex flex-col p-4 sm:p-5 bg-[var(--color-vintage-ivory)] border border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)] rounded-sm shadow-sm transition-all hover:-translate-y-0.5 group"
          >
            <span className="text-xs font-semibold text-[var(--color-accent)] tracking-wider uppercase flex items-center gap-1.5 mb-1">
              <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">←</span> পূর্ববর্তী পাতা
            </span>
            <span className="text-base sm:text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
              {prevStory.title}
            </span>
          </Link>
        ) : <div className="hidden sm:block" />}

        {nextStory ? (
          <Link
            href={`/stories/${nextStory.id}`}
            className="flex flex-col items-end text-right p-4 sm:p-5 bg-[var(--color-vintage-ivory)] border border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent)] rounded-sm shadow-sm transition-all hover:-translate-y-0.5 group sm:col-start-2"
          >
            <span className="text-xs font-semibold text-[var(--color-accent)] tracking-wider uppercase flex items-center gap-1.5 mb-1">
              পরবর্তী পাতা <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <span className="text-base sm:text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
              {nextStory.title}
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
