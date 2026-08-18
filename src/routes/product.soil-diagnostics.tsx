import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { PageHero } from "@/components/site/page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/soil-diagnostics")({
  head: () => ({
    meta: [
      { title: "Soil Diagnostics — Texture, pH & Nutrient Reading | Farmer's AI" },
      {
        name: "description",
        content:
          "Photograph your soil to estimate texture class, pH band, organic matter, moisture balance, N-P-K status and the crops best suited to it.",
      },
      { property: "og:title", content: "Soil Diagnostics — Farmer's AI" },
      {
        property: "og:description",
        content: "Estimate soil texture, pH, organic matter and nutrient status from a photo.",
      },
    ],
  }),
  component: Page,
});

const points = [
  "Texture classification: sand, silt, clay, loam and blends",
  "Colour-derived organic matter and humus indication",
  "Estimated pH band with liming or acidifying guidance",
  "Moisture balance and drainage behaviour",
  "N-P-K status with recommended correction rates",
  "Crop suitability shortlist and rotation advice",
  "Recommended irrigation method and cycle length",
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="Soil Diagnostics"
        description="A field-side read on the ground beneath your crop — texture, structure, fertility and the irrigation strategy that fits it."
      >
        <Button size="lg" asChild>
          <Link to="/analyze">Analyze a soil photo</Link>
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
          <h3 className="text-base font-semibold">Accuracy note</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Visual soil assessment is an estimate, not a laboratory assay. Use it to prioritise where
            to sample and to catch obvious imbalances early — confirm critical fertiliser decisions
            with a lab test.
          </p>
        </div>
      </div>
    </>
  );
}
