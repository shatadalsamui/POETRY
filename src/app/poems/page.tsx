import React from "react";
import Divider from "@/components/ui/Divider";
import { getPoems } from "@/lib/data";
import PoemsListWithFilter from "@/components/ui/PoemsListWithFilter";

export const metadata = {
  title: "দীপালী সামুই | কবিতা",
};

export default async function PoemsPage() {
  const poems = await getPoems();

  return (
    <main className="relative min-h-screen max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-16">
      <section className="relative z-10 mb-10 sm:mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3 text-center">কবিতা</h1>
        <p className="text-center text-[var(--color-ink)] font-medium mb-6 sm:mb-8 max-w-lg mx-auto">
          হৃদয়ের গভীর থেকে উঠে আসা কিছু অনুভূতির ছান্দিক রূপ।
        </p>
        
        <PoemsListWithFilter poems={poems} />
      </section>
      
      <Divider />
      
      <footer className="text-center pb-8 pt-4 text-[var(--color-ink)] font-medium text-sm relative z-10">
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </main>
  );
}
