import type { AnalysisReport } from "@/lib/analysis-types";

/** Calls the Gemini-backed /api/analyze endpoint (Netlify Function / server route). */
export async function analyzeImageViaApi(input: {
  imageDataUrl: string;
  note?: string | undefined;
}): Promise<AnalysisReport> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => null)) as
    | (AnalysisReport & { error?: string })
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || "The analysis engine could not process this image.");
  }
  if (!payload) throw new Error("The analysis engine returned an unreadable report.");
  return payload as AnalysisReport;
}
