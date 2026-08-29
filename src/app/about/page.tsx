import React from "react";
import Image from "next/image";
import Divider from "@/components/ui/Divider";

export default function Home() {
  return (
    <main className="relative max-w-[960px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-3 min-h-full flex flex-col justify-between">

      <section className="relative z-10 mb-6 sm:mb-8 max-w-[960px] mx-auto w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-5 sm:mb-6 text-center">পরিচিতি</h1>

        {/* Vintage Parchment Paper Frame */}
        <div className="bg-[var(--color-vintage-ivory)] border-2 border-[var(--color-antique-gold)]/40 rounded-sm shadow-xl p-6 sm:p-7 md:p-8 flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8 relative overflow-hidden">
          {/* Decorative Crimson Accent Bar */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12]" />
          
          {/* Left Column: Portrait & Calligraphic Signature */}
          <div className="flex flex-col items-center shrink-0 w-56 sm:w-60 md:w-64">
            <div className="relative w-48 sm:w-52 md:w-56 shadow-xl border-3 border-white rotate-[-1.5deg] hover:rotate-0 transition-transform duration-700">
              <img
                src="/p1.jpg"
                alt="দীপালী সামুই"
                className="w-full h-auto object-contain rounded-xs"
              />
            </div>

            {/* Calligraphic Author Signature & Stamp under Photo */}
            <div className="pt-4 mt-4 border-t border-[var(--color-antique-gold)]/30 flex flex-col items-center text-center w-full">
              <div className="flex items-center gap-2">
                <span className="font-serif italic text-2xl sm:text-3xl md:text-[30px] text-[var(--color-accent)] tracking-wide font-bold drop-shadow-xs">
                  দীপালী সামুই
                </span>
                {/* Vintage Ink Flourish */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[var(--color-antique-gold)] opacity-85 shrink-0">
                  <path d="M12 2.5L16 10C15.5 13 14.5 16 12 18.5C9.5 16 8.5 13 8 10L12 2.5Z" fill="currentColor" />
                  <circle cx="12" cy="9" r="1" fill="#fff" />
                  <path d="M4 21C8 19 16 19 20 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Right Column: Seamless Flowing Narrative Paragraphs */}
          <div className="flex-1 space-y-3.5 sm:space-y-4 text-left font-serif text-[var(--color-ink)] text-base sm:text-[17px] leading-relaxed">
            <p className="text-justify font-medium">
              সবুজে ঘেরা পূর্ব বর্ধমান জেলার এক শান্ত গ্রাম্য পরিবেশে লেখিকার জন্ম ও বেড়ে ওঠা। অক্ষরের প্রথম পাঠ মায়ের আদরে। মায়ের মুখেই প্রথম কবিতার সুর শোনা। সেই সুরই কখন যেন তাঁর বুকের গভীরে বুনে দিয়েছিল শব্দ আর ছন্দের প্রতি চিরন্তন ভালোবাসা।
            </p>
            <p className="text-justify font-medium">
              বিজ্ঞানের ছাত্রী হয়েও সাহিত্যের আঙিনায় তার অবাধ যাতায়াত। বর্ধমান বিশ্ববিদ্যালয় থেকে বিজ্ঞান বিভাগে স্নাতক সম্পন্ন করলেও তার আসল মন পড়ে থাকে কবিতার মায়াবী ক্যানভাসে। একক বই প্রকাশের আগে বিভিন্ন কবিতা সংকলন ও লিটিল ম্যাগাজিনে অনেক কবিতা প্রকাশিত হয়েছে।
            </p>
            <p className="text-justify font-medium">
              বিগত কলকাতা আন্তর্জাতিক বইমেলায় আত্মপ্রকাশ করেছে তাঁর দুটি জনপ্রিয় একক কাব্যগ্রন্থ। প্রথম কাব্যগ্রন্থ <span className="text-[var(--color-accent)] font-semibold">জীবনলতা</span> ধানসিড়ি প্রকাশনা থেকে। দ্বিতীয় কাব্যগ্রন্থ <span className="text-[var(--color-accent)] font-semibold">নীল কুয়াশা</span> নোটবুক প্রকাশনা থেকে।
            </p>
            <p className="text-justify font-medium">
              লেখিকা প্রকৃতির সান্নিধ্যে থাকতেই বেশি ভালোবাসেন। সবুজ অরণ্য, সমুদ্র আর পাহাড়ের বুকে কান পেতে প্রকৃতির প্রতিটি নিভৃত শ্বাস অনুভব করতে চান। প্রকৃতির অনাবিল রূপ কবিতায় যেমন ধরা দেয় তেমনি সমানভাবে উঠে আসে সমাজের বাস্তব চিত্র। সামাজিক ক্ষত ও মানুষের যন্ত্রণা তাঁর অনেক কবিতার মূল উপজীব্য। প্রকৃতি আর সমাজের মেলবন্ধন তাঁর সৃষ্টিকে দিয়েছে এক অনন্য গভীরতা।
            </p>
          </div>

        </div>
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
