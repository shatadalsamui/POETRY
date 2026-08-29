import React from "react";
import Divider from "@/components/ui/Divider";
import LightboxGallery from "@/components/ui/LightboxGallery";

export const metadata = {
  title: "দীপালী সামুই | গ্যালারি",
};

export default function GalleryPage() {
  const images = [
    { id: 2, caption: "দুর্গাপূজা ২০২৫", src: "/p2.jpg", width: 720, height: 1280 },
    { id: 3, caption: "কলকাতা বইমেলা ২০২৫, ধানসিড়ি প্রকাশনা", src: "/p4.jpg", width: 720, height: 1280 },
    { id: 4, caption: "কলকাতা বইমেলা ২০২৬, নোটবুক প্রকাশনা", src: "/p3.jpg", width: 720, height: 1280 },
  ];

  return (
    <main className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-4 min-h-full flex flex-col justify-between">
      <section className="relative z-10 mb-4 sm:mb-5">
        <h1 className="text-4xl font-bold tracking-tight mb-2.5 text-center">গ্যালারি</h1>
        <p className="text-center text-[var(--color-ink)] font-medium mb-4 sm:mb-5 max-w-lg mx-auto">
          কিছু ক্যামেরাবন্দী স্মৃতি, বই প্রকাশ এবং আরও অনেক কিছু।
        </p>

        <LightboxGallery images={images} />
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
