"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useShareCard } from "@/hooks/useShareCard";
import ShareCardActions from "@/components/ui/ShareCardActions";

export interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  path: string;
  title: string;
  content: string;
  date?: string;
  book?: string;
  type?: "poem" | "story";
}

export default function ShareCardModal({
  isOpen,
  onClose,
  path,
  title,
  content,
  date,
  book,
  type = "poem",
}: ShareCardModalProps) {
  const {
    isClient,
    mode,
    setMode,
    card,
    isGenerating,
    canNativeShareFiles,
    fullUrl,
    statusMessage,
    copiedType,
    handlePrimaryShare,
    handleWhatsAppShare,
    handleDownload,
    handleCopyCaption,
    handleCopyPlainLink,
  } = useShareCard({
    isOpen,
    path,
    title,
    content,
    date,
    book,
    type,
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="ছবি ও লিঙ্ক শেয়ার করুন"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#fbf9f4] border-2 border-[var(--color-antique-gold)]/60 rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col max-h-[92svh]"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent)] to-[#6a1e12]" />

            {/* Modal Header */}
            <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-[var(--color-antique-gold)]/35 flex items-center justify-between gap-3 bg-[#f5efe2]/70">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--color-ink)] leading-snug truncate">
                  ছবি ও লিঙ্ক শেয়ার করুন
                </h3>
                <p className="text-xs font-serif text-[var(--color-accent)] font-semibold truncate">
                  ‘{title}’ — দীপালী সামুই
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="বন্ধ করুন"
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-[var(--color-accent)] text-[var(--color-ink)] hover:text-white border border-[var(--color-antique-gold)]/40 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="px-5 py-4 sm:px-6 overflow-y-auto space-y-4">
              {/* Snippet Length Toggle */}
              <div className="flex items-center justify-center gap-2 bg-[#efe8d8]/80 p-1 rounded-full border border-[var(--color-antique-gold)]/35 w-fit mx-auto">
                <button
                  type="button"
                  onClick={() => setMode("few")}
                  className={`px-3.5 py-1 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                    mode === "few"
                      ? "bg-[var(--color-accent)] text-white shadow-xs"
                      : "text-[var(--color-ink)]/80 hover:text-[var(--color-accent)]"
                  }`}
                >
                  {type === "poem" ? "প্রথম কয়েক পঙক্তি" : "প্রথম কয়েক লাইন"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("half")}
                  className={`px-3.5 py-1 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                    mode === "half"
                      ? "bg-[var(--color-accent)] text-white shadow-xs"
                      : "text-[var(--color-ink)]/80 hover:text-[var(--color-accent)]"
                  }`}
                >
                  {type === "poem" ? "অর্ধেক কবিতা" : "প্রথম অনুচ্ছেদ"}
                </button>
              </div>

              {/* Generated Book-Leaf Screenshot Preview */}
              <div className="relative flex items-center justify-center bg-[#e8decb]/55 border border-[var(--color-antique-gold)]/35 rounded-xs p-2.5 sm:p-3 min-h-[260px]">
                {card ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.dataUrl}
                    alt={`${title} — শেয়ার কার্ড`}
                    className={`max-h-[40svh] sm:max-h-[44svh] w-auto object-contain rounded-2xs shadow-md transition-opacity duration-200 ${
                      isGenerating ? "opacity-60" : "opacity-100"
                    }`}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-12 text-xs font-serif text-[var(--color-ink)]/70">
                    <span className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                    <span>বইয়ের পাতার ছবি তৈরি হচ্ছে...</span>
                  </div>
                )}
              </div>

              {/* Status Feedback Banner */}
              <AnimatePresence>
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-xs font-serif font-semibold text-white bg-[var(--color-accent-green)] px-3 py-1.5 rounded-xs shadow-2xs"
                  >
                    ✓ {statusMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <ShareCardActions
                hasCard={Boolean(card)}
                isGenerating={isGenerating}
                canNativeShareFiles={canNativeShareFiles}
                fullUrl={fullUrl}
                copiedType={copiedType}
                onPrimaryShare={handlePrimaryShare}
                onWhatsAppShare={handleWhatsAppShare}
                onDownload={handleDownload}
                onCopyCaption={handleCopyCaption}
                onCopyPlainLink={handleCopyPlainLink}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
