"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/about", label: "পরিচিতি" },
    { href: "/books", label: "প্রকাশিত গ্রন্থ" },
    { href: "/poems", label: "কবিতা" },
    { href: "/stories", label: "গল্প" },
    { href: "/gallery", label: "গ্যালারি" },
    { href: "/contact", label: "যোগাযোগ" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent border-b-2 border-double border-[var(--color-antique-gold)]/40 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between relative">
        {/* Fountain Pen Motif / Logo Area */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[var(--color-vintage-ivory)] border border-[var(--color-antique-gold)]/50 flex items-center justify-center shadow-xs transition-all duration-500 group-hover:border-[var(--color-accent)] group-hover:shadow-[0_0_12px_rgba(152,43,27,0.2)] group-hover:scale-105">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[var(--color-accent)] transition-transform duration-500 group-hover:rotate-12"
            >
              {/* Fountain Pen Nib Body */}
              <path
                d="M12 2.5 L17 11.5 C16.2 15 15 18.5 12 21 C9 18.5 7.8 15 7 11.5 Z"
                fill="currentColor"
              />
              <path
                d="M9.5 20 L14.5 20 L14.8 22 L9.2 22 Z"
                fill="var(--color-antique-gold)"
              />
              {/* Slit & Breather Hole */}
              <circle cx="12" cy="12" r="1.3" fill="var(--color-vintage-ivory)" />
              <line x1="12" y1="2.5" x2="12" y2="10.7" stroke="var(--color-vintage-ivory)" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-wide text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
            দীপালী সামুই
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-12">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-semibold text-base md:text-lg tracking-wide transition-colors duration-300 py-2 ${
                  isActive ? "text-[var(--color-accent-green)]" : "text-[var(--color-ink)] font-medium hover:text-[var(--color-accent)]"
                }`}
              >
                {link.label}
                {/* Active Indicator / Hover Underline */}
                <span
                  className={`absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[var(--color-accent)] transform origin-left transition-transform duration-300 ${
                    isActive ? "scale-x-100 bg-[var(--color-accent-green)]" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[var(--color-ink)] font-medium hover:text-[var(--color-accent)] focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-[var(--color-vintage-ivory)]/95 backdrop-blur-md border-b-2 border-double border-[var(--color-antique-gold)]/40 shadow-xl absolute top-full left-0 right-0"
          >
            <nav className="flex flex-col px-6 py-4">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-3 font-semibold text-lg border-b border-[var(--color-antique-gold)]/20 last:border-b-0 transition-colors ${
                      isActive ? "text-[var(--color-accent-green)]" : "text-[var(--color-ink)] hover:text-[var(--color-accent)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
