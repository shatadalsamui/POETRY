import React from "react";
import Divider from "@/components/ui/Divider";

export const metadata = {
  title: "দীপালী সামুই | যোগাযোগ",
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen max-w-3xl mx-auto px-6 sm:px-8 py-16 animate-in fade-in duration-700">
      <section className="relative z-10 mb-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-center">যোগাযোগ</h1>
        <p className="text-center text-[var(--color-ink)] font-medium mb-12 max-w-lg mx-auto">
          যেকোনো মতামত, পরামর্শ বা বই সম্পর্কিত তথ্যের জন্য যোগাযোগ করুন।
        </p>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-sm border border-neutral-100 max-w-md mx-auto relative overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
          {/* Subtle accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-green)]" />
          
          <div className="space-y-6">
            <div className="group">
              <h3 className="text-sm font-semibold text-[var(--color-ink)] uppercase tracking-widest mb-1">ফোন</h3>
              <a href="tel:+918900112837" className="text-xl font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors inline-block mb-4">
                +91 8900112837
              </a>
              
              <h3 className="text-sm font-semibold text-[var(--color-ink)] uppercase tracking-widest mb-1 mt-2">ইমেইল</h3>
              <a href="mailto:shatadalsamuimain@gmail.com" className="text-xl font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors break-all">
                shatadalsamuimain@gmail.com
              </a>
            </div>
            
            <Divider />
            
            <div className="group">
              <h3 className="text-sm font-semibold text-[var(--color-ink)] uppercase tracking-widest mb-1">সামাজিক মাধ্যম</h3>
              <div className="flex justify-center gap-6 mt-3">
                <a href="#" className="text-[var(--color-ink)] font-medium hover:text-[var(--color-accent-green)] transition-all hover:-translate-y-1">
                  ফেসবুক
                </a>
                <a href="#" className="text-[var(--color-ink)] font-medium hover:text-[var(--color-accent-green)] transition-all hover:-translate-y-1">
                  ইনস্টাগ্রাম
                </a>
                <a href="#" className="text-[var(--color-ink)] font-medium hover:text-[var(--color-accent-green)] transition-all hover:-translate-y-1">
                  টুইটার
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="text-center pb-8 pt-4 text-[var(--color-ink)] font-medium text-sm relative z-10">
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </main>
  );
}
