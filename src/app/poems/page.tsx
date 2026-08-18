import React from "react";
import Divider from "@/components/ui/Divider";
import Link from "next/link";
import { getPoems, formatBengaliDate } from "@/lib/data";
import { StaggerContainer, StaggerItem } from "@/components/ui/Stagger";

export const metadata = {
  title: "দীপালী সামুই | কবিতা",
};

export default async function PoemsPage() {
  const poems = await getPoems();

  return (
    <main className="relative min-h-screen max-w-5xl mx-auto px-6 sm:px-8 py-16">
      <section className="relative z-10 mb-20">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-center">কবিতা</h1>
        <p className="text-center text-[var(--color-ink)] font-medium mb-16 max-w-lg mx-auto">
          হৃদয়ের গভীর থেকে উঠে আসা কিছু অনুভূতির ছান্দিক রূপ।
        </p>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {poems.map((poem) => (
            <StaggerItem key={poem.id}>
              <Link href={`/poems/${poem.id}`} className="block h-full group">
                <article className="h-full bg-[var(--color-vintage-ivory)]/95 backdrop-blur-md p-8 md:p-10 rounded-sm shadow-sm border border-[var(--color-antique-gold)]/40 relative overflow-hidden group-hover:shadow-[0_10px_30px_rgb(179,139,77,0.15)] transition-all duration-500 flex flex-col items-center text-center group-hover:-translate-y-1">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12] opacity-80" />
                  <span className="text-sm text-[var(--color-accent-green)] mb-3 tracking-widest font-medium">
                    {formatBengaliDate(poem.date)}
                  </span>
                  <h3 className="text-2xl font-semibold mb-6 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">{poem.title}</h3>
                  <p className="text-lg text-[var(--color-ink)]/70 font-serif line-clamp-3 mb-8">
                    {poem.content}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-[var(--color-accent)] uppercase group-hover:gap-3 transition-all">
                      পড়ুন <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
      
      <Divider />
      
      <footer className="text-center pb-8 pt-4 text-[var(--color-ink)] font-medium text-sm relative z-10">
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </main>
  );
}
