import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoryById, formatBengaliDate, getStories } from "@/lib/data";
import Divider from "@/components/ui/Divider";

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

  const prevStory = currentIndex > 0 ? stories[currentIndex - 1] : null;
  const nextStory = currentIndex < stories.length - 1 ? stories[currentIndex + 1] : null;

  // Simple splitting by double newline to create paragraphs
  const paragraphs = story.content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <main className="relative min-h-screen max-w-4xl mx-auto px-6 sm:px-8 pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="mb-6 relative z-10 flex items-center justify-between">
        <Link 
          href="/stories" 
          className="inline-flex items-center gap-2 text-[var(--color-ink)] hover:text-[var(--color-accent-green)] font-semibold transition-colors group"
        >
          <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">&larr;</span> সব গল্প
        </Link>
        <span className="text-xs font-semibold tracking-widest text-[var(--color-accent-green)] uppercase">
          গল্প {currentIndex + 1} / {stories.length}
        </span>
      </div>

      <article className="bg-[var(--color-vintage-ivory)]/95 backdrop-blur-md p-10 md:p-20 rounded-sm shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-[var(--color-antique-gold)]/40 relative overflow-hidden flex flex-col">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[var(--color-accent-green)] to-[#113624] opacity-80" />
        
        <header className="text-center mb-16">
          <span className="text-sm text-[var(--color-ink)]/70 mb-6 tracking-widest font-medium block">
            {formatBengaliDate(story.date)}
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-[var(--color-ink)] leading-tight">
            {story.title}
          </h1>
          
          <div className="w-24 h-[1px] bg-[var(--color-antique-gold)]/50 mx-auto" />
        </header>
        
        <div className="flex flex-col items-center w-full">
          <div className="text-lg md:text-xl text-[var(--color-ink)] font-medium leading-loose text-justify font-serif space-y-8 w-full">
            {paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-12 text-xl md:text-2xl text-[var(--color-ink)] font-semibold font-serif self-end">
            — দীপালী সামুই
          </div>
        </div>
        
        <div className="w-24 h-[1px] bg-[var(--color-antique-gold)]/50 mx-auto mt-20 mb-8" />
        
        <p className="text-[var(--color-ink)]/60 italic font-serif text-center">
          সমাপ্ত
        </p>
      </article>

      {/* Next & Previous Story Navigation */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full relative z-10">
        {prevStory ? (
          <Link
            href={`/stories/${prevStory.id}`}
            className="flex flex-col p-4 sm:p-5 bg-[var(--color-vintage-ivory)] border border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent-green)] rounded-sm shadow-sm transition-all hover:-translate-y-0.5 group"
          >
            <span className="text-xs font-semibold text-[var(--color-accent-green)] tracking-wider uppercase flex items-center gap-1.5 mb-1">
              <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">←</span> পূর্ববর্তী গল্প
            </span>
            <span className="text-base sm:text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent-green)] transition-colors line-clamp-1">
              {prevStory.title}
            </span>
          </Link>
        ) : <div className="hidden sm:block" />}

        {nextStory ? (
          <Link
            href={`/stories/${nextStory.id}`}
            className="flex flex-col items-end text-right p-4 sm:p-5 bg-[var(--color-vintage-ivory)] border border-[var(--color-antique-gold)]/40 hover:border-[var(--color-accent-green)] rounded-sm shadow-sm transition-all hover:-translate-y-0.5 group sm:col-start-2"
          >
            <span className="text-xs font-semibold text-[var(--color-accent-green)] tracking-wider uppercase flex items-center gap-1.5 mb-1">
              পরবর্তী গল্প <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <span className="text-base sm:text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent-green)] transition-colors line-clamp-1">
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
