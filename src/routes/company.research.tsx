import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/page";

export const Route = createFileRoute("/company/research")({
  head: () => ({
    meta: [
      { title: "Research — How Farmer's AI Diagnoses Crops and Soil" },
      {
        name: "description",
        content:
          "How our biological vision pipeline works: sample classification, pathology reasoning, nutrient inference, confidence calibration and validation methodology.",
      },
      { property: "og:title", content: "Research — Farmer's AI" },
      {
        property: "og:description",
        content: "The method behind photo-based crop, seed and soil diagnostics.",
      },
    ],
  }),
  component: Page,
});

const stages = [
  {
    t: "1 · Sample classification",
    b: "The image is routed to one of four diagnostic suites — plant tissue, produce, seed lot or soil — before any agronomic reasoning begins. Misrouting is the single largest source of error, so this stage is deliberately conservative.",
  },
  {
    t: "2 · Structural reading",
    b: "Morphology, colour distribution, lesion geometry, venation and surface texture are described explicitly, which keeps later conclusions traceable to visible evidence.",
  },
  {
    t: "3 · Agronomic inference",
    b: "Pathology, nutrition and abiotic stress are evaluated as competing hypotheses rather than a single label, because interveinal chlorosis from magnesium deficiency and from root asphyxiation look alike.",
  },
  {
    t: "4 · Confidence calibration",
    b: "Every headline metric carries a confidence value. Low-confidence outputs are phrased as ranges and paired with a recommended physical test.",
  },
  {
    t: "5 · Recommendation synthesis",
    b: "Treatments are returned in organic and conventional pairs with rate, timing and re-entry considerations so the grower can choose within their certification constraints.",
  },
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Research and methodology"
        description="We publish how the system reasons so agronomists can challenge it. A diagnostic tool that cannot be audited should not be trusted with a season."
      />
      <div className="mx-auto max-w-3xl px-4 py-14">
        <div className="space-y-4">
          {stages.map((s) => (
            <div key={s.t} className="surface-card p-5">
              <h3 className="text-sm font-semibold text-primary">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
            </div>
          ))}
        </div>
        <div className="surface-card mt-8 p-6">
          <h3 className="text-base font-semibold">Known limitations</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="ml-5 list-disc">
              Visual assessment cannot replace soil chemistry, refractometry or germination trials.
            </li>
            <li className="ml-5 list-disc">
              Early asymptomatic infection and root-zone problems are frequently invisible in a photo.
            </li>
            <li className="ml-5 list-disc">
              Artificial lighting, flash and heavy filtering distort colour-dependent metrics.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
