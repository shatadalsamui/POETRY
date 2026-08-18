import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/ui/TopBar";
import KashPhoolBackground from "@/components/ui/KashPhoolBackground";
import FlyingBirds from "@/components/ui/FlyingBirds";
import FilmGrain from "@/components/ui/FilmGrain";
import CustomCursor from "@/components/ui/CustomCursor";

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "দীপালী সামুই | পরিচিতি",
  description: "দীপালী সামুই - একজন বাঙালি লেখকের পোর্টফোলিও",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${notoSerifBengali.variable} font-bengali text-[var(--color-ink)] antialiased selection:bg-[#982b1b]/20 selection:text-[#982b1b] min-h-screen pt-16`}>
        <FilmGrain />
        <FlyingBirds />
        <CustomCursor />
        <KashPhoolBackground />
        <TopBar />
        {children}
      </body>
    </html>
  );
}
