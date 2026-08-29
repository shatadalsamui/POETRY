import React from "react";
import { getPoems, getStories, getLatestPoemBatch, getLatestStoryBatch } from "@/lib/data";
import LandingHero from "@/components/ui/LandingHero";

export const metadata = {
  title: "দীপালী সামুই | সাহিত্য জগৎ",
  description: "কবিতা আর গল্পে বোনা জীবনের কিছু খণ্ডচিত্র — দীপালী সামুইয়ের আনুষ্ঠানিক সাহিত্য ওয়েবসাইট।",
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
