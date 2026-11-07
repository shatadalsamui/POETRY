import { wrapLine } from "./canvasPrimitives";
import { ExtractedSnippet, RenderRow } from "./types";

export interface CardLayoutMetrics {
  W: number;
  H: number;
  leafX: number;
  leafY: number;
  leafW: number;
  leafH: number;
  headerLeftX: number;
  headerRightX: number;
  contentMaxW: number;
  centerX: number;
  leafTopPad: number;
  leafBottomPad: number;
  runningHeaderH: number;
  afterHeaderGap: number;
  dividerBlockH: number;
  teaserBadgeH: number;
  footerBoxH: number;
  titleFontSize: number;
  titleLineHeight: number;
  wrappedTitle: string[];
  bodyFontSize: number;
  bodyLineHeight: number;
  stanzaGap: number;
  bodyRows: RenderRow[];
}

export function measureCardLayout(params: {
  title: string;
  type: "poem" | "story";
  fontFamily: string;
  snippet: ExtractedSnippet;
}): CardLayoutMetrics {
  const { title, type, fontFamily, snippet } = params;

  const W = 1080;
  const outerPad = 56;
  const leafX = outerPad;
  const leafY = outerPad;
  const leafW = W - outerPad * 2;
  const innerPadX = 78;
  const contentMaxW = leafW - innerPadX * 2;
  const centerX = W / 2;
  const headerLeftX = leafX + innerPadX;
  const headerRightX = leafX + leafW - innerPadX;

  const measureCanvas = document.createElement("canvas");
  measureCanvas.width = 10;
  measureCanvas.height = 10;
  const mctx = measureCanvas.getContext("2d");
  if (!mctx) throw new Error("Canvas 2D context unavailable");

  const titleFontSize = title.length > 26 ? 46 : 54;
  const titleLineHeight = Math.round(titleFontSize * 1.38);
  mctx.font = `700 ${titleFontSize}px ${fontFamily}`;
  const wrappedTitle = wrapLine(mctx, title, contentMaxW - 20);

  const bodyFontSize = type === "poem" ? 34 : 31;
  const bodyLineHeight = type === "poem" ? 72 : 62;
  const stanzaGap = 30;
  mctx.font = `500 ${bodyFontSize}px ${fontFamily}`;

  const bodyRows: RenderRow[] = [];
  for (const rawLine of snippet.lines) {
    if (rawLine === "") {
      bodyRows.push({ text: "", isGap: true });
    } else {
      for (const sub of wrapLine(mctx, rawLine, contentMaxW)) {
        bodyRows.push({ text: sub, isGap: false });
      }
    }
  }

  const bodyBlockHeight = bodyRows.reduce(
    (sum, row) => sum + (row.isGap ? stanzaGap : bodyLineHeight),
    0
  );

  const leafTopPad = 62;
  const runningHeaderH = 54;
  const afterHeaderGap = 52;
  const titleBlockH = wrappedTitle.length * titleLineHeight;
  const dividerBlockH = 66;
  const teaserBadgeH = snippet.isTruncated ? 78 : 20;
  const signatureBlockH = 86;
  const footerBoxH = 138;
  const leafBottomPad = 56;

  const leafH = Math.max(
    1140,
    leafTopPad +
      runningHeaderH +
      afterHeaderGap +
      titleBlockH +
      dividerBlockH +
      bodyBlockHeight +
      teaserBadgeH +
      signatureBlockH +
      footerBoxH +
      leafBottomPad
  );

  const H = leafH + outerPad * 2;

  return {
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
    leafTopPad,
    leafBottomPad,
    runningHeaderH,
    afterHeaderGap,
    dividerBlockH,
    teaserBadgeH,
    footerBoxH,
    titleFontSize,
    titleLineHeight,
    wrappedTitle,
    bodyFontSize,
    bodyLineHeight,
    stanzaGap,
    bodyRows,
  };
}

