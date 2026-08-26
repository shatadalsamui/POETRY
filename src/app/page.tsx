"use client";

import React from "react";
import Divider from "@/components/ui/Divider";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 sm:px-8 py-16">
      <section className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto -mt-20">
        
        {/* Big Poetic Quote */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-[var(--color-ink)] leading-snug drop-shadow-sm px-4"
        >
          "কবিতা আর গল্পে বোনা জীবনের কিছু খণ্ডচিত্র..."
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.2 }}
          className="w-full"
        >
          <Divider className="my-10" />
        </motion.div>
        
        {/* Subtitle / Call to action */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.4 }}
          className="text-lg md:text-2xl text-[var(--color-ink)] font-medium max-w-2xl opacity-80"
        >
          দীপালী সামুইয়ের সাহিত্য জগতে আপনাকে স্বাগতম
        </motion.p>

      </section>
      
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
        className="absolute bottom-8 left-0 right-0 w-full text-center text-[var(--color-ink)] font-medium text-lg md:text-xl z-10 px-4 drop-shadow-sm"
      >
        &copy; {new Date().getFullYear()} দীপালী সামুই। সর্বস্বত্ব সংরক্ষিত।
      </motion.footer>
    </main>
  );
}
