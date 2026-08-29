import React from "react";
import Divider from "@/components/ui/Divider";
import { getStories } from "@/lib/data";
import StoriesList from "@/components/ui/StoriesList";

export const metadata = {
  title: "দীপালী সামুই | গল্প",
};

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <main className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-4 min-h-full flex flex-col justify-between">
      <section className="relative z-10 mb-6 sm:mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3 text-center">গল্প</h1>
        <p className="text-center text-[var(--color-ink)] font-medium mb-6 sm:mb-8 max-w-lg mx-auto">
          জীবনের নানা রঙের গল্প, যা আমাদের চারপাশের চেনা মানুষের কথা বলে।
        </p>
        
        <StoriesList stories={stories} />
      </section>
      
      <div className="mt-auto pt-2">
        <Divider />
        <footer className="text-center pb-2 pt-1 text-[var(--color-ink)] font-medium text-xs sm:text-sm relative z-10 opacity-80">
          &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
        </footer>
      </div>
    </main>
  );
}
