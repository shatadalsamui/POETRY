/**
 * Normalizes a Bengali poem or story into continuous sentences
 * and splits ONLY at true sentence-ending punctuation (।, ?, !)
 * so the voice reader never stops mid-sentence where there is no dari or comma.
 */
export function buildRecitationChunks(params: {
  title: string;
  content: string;
  book?: string;
  type?: "poem" | "story";
}): string[] {
  const { title, content, book, type = "poem" } = params;
  const MAX_CHUNK_CHARS = 550;
  const chunks: string[] = [];

  // 1. Opening sequence: Title -> Author -> Book (if present)
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

  chunks.push(`${title}। দীপালী সামুই।${bookPart}`);

  // 2. Collapse line-wraps into continuous prose so wrapped lines without
  //    a dari (।) or comma (,) are spoken as a single unbroken sentence.
  const normalizedBody = content
    .replace(/\r?\n+/g, " ")
    // Ensure a space after commas/semicolons so words like "ধ্বনি,অভিমানী" don't merge
    .replace(/([,;:])(?=\S)/g, "$1 ")
    // Normalize multiple dots "......।" into a clean dari
    .replace(/\.{2,}\s*।?/g, "। ")
    // Ensure a space after sentence-ending punctuation
    .replace(/([।?!])(?=\S)/g, "$1 ")
    // Clean standalone hyphens surrounded by spaces that cause unnatural pauses
    .replace(/\s+-\s+/g, ", ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalizedBody) return chunks;

  const bodyWithEnding = /[।?!]$/.test(normalizedBody)
    ? normalizedBody
    : `${normalizedBody}।`;

  // 3. Split strictly at sentence boundaries (।, ?, !)
  const sentences = bodyWithEnding
    .split(/(?<=[।?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  let buffer = "";
  for (const sentence of sentences) {
    if (!buffer) {
      buffer = sentence;
    } else if (buffer.length + 1 + sentence.length <= MAX_CHUNK_CHARS) {
      buffer = `${buffer} ${sentence}`;
    } else {
      chunks.push(buffer);
      buffer = sentence;
    }
  }

  if (buffer) {
    chunks.push(buffer);
  }

  return chunks;
}
