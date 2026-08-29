import poemsData from '../../data/poems.json';
import storiesData from '../../data/stories.json';

export interface Poem {
  id: string;
  tag?: string;
  bookTag?: string;
  title: string;
  date: string;
  content: string;
  book?: string;
  bookId?: string;
  batch?: number;
}

export interface Story {
  id: string;
  tag?: string;
  title: string;
  date: string;
  content: string;
  batch?: number;
}

export async function getPoems(): Promise<Poem[]> {
  const poems = [...poemsData] as Poem[];
  return poems.sort((a, b) => {
    const aBatch = a.batch || 0;
    const bBatch = b.batch || 0;
    if (aBatch !== bBatch) {
      return bBatch - aBatch; // Highest batch (নতুন কবিতা) at the absolute top
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getPoemsByBook(bookName: string): Promise<Poem[]> {
  // Books maintain their natural chronological / printed page order (1 to 5)
  return (poemsData as Poem[]).filter((poem) => poem.book === bookName || poem.bookId === bookName);
}

export async function getStories(): Promise<Story[]> {
  const stories = [...storiesData] as Story[];
  return stories.sort((a, b) => {
    const aBatch = a.batch || 0;
    const bBatch = b.batch || 0;
    if (aBatch !== bBatch) {
      return bBatch - aBatch; // Highest batch (নতুন গল্প) at the absolute top
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getPoemById(idOrTag: string): Promise<Poem | undefined> {
  const poems = await getPoems();
  return poems.find((poem) => poem.id === idOrTag || poem.tag === idOrTag || poem.bookTag === idOrTag);
}

export async function getStoryById(idOrTag: string): Promise<Story | undefined> {
  const stories = await getStories();
  return stories.find((story) => story.id === idOrTag || story.tag === idOrTag);
}

export function getLatestPoemBatch(poems: Poem[]): number {
  return Math.max(0, ...poems.map((p) => p.batch || 0));
}

export function getLatestStoryBatch(stories: Story[]): number {
  return Math.max(0, ...stories.map((s) => s.batch || 0));
}

const bengaliNumerals: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const bengaliMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর"
];

export function toBengaliNumerals(numberString: string | number): string {
  return String(numberString).replace(/[0-9]/g, (digit) => bengaliNumerals[digit] || digit);
}

export function formatBengaliDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const bengaliDay = toBengaliNumerals(day);
  const bengaliYear = toBengaliNumerals(year);
  const bengaliMonth = bengaliMonths[month];

  return `${bengaliDay} ${bengaliMonth} ${bengaliYear}`;
}
