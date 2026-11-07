import { formatBengaliDate, toBengaliNumerals } from "@/lib/data";
import { extractSnippet } from "./extractSnippet";
import {
  drawBookLeafFrame,
  drawFountainNibIcon,
  drawParchmentBackdrop,
  drawRoundedRect,
} from "./canvasPrimitives";
import { measureCardLayout } from "./measureCardLayout";
import { GeneratedShareCard, ShareCardInput } from "./types";

/**
 * Renders the vintage Bengali book-leaf card onto an HD canvas
 * and encodes it as a PNG Blob + Data URL.
 */
export async function generateShareCard(
  input: ShareCardInput
): Promise<GeneratedShareCard> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Fallback serif if font readiness fails
    }
  }

  const fontFamily =
    (typeof window !== "undefined" &&
      window.getComputedStyle(document.body).fontFamily) ||
    '"Noto Serif Bengali", Georgia, serif';

  const type = input.type || "poem";
  const snippet = extractSnippet(input.content, type, input.mode);
  const layout = measureCardLayout({
    title: input.title,
    type,
    fontFamily,
    snippet,
  });

  const {
    W,
    H,
    leafX,
    leafY,
    leafW,
    leafH,
    headerLeftX,
    headerRightX,
    contentMaxW,
    centerX,
  } = layout;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // 1. Backdrop + Book Leaf Frame
  drawParchmentBackdrop(ctx, W, H);
  drawBookLeafFrame(ctx, leafX, leafY, leafW, leafH);

  // 2. Running Book Header
  let cursorY = leafY + layout.leafTopPad;
  const collectionLabel = input.book
    ? type === "poem"
      ? `‘${input.book}’ কাব্যগ্রন্থ`
      : `‘${input.book}’`
    : type === "poem"
    ? "কবিতা সংকলন"
    : "গল্প সংকলন";

  const formattedDate = input.date
    ? /^\d{4}-\d{2}-\d{2}/.test(input.date)
      ? formatBengaliDate(input.date)
      : input.date
    : "";

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.font = `italic 600 25px ${fontFamily}`;
  ctx.fillStyle = "#205a3e";
  ctx.fillText(collectionLabel, headerLeftX, cursorY + 14);

  if (formattedDate) {
    ctx.textAlign = "right";
    ctx.font = `500 23px ${fontFamily}`;
    ctx.fillStyle = "rgba(44, 44, 42, 0.68)";
    ctx.fillText(formattedDate, headerRightX, cursorY + 14);
  }

  const headerLineY = cursorY + layout.runningHeaderH - 8;
  ctx.beginPath();
  ctx.moveTo(headerLeftX, headerLineY);
  ctx.lineTo(headerRightX, headerLineY);
  ctx.strokeStyle = "rgba(179, 139, 77, 0.42)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  cursorY += layout.runningHeaderH + layout.afterHeaderGap;

  // 3. Title & Ornamental Divider
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = `700 ${layout.titleFontSize}px ${fontFamily}`;
  ctx.fillStyle = "#2c2c2a";

  for (const tLine of layout.wrappedTitle) {
    ctx.fillText(tLine, centerX + 4, cursorY);
    cursorY += layout.titleLineHeight;
  }

  const ornamentY = cursorY + 26;
  ctx.font = `400 24px ${fontFamily}`;
  ctx.fillStyle = "#b38b4d";
  ctx.textBaseline = "middle";
  ctx.fillText("❦", centerX + 4, ornamentY);

  ctx.beginPath();
  ctx.moveTo(centerX - 96, ornamentY);
  ctx.lineTo(centerX - 22, ornamentY);
  ctx.moveTo(centerX + 30, ornamentY);
  ctx.lineTo(centerX + 104, ornamentY);
  ctx.strokeStyle = "rgba(179, 139, 77, 0.65)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  cursorY += layout.dividerBlockH;

  // 4. Verses / Opening Excerpt + Soft Parchment Fade
  const versesStartY = cursorY;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = `500 ${layout.bodyFontSize}px ${fontFamily}`;
  ctx.fillStyle = "#2c2c2a";

  for (let i = 0; i < layout.bodyRows.length; i++) {
    const row = layout.bodyRows[i];
    if (row.isGap) {
      cursorY += layout.stanzaGap;
    } else {
      const isLastRow = i === layout.bodyRows.length - 1 && snippet.isTruncated;
      const displayLine =
        isLastRow && !row.text.endsWith("...") && !row.text.endsWith("…")
          ? `${row.text}...`
          : row.text;
      ctx.fillText(displayLine, centerX + 4, cursorY);
      cursorY += layout.bodyLineHeight;
    }
  }

  if (snippet.isTruncated && cursorY - versesStartY > layout.bodyLineHeight * 2) {
    const fadeH = Math.min(115, layout.bodyLineHeight * 1.65);
    const fadeY = cursorY - fadeH;
    const fadeGrad = ctx.createLinearGradient(0, fadeY, 0, cursorY + 4);
    fadeGrad.addColorStop(0, "rgba(251, 249, 244, 0)");
    fadeGrad.addColorStop(0.55, "rgba(251, 249, 244, 0.52)");
    fadeGrad.addColorStop(1, "rgba(251, 249, 244, 0.92)");
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(headerLeftX - 10, fadeY, contentMaxW + 20, fadeH + 6);
  }

  // 5. Teaser Continuation Badge
  if (snippet.isTruncated) {
    cursorY += 16;
    const teaserText =
      type === "poem" && snippet.remainingLines > 0
        ? `✦ আরও ${toBengaliNumerals(snippet.remainingLines)}টি পঙক্তি রয়েছে — সম্পূর্ণ কবিতাটি পড়তে লিঙ্কে ক্লিক করুন ✦`
        : type === "poem"
        ? "✦ সম্পূর্ণ কবিতাটি পড়তে নিচের লিঙ্কে ক্লিক করুন ✦"
        : "✦ সম্পূর্ণ গল্পটি পড়তে নিচের লিঙ্কে ক্লিক করুন ✦";

    ctx.font = `600 22px ${fontFamily}`;
    const pillW = Math.min(contentMaxW, ctx.measureText(teaserText).width + 56);
    const pillH = 48;
    drawRoundedRect(ctx, centerX + 4 - pillW / 2, cursorY, pillW, pillH, 24);
    ctx.fillStyle = "rgba(152, 43, 27, 0.07)";
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(152, 43, 27, 0.28)";
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#982b1b";
    ctx.fillText(teaserText, centerX + 4, cursorY + pillH / 2 + 1);
    cursorY += layout.teaserBadgeH;
  } else {
    cursorY += 20;
  }

  // 6. Author Signature
  const sigY = cursorY + 26;
  ctx.beginPath();
  ctx.moveTo(headerRightX - 230, sigY - 16);
  ctx.lineTo(headerRightX, sigY - 16);
  ctx.strokeStyle = "rgba(179, 139, 77, 0.38)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.font = `italic 700 32px ${fontFamily}`;
  ctx.fillStyle = "#982b1b";
  ctx.fillText("— দীপালী সামুই", headerRightX, sigY);

  // 7. Footer URL Banner
  const footerY = leafY + leafH - layout.leafBottomPad - layout.footerBoxH;
  drawRoundedRect(ctx, headerLeftX, footerY, contentMaxW, layout.footerBoxH, 14);
  ctx.fillStyle = "#f3ede0";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(179, 139, 77, 0.5)";
  ctx.stroke();

  const nibCenterX = headerLeftX + 44;
  const nibCenterY = footerY + 44;
  drawFountainNibIcon(ctx, nibCenterX, nibCenterY, 22);

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `700 24px ${fontFamily}`;
  ctx.fillStyle = "#2c2c2a";
  ctx.fillText("দীপালী সামুই | Depali Samui", nibCenterX + 34, nibCenterY - 8);

  ctx.font = `500 18px ${fontFamily}`;
  ctx.fillStyle = "#205a3e";
  ctx.fillText(
    type === "poem" ? "সম্পূর্ণ কবিতাটি পড়ার লিঙ্ক:" : "সম্পূর্ণ গল্পটি পড়ার লিঙ্ক:",
    nibCenterX + 34,
    nibCenterY + 18
  );

  ctx.beginPath();
  ctx.moveTo(headerLeftX + 22, footerY + 80);
  ctx.lineTo(headerLeftX + contentMaxW - 22, footerY + 80);
  ctx.strokeStyle = "rgba(179, 139, 77, 0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const cleanDisplayUrl = input.url.replace(/^https?:\/\//, "");
  const monoOrSans = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
  let urlFontSize = 21;
  ctx.font = `600 ${urlFontSize}px ${monoOrSans}`;
  while (urlFontSize > 14 && ctx.measureText(`🔗 ${cleanDisplayUrl}`).width > contentMaxW - 48) {
    urlFontSize -= 1;
    ctx.font = `600 ${urlFontSize}px ${monoOrSans}`;
  }
  ctx.fillStyle = "#982b1b";
  ctx.fillText(`🔗 ${cleanDisplayUrl}`, headerLeftX + 24, footerY + 109);

  const dataUrl = canvas.toDataURL("image/png");
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG encode failed"))), "image/png", 1.0);
  });

  return {
    blob,
    dataUrl,
    snippetPreviewText: snippet.plainExcerpt,
    remainingLines: snippet.remainingLines,
  };
}
