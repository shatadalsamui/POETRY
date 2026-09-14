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
    default: "Depali Samui | দীপালী সামুই — কবিতা ও গল্প | সাহিত্য জগৎ",
    template: "%s | Depali Samui | দীপালী সামুই",
  },
  description:
    "Official website of Bengali poet & author Depali Samui | দীপালী সামুই। কবিতা, গল্প, প্রকাশিত কাব্যগ্রন্থ (জীবনলতা, নীল কুয়াশা) এবং সাহিত্য ভাবনা।",
  keywords: [
    "Depali Samui",
    "দীপালী সামুই",
    "depalisamui",
    "Depali Samui Kobita",
    "Depali Samui Poems",
    "Depali Samui Books",
    "Depali Samui Author",
    "Depali Samui Poet",
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
  authors: [{ name: "Depali Samui | দীপালী সামুই", url: siteUrl }],
  creator: "Depali Samui | দীপালী সামুই",
  publisher: "Depali Samui | দীপালী সামুই",
  openGraph: {
    type: "website",
    locale: "bn_IN",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "Depali Samui | দীপালী সামুই",
    title: "Depali Samui | দীপালী সামুই — কবিতা ও গল্প",
    description:
      "Official website of Bengali poet & author Depali Samui | দীপালী সামুই। কবিতা আর গল্পে বোনা জীবনের কিছু খণ্ডচিত্র।",
    images: [
      {
        url: `${siteUrl}/p1.jpg`,
        width: 800,
        height: 1066,
        alt: "Depali Samui | দীপালী সামুই - Bengali Author & Poet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Depali Samui | দীপালী সামুই — সাহিত্য জগৎ",
    description:
      "Official website of Bengali poet & author Depali Samui | দীপালী সামুই।",
    images: [`${siteUrl}/p1.jpg`],
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
      name: "Depali Samui | দীপালী সামুই",
      alternateName: ["Depali Samui", "দীপালী সামুই", "Dipali Samui", "Deepali Samui"],
      givenName: "Depali",
      familyName: "Samui",
      description: "Bengali poet and author (বাঙালি কবি ও গল্পকার). Author of 'Jibonlata' and 'Neel Kuyasha'.",
      jobTitle: "Author & Poet",
      gender: "Female",
      nationality: {
        "@type": "Country",
        name: "India",
      },
      url: siteUrl,
      image: `${siteUrl}/p1.jpg`,
      sameAs: [
        "https://www.facebook.com/profile.php?id=61558047953743",
        `${siteUrl}`,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Depali Samui | দীপালী সামুই",
      alternateName: [
        "Depali Samui Official Website",
        "দীপালী সামুই অফিসিয়াল ওয়েবসাইট",
      ],
      description: "Official literary portfolio of Bengali author and poet Depali Samui | দীপালী সামুই।",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: ["bn", "en"],
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
