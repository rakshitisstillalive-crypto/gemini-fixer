import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { PageHero } from "@/components/site/page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/crop-health")({
  head: () => ({
    meta: [
      { title: "Crop Health Analyzer — Disease & Nutrient Detection | Farmer's AI" },
      {
        name: "description",
        content:
          "Detect crop diseases, pests and nutrient deficiencies from a leaf photo. Get severity scores, organic and chemical treatments and a yield-impact estimate.",
      },
      { property: "og:title", content: "Crop Health Analyzer — Farmer's AI" },
      {
        property: "og:description",
        content: "Photo-based disease, pest and nutrient deficiency diagnostics for any crop.",
      },
    ],
  }),
  component: Page,
});

const points = [
  "Species and cultivar identification with confidence scoring",
  "Fungal, bacterial and viral disease detection with severity index",
  "Insect pest and mite damage recognition",
  "Nitrogen, phosphorus, potassium, magnesium and micronutrient deficiency mapping",
  "Water stress, heat stress and salinity symptom separation",
  "Organic and conventional treatment plans with application timing",
  "Estimated yield impact if left untreated",
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="Crop Health Analyzer"
        description="Point your camera at a leaf, stem or whole plant. The agent separates pathology from nutrition from stress — then tells you exactly what to apply."
      >
        <Button size="lg" asChild>
          <Link to="/analyze">Analyze a plant photo</Link>
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
          <h3 className="text-base font-semibold">Best photo practice</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Shoot in daylight, fill the frame with the affected tissue, and include one healthy leaf
            for contrast. Avoid flash — it washes out chlorosis and early lesions.
          </p>
        </div>
      </div>
    </>
  );
}
