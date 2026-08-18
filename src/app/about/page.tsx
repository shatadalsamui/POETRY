import React from "react";
import Image from "next/image";
import Watermark from "@/components/ui/Watermark";
import Divider from "@/components/ui/Divider";

export default function Home() {
  return (
    <main className="relative min-h-screen max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
      <Watermark />

      <section className="relative z-10 mt-8 mb-20 max-w-4xl mx-auto">
        {/* Vintage Parchment Paper Frame */}
        <div className="bg-[var(--color-vintage-ivory)]/95 backdrop-blur-md border border-[var(--color-antique-gold)]/40 rounded-sm shadow-md p-8 md:p-14 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* Profile Picture */}
          <div className="relative shrink-0 w-56 md:w-72 shadow-xl border-4 border-white rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
            <img
              src="/p1.jpg"
              alt="দীপালী সামুই"
              className="w-full h-auto object-contain"
            />
          </div>
          
          {/* Text Content */}
          <div className="flex flex-col text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-[#4a3f35] hover:text-[var(--color-accent)] transition-colors duration-500">
              দীপালী সামুই
            </h1>
            
            <p className="text-xl text-[#5c5046] font-medium leading-relaxed">
              শব্দের বুননে জীবনের ছোট ছোট মুহূর্তগুলোকে ধরে রাখার এক নিরন্তর চেষ্টা। প্রকৃতি, প্রেম এবং মানুষের মনের অজানা কথাগুলোই আমার লেখার মূল উপজীব্য।
            </p>
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
