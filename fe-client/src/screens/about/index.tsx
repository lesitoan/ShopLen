import React from "react";
import AboutHero from "./components/AboutHero";
import BrandStory from "./components/BrandStory";
import CoreValues from "./components/CoreValues";
import CraftProcess from "./components/CraftProcess";
import AboutCta from "./components/AboutCta";

export default function AboutScreen() {
  return (
    <main className="flex-1 flex flex-col">
      <AboutHero />
      <BrandStory />
      <CoreValues />
      <CraftProcess />
      <AboutCta />
    </main>
  );
}
