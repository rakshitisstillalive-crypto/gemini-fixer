import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { PageHero } from "@/components/site/page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/brix-ph")({
  head: () => ({
    meta: [
      { title: "Brix & pH Assessor — Produce Quality Grading | Farmer's AI" },
      {
        name: "description",
        content:
          "Estimate sugar content (Brix), acidity, ripeness stage, shelf life and microbiological safety for fruit and vegetables from a single photo.",
      },
      { property: "og:title", content: "Brix & pH Assessor — Farmer's AI" },
      {
        property: "og:description",
        content: "Photo-based Brix, acidity, ripeness and food-safety grading for produce.",
      },
    ],
  }),
  component: Page,
});

const points = [
  "Estimated Brix (°Bx) sugar range and sweetness class",
  "Acidity / pH band and sugar-acid balance",
  "Ripeness stage and optimal harvest window",
  "Firmness, blemish and market-grade scoring",
  "Estimated remaining shelf life under ambient and cold storage",
  "Microbiological risk flags: mould, rot and surface contamination",
  "Handling and storage recommendations",
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="Brix & pH Assessor"
        description="Grade produce before it reaches the buyer. Sweetness, acidity, ripeness, defects and safety in one pass."
      >
        <Button size="lg" asChild>
          <Link to="/analyze">Analyze produce</Link>
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
          <h3 className="text-base font-semibold">Not a food-safety certificate</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Safety flags are visual indicators to guide inspection. They do not replace refractometer
            readings, laboratory testing or regulatory certification.
          </p>
        </div>
      </div>
    </>
  );
}
