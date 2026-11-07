import { ExtractedSnippet, ShareSnippetMode } from "./types";

/**
 * Extracts either the first few lines ("few") or roughly half ("half")
 * of a poem or story while preserving natural stanza rhythm.
 */
export function extractSnippet(
  content: string,
  type: "poem" | "story" = "poem",
  mode: ShareSnippetMode = "few"
): ExtractedSnippet {
  if (type === "story") {
    const cleanText = content.replace(/\s+/g, " ").trim();
    const rawSentences = cleanText
      .split(/(?<=[।?!])\s*/)
      .map((s) => s.trim())
      .filter(Boolean);

    const charBudget = mode === "few" ? 230 : 460;
    const selected: string[] = [];
    let chars = 0;

    for (let i = 0; i < rawSentences.length; i++) {
      const sentence = rawSentences[i];
      if (selected.length >= 2 && chars + sentence.length > charBudget) {
        break;
      }
      selected.push(sentence);
      chars += sentence.length;
      if (selected.length >= rawSentences.length - 1 && rawSentences.length > 2) {
        break;
      }
    }

    const joined = selected.join(" ");
    const remainingSentences = Math.max(0, rawSentences.length - selected.length);

    return {
      lines: [joined],
      plainExcerpt: selected.slice(0, 2).join(" "),
      remainingLines: remainingSentences,
      isTruncated: remainingSentences > 0 || joined.length < cleanText.length,
    };
  }

  const rawLines = content.split("\n").map((l) => l.trim());
  const nonEmptyLines = rawLines.filter(Boolean);
  const totalLines = nonEmptyLines.length;

  let targetCount =
    mode === "few"
      ? Math.min(6, Math.max(4, Math.ceil(totalLines * 0.34)))
      : Math.min(12, Math.max(5, Math.ceil(totalLines * 0.5)));

  if (totalLines > 3 && targetCount >= totalLines) {
    targetCount = totalLines - 1;
  }

  const collected: string[] = [];
  const plainCollected: string[] = [];
  let taken = 0;
  let lastWasBlank = true;

  for (const line of rawLines) {
    if (taken >= targetCount) break;
    if (!line) {
      if (!lastWasBlank) {
        collected.push("");
        lastWasBlank = true;
      }
    } else {
      collected.push(line);
      plainCollected.push(line);
      taken++;
      lastWasBlank = false;
    }
  }

  while (collected.length > 0 && collected[collected.length - 1] === "") {
    collected.pop();
  }

  const remainingLines = Math.max(0, totalLines - taken);

  return {
    lines: collected,
    plainExcerpt: plainCollected.slice(0, 3).join(" / "),
    remainingLines,
    isTruncated: remainingLines > 0,
  };
}

/**
 * Formats the social caption paired with the poem/story URL.
 */
export function buildShareCaption(params: {
  title: string;
  type: "poem" | "story";
  fullUrl: string;
  excerptText?: string;
}): string {
  const { title, type, fullUrl, excerptText } = params;
  const snippetLine = excerptText ? `“${excerptText}...”\n\n` : "";
  const promptLabel =
    type === "poem"
      ? "📖 সম্পূর্ণ কবিতাটি পড়তে লিঙ্কে ক্লিক করুন:"
      : "📖 সম্পূর্ণ গল্পটি পড়তে লিঙ্কে ক্লিক করুন:";
  return `✨ ${title} — দীপালী সামুই\n${snippetLine}${promptLabel}\n${fullUrl}`;
}

