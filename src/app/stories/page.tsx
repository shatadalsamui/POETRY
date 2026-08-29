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
    <main className="relative min-h-screen max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-16">
      <section className="relative z-10 mb-10 sm:mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3 text-center">গল্প</h1>
        <p className="text-center text-[var(--color-ink)] font-medium mb-6 sm:mb-8 max-w-lg mx-auto">
          জীবনের নানা রঙের গল্প, যা আমাদের চারপাশের চেনা মানুষের কথা বলে।
        </p>
        
        <StoriesList stories={stories} />
      </section>
      
      <Divider />
      
      <footer className="text-center pb-8 pt-4 text-[var(--color-ink)] font-medium text-sm relative z-10">
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </main>
  );
}
