import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/page";

export const Route = createFileRoute("/company/about")({
  head: () => ({
    meta: [
      { title: "About Farmer's AI — Agronomy Intelligence for Every Grower" },
      {
        name: "description",
        content:
          "Farmer's AI puts laboratory-grade crop, seed and soil diagnostics in the pocket of every grower, from smallholder plots to commercial estates.",
      },
      { property: "og:title", content: "About Farmer's AI" },
      {
        property: "og:description",
        content: "Why we built agronomy-grade photo diagnostics for growers everywhere.",
      },
    ],
  }),
  component: Page,
});

const values = [
  {
    t: "Accessible first",
    b: "Full diagnostics without an account, on a low-end phone, on a slow connection. Access is the product.",
  },
  {
    t: "Honest about uncertainty",
    b: "Every metric carries a confidence signal. We would rather say “likely” than be confidently wrong in your field.",
  },
  {
    t: "Actionable, not academic",
    b: "A diagnosis without a dose rate, timing and an organic alternative is not a finished answer.",
  },
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Agronomy expertise, one photo away"
        description="Most growers in the world will never stand next to an agronomist or send a sample to a laboratory. Farmer's AI exists to close that gap with the camera already in their hand."
      />
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-xl font-semibold">What we do</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We combine multimodal vision models with structured agronomic reasoning: plant pathology,
          soil science, post-harvest physiology and seed technology. A photograph goes in; a
          structured, explainable report comes out — species, disease, deficiency, corrective
          treatment, irrigation plan, quality grade and a printable field record.
        </p>
        <h2 className="mt-10 text-xl font-semibold">What we believe</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.t} className="surface-card p-5">
              <h3 className="text-sm font-semibold">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.b}</p>
            </div>
          ))}
        </div>
        <div className="surface-card mt-10 p-6">
          <h3 className="text-base font-semibold">Advisory, not prescriptive</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Farmer&apos;s AI is a decision-support tool. Reports are estimates generated from visual
            evidence and should be validated against local extension advice, label instructions and
            laboratory testing before large-scale application.
          </p>
        </div>
      </div>
    </>
  );
}
