import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/ui/TopBar";
import KashPhoolBackground from "@/components/ui/KashPhoolBackground";
import FilmGrain from "@/components/ui/FilmGrain";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollToTopOnNavigate from "@/components/ui/ScrollToTopOnNavigate";

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

import { Analytics } from "@vercel/analytics/react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://depalisamui.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "দীপালী সামুই | সাহিত্য জগৎ (Dipali Samui)",
    template: "%s | দীপালী সামুই",
  },
  description:
    "কবি ও গল্পকার দীপালী সামুইয়ের আনুষ্ঠানিক সাহিত্য ওয়েবসাইট। কবিতা, গল্প, প্রকাশিত কাব্যগ্রন্থ (জীবনলতা, নীল কুয়াশা) এবং সাহিত্য ভাবনা।",
  keywords: [
    "দীপালী সামুই",
    "Dipali Samui",
    "Deepali Samui",
    "দীপালিসামুই",
    "বাংলা কবিতা",
    "বাংলা গল্প",
    "জীবনলতা",
    "নীল কুয়াশা",
    "Bangla Kobita",
    "Bengali Poetry",
    "Bengali Literature",
    "Bengali Author",
    "Purba Bardhaman",
    "পূর্ব বর্ধমান সাহিত্য",
  ],
  authors: [{ name: "দীপালী সামুই", url: siteUrl }],
  creator: "দীপালী সামুই",
  publisher: "দীপালী সামুই",
  openGraph: {
    type: "website",
    locale: "bn_IN",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "দীপালী সামুই | Dipali Samui",
    title: "দীপালী সামুই | সাহিত্য জগৎ — কবিতা ও গল্প",
    description:
      "কবিতা আর গল্পে বোনা জীবনের কিছু খণ্ডচিত্র — দীপালী সামুইয়ের আনুষ্ঠানিক সাহিত্য ওয়েবসাইট।",
  },
  twitter: {
    card: "summary_large_image",
    title: "দীপালী সামুই | সাহিত্য জগৎ",
    description:
      "কবিতা আর গল্পে বোনা জীবনের কিছু খণ্ডচিত্র — দীপালী সামুইয়ের আনুষ্ঠানিক সাহিত্য ওয়েবসাইট।",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "দীপালী সামুই",
      alternateName: ["Dipali Samui", "Deepali Samui"],
      description: "বাঙালি কবি ও ঔপন্যাসিক/গল্পকার",
      jobTitle: "Author & Poet",
      url: siteUrl,
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "দীপালী সামুই | Dipali Samui",
      description: "দীপালী সামুইয়ের আনুষ্ঠানিক সাহিত্য পোর্টফোলিও",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "bn",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${notoSerifBengali.variable} font-bengali text-[var(--color-ink)] antialiased selection:bg-[#982b1b]/20 selection:text-[#982b1b] h-screen overflow-hidden`}>
        <ScrollToTopOnNavigate />
        <FilmGrain />
        <CustomCursor />
        <KashPhoolBackground />
        <TopBar />
        <div id="main-scroll-container" className="h-[calc(100svh-4rem)] mt-16 overflow-y-auto relative z-10">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
