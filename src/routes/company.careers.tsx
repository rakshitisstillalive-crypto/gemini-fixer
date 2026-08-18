import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/page";

export const Route = createFileRoute("/company/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Build Agricultural AI at Farmer's AI" },
      {
        name: "description",
        content:
          "Join Farmer's AI. We hire agronomists, plant pathologists, machine learning engineers and field-focused product people.",
      },
      { property: "og:title", content: "Careers at Farmer's AI" },
      {
        property: "og:description",
        content: "Open roles in agronomy, machine learning and product at Farmer's AI.",
      },
    ],
  }),
  component: Page,
});

const roles = [
  {
    t: "Senior Plant Pathologist",
    m: "Research · Remote",
    b: "Own our disease taxonomy, label review pipeline and treatment recommendation accuracy.",
  },
  {
    t: "Computer Vision Engineer",
    m: "Engineering · Remote",
    b: "Improve fine-grained species and lesion recognition across low-quality field photography.",
  },
  {
    t: "Soil Scientist (Consulting)",
    m: "Research · Part-time",
    b: "Validate texture, pH and fertility inference against regional laboratory datasets.",
  },
  {
    t: "Field Product Manager",
    m: "Product · Hybrid",
    b: "Live with growers, translate their season into product decisions.",
  },
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Work where the field meets the model"
        description="Small team, long horizon, real fields. If you want your work measured in yields rather than impressions, we should talk."
      />
      <div className="mx-auto max-w-3xl px-4 py-14">
        <div className="space-y-4">
          {roles.map((r) => (
            <div key={r.t} className="surface-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold">{r.t}</h3>
                <span className="text-xs text-muted-foreground">{r.m}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.b}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Nothing matching? Send your work to{" "}
          <a href="mailto:careers@farmersai.app" className="text-primary hover:underline">
            careers@farmersai.app
          </a>{" "}
          and tell us which crop you know best.
        </p>
      </div>
    </>
  );
}
