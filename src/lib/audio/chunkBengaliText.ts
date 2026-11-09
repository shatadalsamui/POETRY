/**
 * Normalizes a Bengali poem or story into sentence-aligned audio chunks
 * AND computes per-line / per-sentence timing windows (`startRatio`..`endRatio`)
 * so the UI highlights each spoken verse or sentence in real time.
 */

import { normalizeBengaliForTts } from "./bengaliPronunciation";

export interface RecitableSegment {
  text: string;
  isBreak?: boolean;
  paragraphIndex?: number;
  chunkIndex: number; // >= 1 (chunk 0 is the title/author/book intro)
  startRatio: number; // 0..1 within chunkIndex
  endRatio: number; // 0..1 within chunkIndex
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
 * Estimates spoken duration weight for a line/sentence based on character count
 * plus natural pause weights for commas and daris (।, ?, !).
 */
function spokenWeight(text: string): number {
  const clean = text.trim();
  if (!clean) return 1;
  const commaCount = (clean.match(/[,;:—-]/g) || []).length;
  const dariCount = (clean.match(/[।?!]/g) || []).length;
  return Math.max(1, clean.length + commaCount * 4 + dariCount * 6);
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
    weight: number;
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

    const totalWeight = currentLines.reduce((sum, l) => sum + l.weight, 0) || 1;
    let acc = 0;
    for (const item of currentLines) {
      const startRatio = acc / totalWeight;
      acc += item.weight;
      const endRatio = acc / totalWeight;
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
      // If the previous line already ended with a full stop (।, ?, !),
      // flush at the stanza break so stanzas stay cleanly aligned.
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
      weight: spokenWeight(trimmed),
    });
    currentCharLen += trimmed.length + 1;

    // Never split where there is no dari/question/exclamation mark.
    // Once a line ends with a full sentence stop (।, ?, !) and has a full phrase,
    // flush the sentence chunk so highlighting resyncs at every sentence boundary.
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
    weight: number;
  }

  let currentBatch: PendingSentence[] = [];
  let currentCharLen = 0;

  const flushChunk = () => {
    if (currentBatch.length === 0) return;
    const chunkIndex = chunks.length;
    chunks.push(
      normalizeBengaliForTts(currentBatch.map((s) => s.spoken).join(" "))
    );

    const totalWeight = currentBatch.reduce((sum, s) => sum + s.weight, 0) || 1;
    let acc = 0;
    for (const item of currentBatch) {
      const startRatio = acc / totalWeight;
      acc += item.weight;
      const endRatio = acc / totalWeight;
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
        weight: spokenWeight(sentence),
      });
      currentCharLen += sentence.length + 1;

      // Flush after each complete sentence (or pair of very short sentences)
      // so every sentence highlight is tightly locked to the voice.
      if (currentCharLen >= 35) {
        flushChunk();
      }
    }

    flushChunk();
  });

  flushChunk();
  return { chunks, segments };
}
