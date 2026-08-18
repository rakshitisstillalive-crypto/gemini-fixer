import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { PageHero } from "@/components/site/page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/seed-quality")({
  head: () => ({
    meta: [
      { title: "Seed Quality Tester — Germination & Purity | Farmer's AI" },
      {
        name: "description",
        content:
          "Assess a seed lot from a photo: estimated germination rate, physical purity, moisture, damage, vigour and cultivar or GMO trait indicators.",
      },
      { property: "og:title", content: "Seed Quality Tester — Farmer's AI" },
      {
        property: "og:description",
        content: "Estimate germination, purity, vigour and seed lot quality from a photograph.",
      },
    ],
  }),
  component: Page,
});

const points = [
  "Species and probable cultivar identification",
  "Estimated germination percentage and vigour class",
  "Physical purity: inert matter, weed seed and off-type fraction",
  "Visible damage: cracking, insect boring, shrivelling and discolouration",
  "Moisture appearance and storage-risk indicators",
  "Hybrid / open-pollinated and GMO trait likelihood signals",
  "Recommended sowing rate and seed treatment",
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="Seed Quality Tester"
        description="Spread a sample on a plain background, photograph it, and get a lot-level quality read before you commit a field to it."
      >
        <Button size="lg" asChild>
          <Link to="/analyze">Analyze a seed lot</Link>
        </Button>
      </PageHero>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-xl font-semibold">What the report includes</h2>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="surface-card mt-10 p-6">
          <h3 className="text-base font-semibold">Sampling tip</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Photograph at least 100 seeds spread in a single layer on white paper with even light.
            Overlapping seeds reduce purity and damage accuracy.
          </p>
        </div>
      </div>
    </>
  );
}
