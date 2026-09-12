import React from "react";
import HeroSlider from "./components/HeroSlider";
import HomeProductBlocks from "./components/HomeProductBlocks";
import BlogSection from "./components/BlogSection";

export default function HomeScreen() {
  return (
    <main className="flex-1 py-8 flex flex-col">
      <HeroSlider />

      <HomeProductBlocks />

      <BlogSection />
    </main>
  );
}
