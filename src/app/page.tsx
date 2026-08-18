import React from "react";
import Watermark from "@/components/ui/Watermark";
import Divider from "@/components/ui/Divider";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 sm:px-8 py-16">
      <Watermark />

      <section className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto -mt-20">
        
        {/* Big Poetic Quote */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-[var(--color-ink)] leading-snug drop-shadow-sm px-4">
          "কবিতা আর গল্পে বোনা জীবনের কিছু খণ্ডচিত্র..."
        </h1>
        
        <Divider className="my-10" />
        
        {/* Subtitle / Call to action */}
        <p className="text-lg md:text-2xl text-[var(--color-ink)] font-medium max-w-2xl opacity-80">
          দীপালী সামুইয়ের সাহিত্য জগতে আপনাকে স্বাগতম
        </p>

      </section>
      
      <footer className="absolute bottom-8 left-0 right-0 w-full text-center text-[var(--color-ink)] font-medium text-lg md:text-xl z-10 opacity-80 px-4 drop-shadow-sm">
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </main>
  );
}
