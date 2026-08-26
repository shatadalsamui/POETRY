import React from "react";
import Divider from "@/components/ui/Divider";
import BooksInteractiveSection from "@/components/ui/BooksInteractiveSection";
import { getPoemsByBook } from "@/lib/data";

export const metadata = {
  title: "দীপালী সামুই | প্রকাশিত কাব্যগ্রন্থ",
};

export default async function BooksPage() {
  const jibonlataPoems = await getPoemsByBook("জীবনলতা");
  const neelKuyashaPoems = await getPoemsByBook("নীল কুয়াশা");

  return (
    <main className="relative min-h-screen max-w-[1380px] mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-16">
      <section className="relative z-10 mb-10 sm:mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3 text-center">প্রকাশিত কাব্যগ্রন্থ</h1>
        <p className="text-center text-[var(--color-ink)] font-medium mb-6 sm:mb-8 max-w-lg mx-auto opacity-85">
          আমার লেখা কিছু কাব্যগ্রন্থ, যা পাঠকদের কাছে পৌঁছেছে।
        </p>
        
        <BooksInteractiveSection 
          jibonlataPoems={jibonlataPoems}
          neelKuyashaPoems={neelKuyashaPoems}
        />
      </section>
      
      <Divider />
      
      <footer className="text-center pb-8 pt-4 text-[var(--color-ink)] font-medium text-sm relative z-10">
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </main>
  );
}
