export type ShareSnippetMode = "few" | "half";

export interface ShareCardInput {
  title: string;
  content: string;
  date?: string;
  book?: string;
  type?: "poem" | "story";
  url: string;
  mode: ShareSnippetMode;
}

export interface GeneratedShareCard {
  blob: Blob;
  dataUrl: string;
  snippetPreviewText: string;
  remainingLines: number;
}

export interface ExtractedSnippet {
  lines: string[]; // "" represents a stanza/paragraph break
  plainExcerpt: string;
  remainingLines: number;
  isTruncated: boolean;
}

export interface RenderRow {
  text: string;
  isGap: boolean;
}

