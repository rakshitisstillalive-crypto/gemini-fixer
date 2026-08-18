import { createFileRoute } from "@tanstack/react-router";

import { Analyzer } from "@/components/analysis/analyzer";
import { PageHero } from "@/components/site/page";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze a Sample — Farmer's AI" },
      {
        name: "description",
        content:
          "Upload a crop, fruit, vegetable, seed or soil photo and receive a full AI agronomy report with a downloadable PDF. Free, no account required.",
      },
      { property: "og:title", content: "Analyze a Sample — Farmer's AI" },
      {
        property: "og:description",
        content: "Free guest analysis of crop, seed and soil photos with a downloadable PDF report.",
      },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  return (
    <>
      <PageHero
        eyebrow="Analysis engine"
        title="Upload a sample"
        description="Plants, crops, fruit, vegetables, seeds or soil. The agent auto-detects the sample type and runs the matching diagnostic suite."
      />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <Analyzer />
      </div>
    </>
  );
}
