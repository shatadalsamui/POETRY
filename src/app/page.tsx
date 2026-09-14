import React from "react";
import { getPoems, getStories, getLatestPoemBatch, getLatestStoryBatch } from "@/lib/data";
import LandingHero from "@/components/ui/LandingHero";

export const metadata = {
  title: "Depali Samui | দীপালী সামুই — সাহিত্য জগৎ (কবিতা ও গল্প)",
  description:
    "Official literary website of Bengali author and poet Depali Samui | দীপালী সামুই। কবিতা, গল্প ও প্রকাশিত কাব্যগ্রন্থ (জীবনলতা, নীল কুয়াশা)।",
};

export default async function LandingPage() {
  const allPoems = await getPoems();
  const allStories = await getStories();

  const latestPoemBatch = getLatestPoemBatch(allPoems);
  const latestStoryBatch = getLatestStoryBatch(allStories);

  const newPoems = allPoems.filter((p) => latestPoemBatch > 0 && p.batch === latestPoemBatch);
  const newStories = allStories.filter((s) => latestStoryBatch > 0 && s.batch === latestStoryBatch);

  return <LandingHero newPoems={newPoems} newStories={newStories} />;
}
