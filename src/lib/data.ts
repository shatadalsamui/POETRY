import poemsData from '../../data/poems.json';
import storiesData from '../../data/stories.json';

export interface Poem {
  id: string;
  title: string;
  date: string;
  content: string;
  book?: string;
  bookId?: string;
}

export interface Story {
  id: string;
  title: string;
  date: string;
  content: string;
}

export async function getPoems(): Promise<Poem[]> {
  return poemsData as Poem[];
}

export async function getPoemsByBook(bookName: string): Promise<Poem[]> {
  const poems = await getPoems();
  return poems.filter((poem) => poem.book === bookName || poem.bookId === bookName);
}

export async function getStories(): Promise<Story[]> {
  return storiesData as Story[];
}

export async function getPoemById(id: string): Promise<Poem | undefined> {
  const poems = await getPoems();
  return poems.find((poem) => poem.id === id);
}

export async function getStoryById(id: string): Promise<Story | undefined> {
  const stories = await getStories();
  return stories.find((story) => story.id === id);
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
