import React from "react";
import Divider from "@/components/ui/Divider";
import Watermark from "@/components/ui/Watermark";

export const metadata = {
  title: "দীপালী সামুই | যোগাযোগ",
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen max-w-3xl mx-auto px-6 sm:px-8 py-16">
      <Watermark />

      <section className="relative z-10 mb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-center">যোগাযোগ</h1>
        <p className="text-center text-[var(--color-ink)] font-medium mb-12 max-w-lg mx-auto opacity-85">
          যেকোনো মতামত, পরামর্শ বা বই সম্পর্কিত তথ্যের জন্য যোগাযোগ করুন।
        </p>

        <div className="bg-[var(--color-vintage-ivory)] p-8 sm:p-12 rounded-sm border-2 border-[var(--color-antique-gold)]/40 shadow-xl max-w-lg mx-auto relative overflow-hidden text-center group">
          {/* Decorative Crimson Side Bar matching Poems & Books */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12]" />

          <div className="space-y-8">
            {/* Phone */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-[var(--color-accent-green)] uppercase tracking-widest mb-1.5">
                ফোন নম্বর
              </span>
              <a
                href="tel:+918900112837"
                className="text-2xl font-bold text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors inline-block tracking-wide"
              >
                +91 8900112837
              </a>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-[var(--color-accent-green)] uppercase tracking-widest mb-1.5">
                ইমেইল ঠিকানা
              </span>
              <a
                href="mailto:shatadalsamuimain@gmail.com"
                className="text-lg sm:text-xl font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors break-all"
              >
                shatadalsamuimain@gmail.com
              </a>
            </div>

            <Divider className="my-6 opacity-60" />

            {/* Social Links */}
            <div>
              <span className="text-xs font-semibold text-[var(--color-accent-green)] uppercase tracking-widest mb-3 block">
                সামাজিক মাধ্যম
              </span>
              <div className="flex justify-center mt-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61558047953743"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-[var(--color-vintage-ivory)] border border-[var(--color-antique-gold)]/60 rounded-sm text-[var(--color-ink)] font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all hover:-translate-y-0.5 shadow-xs group/fb"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-[#1877F2] group-hover/fb:scale-110 transition-transform duration-300"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>ফেসবুক প্রোফাইল</span>
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
