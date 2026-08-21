import React from "react";
import Image from "next/image";
import Watermark from "@/components/ui/Watermark";
import Divider from "@/components/ui/Divider";

export default function Home() {
  return (
    <main className="relative min-h-screen max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
      <Watermark />

      <section className="relative z-10 mb-20 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-center">পরিচিতি</h1>

        {/* Vintage Parchment Paper Frame */}
        <div className="bg-[var(--color-vintage-ivory)] border-2 border-[var(--color-antique-gold)]/40 rounded-sm shadow-xl p-8 md:p-14 flex flex-col md:flex-row items-center gap-10 md:gap-14 relative overflow-hidden">
          {/* Decorative Crimson Accent Bar */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12]" />
          
          {/* Profile Picture */}
          <div className="relative shrink-0 w-56 md:w-64 shadow-xl border-4 border-white rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
            <img
              src="/p1.jpg"
              alt="দীপালী সামুই"
              className="w-full h-auto object-contain"
            />
          </div>
          
          {/* Text Content */}
          <div className="flex flex-col text-center md:text-left">
            <p className="text-lg md:text-xl text-[#5c5046] font-medium leading-relaxed mb-6 font-serif">
              শব্দের বুননে জীবনের ছোট ছোট মুহূর্তগুলোকে ধরে রাখার এক নিরন্তর চেষ্টা। প্রকৃতি, প্রেম এবং মানুষের মনের অজানা কথাগুলোই আমার লেখার মূল উপজীব্য।
            </p>

            {/* Calligraphic Author Signature & Stamp */}
            <div className="pt-6 border-t border-[var(--color-antique-gold)]/30 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2.5">
                <span className="font-serif italic text-2xl md:text-3xl text-[var(--color-accent)] tracking-wide font-bold drop-shadow-xs">
                  দীপালী সামুই
                </span>
                {/* Vintage Ink Flourish */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[var(--color-antique-gold)] opacity-85">
                  <path d="M12 2.5L16 10C15.5 13 14.5 16 12 18.5C9.5 16 8.5 13 8 10L12 2.5Z" fill="currentColor" />
                  <circle cx="12" cy="9" r="1" fill="#fff" />
                  <path d="M4 21C8 19 16 19 20 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[var(--color-accent-green)] tracking-widest uppercase mt-1">
                সাহিত্যিক ও কবি
              </span>
            </div>
          </div>

        </div>
      </section>

      <Divider />
      
      <footer className="text-center pb-8 pt-4 text-[var(--color-ink)] font-medium text-sm relative z-10">
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </main>
  );
}
