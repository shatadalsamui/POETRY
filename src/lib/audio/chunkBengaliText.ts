/**
 * Normalizes a Bengali poem or story into sentence-aligned audio chunks
 * AND computes per-line / per-sentence word-boundary windows (`startRatio`..`endRatio`)
 * so the UI highlights each spoken verse or sentence with zero lag.
 */

import { normalizeBengaliForTts } from "./bengaliPronunciation";

export interface RecitableSegment {
  text: string;
  isBreak?: boolean;
  paragraphIndex?: number;
  chunkIndex: number; // >= 1 (chunk 0 is the title/author/book intro)
  startRatio: number; // 0..1 word-index ratio within chunkIndex
  endRatio: number; // 0..1 word-index ratio within chunkIndex
}

export interface RecitationPlan {
  chunks: string[];
  segments: RecitableSegment[];
}

function normalizeSpokenText(raw: string): string {
  return raw
    .replace(/\r?\n+/g, " ")
    .replace(/([,;:])(?=\S)/g, "$1 ")
    .replace(/\.{2,}\s*।?/g, "। ")
    .replace(/([।?!])(?=\S)/g, "$1 ")
    .replace(/\s+-\s+/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Counts spoken words in a line/sentence using the same word-boundary
 * delimiters as Microsoft Edge Neural TTS (`WordBoundary`).
 */
function countSpokenWords(text: string): number {
  const normalized = normalizeBengaliForTts(normalizeSpokenText(text));
  const words = normalized
    .split(/[\s,।?!;:"'“”‘’—\-()]+/)
    .filter((w) => /[\u0980-\u09ffA-Za-z0-9]/.test(w));
  return Math.max(1, words.length);
}

export function buildRecitationPlan(params: {
  title: string;
  content: string;
  book?: string;
  type?: "poem" | "story";
}): RecitationPlan {
  const { title, content, book, type = "poem" } = params;
  const chunks: string[] = [];

  // Chunk 0: Opening sequence (Title -> Author -> Book)
  const cleanBook = book?.trim();
  const bookPart = cleanBook
    ? type === "poem"
      ? ` ${
          cleanBook.includes("কাব্যগ্রন্থ")
            ? cleanBook
            : `${cleanBook} কাব্যগ্রন্থ`
        }।`
      : ` ${cleanBook}।`
    : "";

  chunks.push(normalizeBengaliForTts(`${title}। দীপালী সামুই।${bookPart}`));

  if (type === "poem") {
    return buildPoemPlan(content, chunks);
  }
  return buildStoryPlan(content, chunks);
}

export function buildRecitationChunks(params: {
  title: string;
  content: string;
  book?: string;
  type?: "poem" | "story";
}): string[] {
  return buildRecitationPlan(params).chunks;
}

function buildPoemPlan(content: string, chunks: string[]): RecitationPlan {
  const rawLines = content.split(/\r?\n/);
  const segments: RecitableSegment[] = [];

  interface PendingLine {
    segmentIndex: number;
    spoken: string;
    wordCount: number;
  }

  let currentLines: PendingLine[] = [];
  let currentCharLen = 0;

  const flushChunk = () => {
    if (currentLines.length === 0) return;
    let combined = normalizeBengaliForTts(
      normalizeSpokenText(currentLines.map((l) => l.spoken).join(" "))
    );
    if (combined && !/[।?!]$/.test(combined)) {
      combined = `${combined}।`;
    }
    const chunkIndex = chunks.length;
    chunks.push(combined);

    const totalWords =
      currentLines.reduce((sum, l) => sum + l.wordCount, 0) || 1;
    let accWords = 0;
    for (const item of currentLines) {
      const startRatio = accWords / totalWords;
      accWords += item.wordCount;
      const endRatio = accWords / totalWords;
      segments[item.segmentIndex].chunkIndex = chunkIndex;
      segments[item.segmentIndex].startRatio = startRatio;
      segments[item.segmentIndex].endRatio = endRatio;
    }

    currentLines = [];
    currentCharLen = 0;
  };

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      if (
        currentLines.length > 0 &&
        /[।?!]$/.test(currentLines[currentLines.length - 1].spoken)
      ) {
        flushChunk();
      }
      segments.push({
        text: "",
        isBreak: true,
        chunkIndex: -1,
        startRatio: 0,
        endRatio: 0,
      });
      continue;
    }

    const segIdx = segments.length;
    segments.push({
      text: trimmed,
      isBreak: false,
      chunkIndex: 1,
      startRatio: 0,
      endRatio: 1,
    });

    currentLines.push({
      segmentIndex: segIdx,
      spoken: trimmed,
      wordCount: countSpokenWords(trimmed),
    });
    currentCharLen += trimmed.length + 1;

    const endsWithSentenceStop = /[।?!]["'”’)]*$/.test(trimmed);
    if (endsWithSentenceStop && currentCharLen >= 35) {
      flushChunk();
    }
  }

  flushChunk();
  return { chunks, segments };
}

function buildStoryPlan(content: string, chunks: string[]): RecitationPlan {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const segments: RecitableSegment[] = [];

  interface PendingSentence {
    segmentIndex: number;
    spoken: string;
    wordCount: number;
  }

  let currentBatch: PendingSentence[] = [];
  let currentCharLen = 0;

  const flushChunk = () => {
    if (currentBatch.length === 0) return;
    const chunkIndex = chunks.length;
    chunks.push(
      normalizeBengaliForTts(currentBatch.map((s) => s.spoken).join(" "))
    );

    const totalWords =
      currentBatch.reduce((sum, s) => sum + s.wordCount, 0) || 1;
    let accWords = 0;
    for (const item of currentBatch) {
      const startRatio = accWords / totalWords;
      accWords += item.wordCount;
      const endRatio = accWords / totalWords;
      segments[item.segmentIndex].chunkIndex = chunkIndex;
      segments[item.segmentIndex].startRatio = startRatio;
      segments[item.segmentIndex].endRatio = endRatio;
    }

    currentBatch = [];
    currentCharLen = 0;
  };

  paragraphs.forEach((para, pIdx) => {
    const cleanPara = normalizeSpokenText(para);
    const withEnding = /[।?!]$/.test(cleanPara) ? cleanPara : `${cleanPara}।`;
    const sentences = withEnding
      .split(/(?<=[।?!])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const sentence of sentences) {
      const segIdx = segments.length;
      segments.push({
        text: sentence,
        paragraphIndex: pIdx,
        chunkIndex: 1,
        startRatio: 0,
        endRatio: 1,
      });

      currentBatch.push({
        segmentIndex: segIdx,
        spoken: sentence,
        wordCount: countSpokenWords(sentence),
      });
      currentCharLen += sentence.length + 1;

      if (currentCharLen >= 35) {
        flushChunk();
      }
    }

    flushChunk();
  });

  flushChunk();
  return { chunks, segments };
}
