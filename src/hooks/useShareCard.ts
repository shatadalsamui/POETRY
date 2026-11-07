"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { buildShareCaption } from "@/lib/share-card/extractSnippet";
import { generateShareCard } from "@/lib/share-card/renderShareCard";
import {
  canBrowserShareFile,
  copyImageBlobToClipboard,
  copyTextToClipboard,
  downloadDataUrl,
  openWhatsAppWithCaption,
  shareFileWithCaption,
} from "@/lib/share-card/shareActions";
import { GeneratedShareCard, ShareSnippetMode } from "@/lib/share-card/types";

export type CopiedFeedbackKind = "caption" | "link" | "image" | null;

interface CardRenderState {
  key: string;
  card: GeneratedShareCard;
  file: File;
  canNativeShareFiles: boolean;
}

export interface UseShareCardParams {
  isOpen: boolean;
  path: string;
  title: string;
  content: string;
  date?: string;
  book?: string;
  type?: "poem" | "story";
}

const emptySubscribe = () => () => {};

export function useShareCard({
  isOpen,
  path,
  title,
  content,
  date,
  book,
  type = "poem",
}: UseShareCardParams) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [mode, setMode] = useState<ShareSnippetMode>("few");
  const [renderState, setRenderState] = useState<CardRenderState | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<CopiedFeedbackKind>(null);

  const canCopyImage =
    isClient &&
    typeof ClipboardItem !== "undefined" &&
    Boolean(navigator.clipboard?.write);

  const fullUrl = isClient
    ? `${window.location.origin}${path}`
    : `https://depalisamui.vercel.app${path}`;

  const safeSlug =
    path
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/[^a-zA-Z0-9-_]/g, "") || "poem";
  const fileName = `${safeSlug}-depali-samui.png`;

  const targetKey = `${path}|${mode}|${title}`;
  const card = renderState?.card ?? null;
  const shareFile = renderState?.file ?? null;
  const canNativeShareFiles = renderState?.canNativeShareFiles ?? false;
  const isGenerating = isOpen && renderState?.key !== targetKey;

  useEffect(() => {
    if (!isOpen || !isClient) return;
    let cancelled = false;

    generateShareCard({
      title,
      content,
      date,
      book,
      type,
      url: fullUrl,
      mode,
    })
      .then((generated) => {
        if (cancelled) return;
        const file = new File([generated.blob], fileName, { type: "image/png" });
        setRenderState({
          key: targetKey,
          card: generated,
          file,
          canNativeShareFiles: canBrowserShareFile(file),
        });
      })
      .catch((err) => {
        console.error("Failed to generate share card:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, isClient, title, content, date, book, type, fullUrl, mode, fileName, targetKey]);

  const showTempStatus = useCallback((msg: string, kind: CopiedFeedbackKind = null) => {
    setStatusMessage(msg);
    setCopiedType(kind);
    setTimeout(() => {
      setStatusMessage(null);
      setCopiedType(null);
    }, 2600);
  }, []);

  const getCaption = useCallback(
    () =>
      buildShareCaption({
        title,
        type,
        fullUrl,
        excerptText: card?.snippetPreviewText,
      }),
    [title, type, fullUrl, card]
  );

  const handleDownload = useCallback(() => {
    if (!card) return;
    downloadDataUrl(card.dataUrl, fileName);
    showTempStatus("ছবি ডাউনলোড শুরু হয়েছে!");
  }, [card, fileName, showTempStatus]);

  const handlePrimaryShare = useCallback(async () => {
    if (!card || !shareFile) return;
    const caption = getCaption();

    if (canNativeShareFiles) {
      const result = await shareFileWithCaption({
        file: shareFile,
        title: `${title} | দীপালী সামুই`,
        caption,
      });
      if (result === "shared" || result === "aborted") return;
    }

    downloadDataUrl(card.dataUrl, fileName);
    try {
      await copyTextToClipboard(caption);
      showTempStatus("ছবি ডাউনলোড হয়েছে এবং লিঙ্ক কপি হয়েছে!", "caption");
    } catch {
      showTempStatus("ছবি ডাউনলোড হয়েছে!");
    }
  }, [card, shareFile, getCaption, canNativeShareFiles, title, fileName, showTempStatus]);

  const handleWhatsAppShare = useCallback(async () => {
    if (!card) return;
    const caption = getCaption();

    if (canNativeShareFiles && shareFile) {
      const result = await shareFileWithCaption({
        file: shareFile,
        title: `${title} | দীপালী সামুই`,
        caption,
      });
      if (result === "shared" || result === "aborted") return;
    }

    if (canCopyImage) {
      try {
        await copyImageBlobToClipboard(card.blob);
        showTempStatus(
          "ছবি ক্লিপবোর্ডে কপি হয়েছে — হোয়াটসঅ্যাপে পেস্ট (Ctrl+V) করুন!",
          "image"
        );
      } catch {
        downloadDataUrl(card.dataUrl, fileName);
      }
    } else {
      downloadDataUrl(card.dataUrl, fileName);
    }

    openWhatsAppWithCaption(caption);
  }, [card, getCaption, canNativeShareFiles, shareFile, title, canCopyImage, showTempStatus, fileName]);

  const handleCopyCaption = useCallback(async () => {
    try {
      await copyTextToClipboard(getCaption());
      showTempStatus("ক্যাপশন ও লিঙ্ক কপি হয়েছে!", "caption");
    } catch {
      // ignore
    }
  }, [getCaption, showTempStatus]);

  const handleCopyPlainLink = useCallback(async () => {
    try {
      await copyTextToClipboard(fullUrl);
      showTempStatus("শুধু লিঙ্ক কপি হয়েছে!", "link");
    } catch {
      // ignore
    }
  }, [fullUrl, showTempStatus]);

  return {
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
  };
}

