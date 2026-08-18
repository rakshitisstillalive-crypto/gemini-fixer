import { createFileRoute } from "@tanstack/react-router";

import { LogoMark } from "@/components/brand/logo";
import { PageHero } from "@/components/site/page";

export const Route = createFileRoute("/company/press")({
  head: () => ({
    meta: [
      { title: "Press Kit — Farmer's AI Brand Assets and Facts" },
      {
        name: "description",
        content:
          "Boilerplate copy, brand colours, logo usage guidance and media contact details for journalists covering Farmer's AI.",
      },
      { property: "og:title", content: "Press Kit — Farmer's AI" },
      {
        property: "og:description",
        content: "Brand assets, boilerplate and media contacts for Farmer's AI.",
      },
    ],
  }),
  component: Page,
});

const palette = [
  { n: "Emerald", v: "#0F9D58" },
  { n: "Deep Forest", v: "#0B5A3A" },
  { n: "Mint", v: "#D6F5E4" },
  { n: "Ink", v: "#0B1F17" },
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Press kit"
        description="Everything you need to write about Farmer's AI accurately."
      />
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-xl font-semibold">Boilerplate</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Farmer&apos;s AI is an agricultural intelligence platform that turns a single photograph of
          a crop, fruit, seed lot or soil sample into a structured agronomic report — covering
          species identification, disease and pest detection, nutrient deficiencies, Brix and pH
          estimation, germination quality and irrigation guidance. Analysis is free and requires no
          account; growers can optionally sign in to save reports and download PDF field records.
        </p>

        <h2 className="mt-10 text-xl font-semibold">Logo</h2>
        <div className="surface-card mt-4 flex items-center gap-4 p-6">
          <LogoMark className="size-14" />
          <p className="text-sm text-muted-foreground">
            Keep clear space equal to half the mark height. Do not stretch, recolour outside the
            palette, or place the mark on a low-contrast background.
          </p>
        </div>

        <h2 className="mt-10 text-xl font-semibold">Palette</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {palette.map((c) => (
            <div key={c.n} className="surface-card overflow-hidden">
              <div className="h-16 w-full" style={{ backgroundColor: c.v }} />
              <div className="p-3">
                <p className="text-sm font-medium">{c.n}</p>
                <p className="text-xs text-muted-foreground">{c.v}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-semibold">Media contact</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          <a href="mailto:press@farmersai.app" className="text-primary hover:underline">
            press@farmersai.app
          </a>{" "}
          — we aim to respond within two business days.
        </p>
      </div>
    </>
  );
}
