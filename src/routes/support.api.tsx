import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/page";

export const Route = createFileRoute("/support/api")({
  head: () => ({
    meta: [
      { title: "API Documentation — Farmer's AI Analysis Endpoint" },
      {
        name: "description",
        content:
          "Reference for the Farmer's AI analysis interface: request payload, report schema, confidence fields and error handling.",
      },
      { property: "og:title", content: "API Documentation — Farmer's AI" },
      {
        property: "og:description",
        content: "Analysis request payload, report schema and error handling reference.",
      },
    ],
  }),
  component: Page,
});

const request = `{
  "imageDataUrl": "data:image/jpeg;base64,<...>",
  "note": "Optional grower context, e.g. 'tomato, week 6, drip irrigated'"
}`;

const response = `{
  "kind": "plant | produce | seed | soil | unknown",
  "title": "Tomato — early blight, moderate",
  "summary": "…",
  "confidence": 0.86,
  "identity":   { "commonName": "...", "scientificName": "...", "variety": "..." },
  "health":     { "score": 62, "status": "...", "diseases": [], "pests": [] },
  "nutrients":  [{ "name": "Nitrogen", "status": "deficient", "note": "..." }],
  "quality":    { "brix": "...", "ph": "...", "ripeness": "...", "shelfLife": "..." },
  "soil":       { "texture": "...", "ph": "...", "organicMatter": "...", "npk": "..." },
  "seed":       { "germination": "...", "purity": "...", "vigour": "..." },
  "irrigation": { "method": "...", "frequency": "...", "volume": "..." },
  "safety":     { "risk": "low | medium | high", "notes": ["..."] },
  "recommendations": [{ "title": "...", "detail": "...", "type": "organic | chemical | cultural" }]
}`;

function Block({ title, code }: { title: string; code: string }) {
  return (
    <div className="surface-card overflow-hidden">
      <p className="border-b border-border bg-secondary/50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-muted-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="API documentation"
        description="The same analysis engine that powers the web app, described so you can integrate it into your own farm management stack."
      />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-14">
        <section>
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Analysis runs server-side. The client submits a base64 data URL of the sample photograph
            and receives a structured JSON report. Images are processed in memory for the request and
            are only persisted when a signed-in user explicitly saves the report.
          </p>
        </section>
        <Block title="Request payload" code={request} />
        <Block title="Report schema" code={response} />
        <section>
          <h2 className="text-xl font-semibold">Field notes</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="ml-5 list-disc">
              <strong className="text-foreground">kind</strong> determines which optional blocks are
              populated. Blocks irrelevant to the sample are omitted rather than null-filled.
            </li>
            <li className="ml-5 list-disc">
              <strong className="text-foreground">confidence</strong> is a 0–1 float. Treat anything
              below 0.5 as a prompt to retake the photo.
            </li>
            <li className="ml-5 list-disc">
              Images should be under 8&nbsp;MB, JPEG or PNG, longest edge at least 800&nbsp;px.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Errors</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="ml-5 list-disc">
              <strong className="text-foreground">429</strong> — rate limited. Back off and retry.
            </li>
            <li className="ml-5 list-disc">
              <strong className="text-foreground">402</strong> — analysis credits exhausted.
            </li>
            <li className="ml-5 list-disc">
              <strong className="text-foreground">422</strong> — the image could not be interpreted as
              a biological sample.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
