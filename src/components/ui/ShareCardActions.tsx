"use client";

import React from "react";
import { Check, Copy, Download, Link2, Share2 } from "lucide-react";
import { CopiedFeedbackKind } from "@/hooks/useShareCard";

interface ShareCardActionsProps {
  hasCard: boolean;
  isGenerating: boolean;
  canNativeShareFiles: boolean;
  fullUrl: string;
  copiedType: CopiedFeedbackKind;
  onPrimaryShare: () => void;
  onWhatsAppShare: () => void;
  onDownload: () => void;
  onCopyCaption: () => void;
  onCopyPlainLink: () => void;
}

export default function ShareCardActions({
  hasCard,
  isGenerating,
  canNativeShareFiles,
  fullUrl,
  copiedType,
  onPrimaryShare,
  onWhatsAppShare,
  onDownload,
  onCopyCaption,
  onCopyPlainLink,
}: ShareCardActionsProps) {
  return (
    <div className="space-y-3">
      {/* Primary Share Button */}
      <button
        type="button"
        disabled={!hasCard || isGenerating}
        onClick={onPrimaryShare}
        className="w-full py-2.5 sm:py-3 px-4 rounded-xs bg-[var(--color-accent)] hover:bg-[#7e2214] disabled:opacity-50 text-white font-serif font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Share2 className="w-4 h-4 shrink-0" />
        <span>
          {canNativeShareFiles
            ? "ছবি ও লিঙ্ক একসাথে শেয়ার করুন"
            : "ছবি ডাউনলোড ও লিঙ্ক কপি করুন"}
        </span>
      </button>

      {/* Secondary Quick Actions Grid (2 clean columns) */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={!hasCard}
          onClick={onWhatsAppShare}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xs bg-[#1f6f43] hover:bg-[#185835] disabled:opacity-50 text-white text-xs font-serif font-semibold transition-colors cursor-pointer"
        >
          <span>💬</span>
          <span>হোয়াটসঅ্যাপ</span>
        </button>

        <button
          type="button"
          disabled={!hasCard}
          onClick={onDownload}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xs bg-white hover:bg-[#f5efe2] text-[var(--color-ink)] border border-[var(--color-antique-gold)]/50 hover:border-[var(--color-accent)] text-xs font-serif font-semibold transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <span>ছবি ডাউনলোড</span>
        </button>
      </div>

      {/* Direct Link & Copy Bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xs bg-[#f3ede0] border border-[var(--color-antique-gold)]/35 text-xs">
        <span className="truncate font-sans text-[var(--color-ink)]/75 select-all">
          {fullUrl}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onCopyCaption}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-2xs bg-white hover:bg-[var(--color-accent)] text-[var(--color-ink)] hover:text-white border border-[var(--color-antique-gold)]/40 font-serif font-semibold transition-colors cursor-pointer"
            title="কবিতার লাইনসহ লিঙ্ক কপি করুন"
          >
            {copiedType === "caption" ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>ক্যাপশন+লিঙ্ক</span>
          </button>
          <button
            type="button"
            onClick={onCopyPlainLink}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-2xs bg-white hover:bg-[var(--color-accent)] text-[var(--color-ink)] hover:text-white border border-[var(--color-antique-gold)]/40 font-serif font-semibold transition-colors cursor-pointer"
            title="শুধু লিঙ্ক কপি করুন"
          >
            {copiedType === "link" ? (
              <Check className="w-3 h-3" />
            ) : (
              <Link2 className="w-3 h-3" />
            )}
            <span>লিঙ্ক কপি</span>
          </button>
        </div>
      </div>
    </div>
  );
}
