"use client";

import React, { useState, useCallback } from "react";
import ShareCardModal from "@/components/ui/ShareCardModal";
import { copyTextToClipboard } from "@/lib/share-card/shareActions";

interface ShareButtonProps {
  path: string;
  title?: string;
  content?: string;
  date?: string;
  book?: string;
  type?: "poem" | "story";
  label?: string;
  className?: string;
  onModalOpenChange?: (open: boolean) => void;
}

export default function ShareButton({
  path,
  title,
  content,
  date,
  book,
  type = "poem",
  label = "শেয়ার করুন",
  className = "",
  onModalOpenChange,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setModalOpen = useCallback(
    (open: boolean) => {
      setIsModalOpen(open);
      onModalOpenChange?.(open);
    },
    [onModalOpenChange]
  );

  const hasRichCardData = Boolean(title && content);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (hasRichCardData) {
        setModalOpen(true);
        return;
      }

      try {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        await copyTextToClipboard(`${origin}${path}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    },
    [hasRichCardData, path, setModalOpen]
  );

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title={
          hasRichCardData
            ? "ছবি ও লিঙ্ক শেয়ার করুন"
            : copied
            ? "লিঙ্ক কপি হয়েছে"
            : "লিঙ্ক কপি করতে ক্লিক করুন"
        }
        aria-label={copied ? "লিঙ্ক কপি হয়েছে" : label}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif font-medium transition-all duration-300 cursor-pointer ${
          copied
            ? "bg-[var(--color-accent-green)] text-white shadow-xs scale-105 border border-transparent"
            : "bg-[var(--color-vintage-ivory)] text-[var(--color-ink)]/85 hover:text-[var(--color-accent)] border border-[var(--color-antique-gold)]/45 hover:border-[var(--color-accent)]/60 hover:bg-white/90 shadow-2xs"
        } ${className}`}
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>লিঙ্ক কপি হয়েছে!</span>
          </>
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5 opacity-85"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span>{label}</span>
          </>
        )}
      </button>

      {hasRichCardData && title && content && (
        <ShareCardModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          path={path}
          title={title}
          content={content}
          date={date}
          book={book}
          type={type}
        />
      )}
    </>
  );
}
