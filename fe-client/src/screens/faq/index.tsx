import React from "react";
import FaqHeader from "./components/FaqHeader";
import FaqAccordionList from "./components/FaqAccordionList";
import FaqCta from "./components/FaqCta";

export default function FaqScreen() {
  return (
    <main className="flex-1 flex flex-col">
      <FaqHeader />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-8 w-full">
        <FaqAccordionList />
        <FaqCta />
      </div>
    </main>
  );
}
