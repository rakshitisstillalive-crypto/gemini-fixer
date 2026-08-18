import { createFileRoute } from "@tanstack/react-router";

import { analyzeWithGemini, AnalysisError } from "@/lib/gemini-analysis.server";

export const Route = createFileRoute("/api/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { imageDataUrl?: string; note?: string };
          const report = await analyzeWithGemini({
            imageDataUrl: body.imageDataUrl ?? "",
            note: body.note,
          });
          return Response.json(report);
        } catch (error) {
          const status = error instanceof AnalysisError ? error.status : 500;
          const message = error instanceof Error ? error.message : "Analysis failed.";
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});
