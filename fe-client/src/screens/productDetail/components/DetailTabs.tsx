import React, { useState } from "react";
import DescriptionTab from "./DescriptionTab";
import CareTab from "./CareTab";
import DiscussionTab from "./DiscussionTab";

interface DetailTabsProps {
  productName: string;
  descriptionHtml?: string | null;
  careInstructionHtml?: string | null;
}

export default function DetailTabs({
  productName,
  descriptionHtml,
  careInstructionHtml,
}: DetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "care" | "discussion">("description");

  return (
    <div className="mt-16 border-t border-border/80 pt-10">
      <div className="flex border-b border-border/60 text-sm font-semibold select-none mb-6">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-3 px-4 border-b-2 transition-all outline-none ${
            activeTab === "description"
              ? "border-primary text-secondary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Mô tả chi tiết
        </button>
        <button
          onClick={() => setActiveTab("care")}
          className={`pb-3 px-4 border-b-2 transition-all outline-none ${
            activeTab === "care"
              ? "border-primary text-secondary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Hướng dẫn bảo quản
        </button>
        <button
          onClick={() => setActiveTab("discussion")}
          className={`pb-3 px-4 border-b-2 transition-all outline-none ${
            activeTab === "discussion"
              ? "border-primary text-secondary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Thảo luận
        </button>
      </div>

      <div className="py-2">
        {activeTab === "description" && (
          <DescriptionTab productName={productName} descriptionHtml={descriptionHtml} />
        )}
        {activeTab === "care" && (
          <CareTab careInstructionHtml={careInstructionHtml} />
        )}
        {activeTab === "discussion" && <DiscussionTab />}
      </div>
    </div>
  );
}
