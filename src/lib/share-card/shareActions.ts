/**
 * Browser I/O helpers for clipboard copying, PNG downloading,
 * and native / WhatsApp sharing.
 */

export async function copyTextToClipboard(text: string): Promise<void> {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export async function copyImageBlobToClipboard(blob: Blob): Promise<void> {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
    throw new Error("Image clipboard write unsupported");
  }
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

export function downloadDataUrl(dataUrl: string, fileName: string): void {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export function canBrowserShareFile(file: File): boolean {
  try {
    return (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    );
  } catch {
    return false;
  }
}

export async function shareFileWithCaption(params: {
  file: File;
  title: string;
  caption: string;
}): Promise<"shared" | "aborted" | "unsupported"> {
  const { file, title, caption } = params;
  if (!navigator.share) return "unsupported";

  try {
    await navigator.share({
      files: [file],
      title,
      text: caption,
    });
    return "shared";
  } catch (err) {
    if ((err as DOMException)?.name === "AbortError") {
      return "aborted";
    }
    return "unsupported";
  }
}

export function openWhatsAppWithCaption(caption: string): void {
  const waUrl = `https://wa.me/?text=${encodeURIComponent(caption)}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
}

