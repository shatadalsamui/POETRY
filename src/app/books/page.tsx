import React from "react";
import Image from "next/image";
import Watermark from "@/components/ui/Watermark";
import Divider from "@/components/ui/Divider";
import { StaggerContainer, StaggerItem } from "@/components/ui/Stagger";

export const metadata = {
  title: "দীপালী সামুই | প্রকাশিত কাব্যগ্রন্থ",
};

export default function BooksPage() {
  return (
    <main className="relative min-h-screen max-w-6xl mx-auto px-6 sm:px-8 py-16">
      <Watermark />
      <section className="relative z-10 mb-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-center">প্রকাশিত কাব্যগ্রন্থ</h1>
        <p className="text-center text-[var(--color-ink)] font-medium mb-16 max-w-lg mx-auto opacity-85">
          আমার লেখা কিছু কাব্যগ্রন্থ, যা পাঠকদের কাছে পৌঁছেছে।
        </p>
        
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Book 1 */}
          <StaggerItem>
            <div className="flex flex-col items-center group bg-[var(--color-vintage-ivory)] p-8 rounded-sm border-2 border-[var(--color-antique-gold)]/40 shadow-xl h-full relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-80" />
              
              {/* Front and Back Covers Side-by-Side */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 w-full relative z-10">
                {/* Front Cover */}
                <div className="relative w-48 h-64 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-[var(--color-antique-gold)]/40 flex-shrink-0 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(179,139,77,0.25)]">
                  <Image src="/b11.jpg" alt="Book 1 Front Cover" fill className="object-cover" sizes="192px" />
                  <div className="absolute left-0 inset-y-0 w-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none" />
                </div>
                {/* Back Cover */}
                <div className="relative w-48 h-64 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-[var(--color-antique-gold)]/40 flex-shrink-0 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(179,139,77,0.25)]">
                  <Image src="/b12.jpg" alt="Book 1 Back Cover" fill className="object-cover" sizes="192px" />
                  <div className="absolute right-0 inset-y-0 w-3 bg-gradient-to-l from-black/40 via-black/10 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Book Details */}
              <div className="text-center mt-auto relative z-10">
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                  জীবনলতা
                </h3>
                <p className="text-xl font-semibold italic text-[var(--color-accent-green)]">
                  — দীপালী সামুই
                </p>
              </div>
            </div>
          </StaggerItem>

          {/* Book 2 */}
          <StaggerItem>
            <div className="flex flex-col items-center group bg-[var(--color-vintage-ivory)] p-8 rounded-sm border-2 border-[var(--color-antique-gold)]/40 shadow-xl h-full relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-80" />
              
              {/* Front and Back Covers Side-by-Side */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 w-full relative z-10">
                {/* Front Cover */}
                <div className="relative w-48 h-64 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-[var(--color-antique-gold)]/40 flex-shrink-0 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(179,139,77,0.25)]">
                  <Image src="/b21.jpg" alt="Book 2 Front Cover" fill className="object-cover" sizes="192px" />
                  <div className="absolute left-0 inset-y-0 w-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none" />
                </div>
                {/* Back Cover */}
                <div className="relative w-48 h-64 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-[var(--color-antique-gold)]/40 flex-shrink-0 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(179,139,77,0.25)]">
                  <Image src="/b22.jpg" alt="Book 2 Back Cover" fill className="object-cover" sizes="192px" />
                  <div className="absolute right-0 inset-y-0 w-3 bg-gradient-to-l from-black/40 via-black/10 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Book Details */}
              <div className="text-center mt-auto relative z-10">
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                  নীল কুয়াশা
                </h3>
                <p className="text-xl font-semibold italic text-[var(--color-accent-green)]">
                  — দীপালী সামুই
                </p>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>
      
      <Divider />
      
      <footer className="text-center pb-8 pt-4 text-[var(--color-ink)] font-medium text-sm relative z-10">
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </main>
  );
}
