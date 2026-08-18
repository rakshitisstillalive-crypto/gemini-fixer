import type { AnalysisReport } from "@/lib/analysis-types";
import { SYSTEM_PROMPT } from "@/lib/analysis-prompt";

/**
 * OpenAI vision models, tried in order. Override with the OPENAI_MODEL env var.
 * If one is unavailable for the key, the next is tried automatically.
 */
const OPENAI_MODELS = [
  process.env["OPENAI_MODEL"]?.trim(),
  "gpt-4o-mini",
  "gpt-4o",
].filter(Boolean) as string[];

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const GATEWAY_MODEL = "google/gemini-2.5-flash";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type AnalyzeRequest = { imageDataUrl: string; note?: string | undefined };

export class AnalysisError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

function assertDataUrl(dataUrl: string) {
  if (!/^data:[^;,]+;base64,.+$/i.test(dataUrl.trim())) {
    throw new AnalysisError("Please upload a valid image file.", 400);
  }
}

function extractReport(raw: string): AnalysisReport {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as AnalysisReport;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as AnalysisReport;
    }
    throw new AnalysisError("The analysis engine returned an unreadable report. Please retry.", 502);
  }
}

function buildUserText(note?: string) {
  return note
    ? `Analyse this sample and return the JSON report. Grower note: ${note}`
    : "Analyse this sample and return the JSON report.";
}

function buildMessages(imageDataUrl: string, note?: string) {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: buildUserText(note) },
        { type: "image_url", image_url: { url: imageDataUrl } },
      ],
    },
  ];
}

/** One attempt against a specific OpenAI model. */
async function callOpenAiModel(
  model: string,
  apiKey: string,
  imageDataUrl: string,
  note?: string,
) {
  return fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: buildMessages(imageDataUrl, note),
    }),
  });
}

/** Direct OpenAI API call (used when hosting outside Lovable, e.g. Netlify). */
async function analyzeWithOpenAiKey(
  rawKey: string,
  imageDataUrl: string,
  note?: string,
): Promise<AnalysisReport> {
  const apiKey = rawKey.trim();
  let lastMessage = "";
  let lastStatus = 502;

  for (const model of OPENAI_MODELS) {
    const response = await callOpenAiModel(model, apiKey, imageDataUrl, note);

    if (response.ok) {
      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const raw = payload.choices?.[0]?.message?.content ?? "";
      if (!raw) throw new AnalysisError("The analysis engine returned an empty report.", 502);
      return extractReport(raw);
    }

    const body = await response.text();
    let providerMessage = "";
    try {
      providerMessage = (JSON.parse(body) as { error?: { message?: string } }).error?.message?.trim() ?? "";
    } catch {
      providerMessage = body.slice(0, 300);
    }
    console.error("OpenAI error", model, response.status, providerMessage);
    lastMessage = providerMessage;
    lastStatus = response.status;

    // Model not available for this key/project -> try the next candidate.
    const modelProblem =
      response.status === 404 ||
      /does not exist|do not have access|not found|unsupported model|deprecated/i.test(providerMessage);
    if (modelProblem) continue;

    if (response.status === 429) {
      throw new AnalysisError(
        providerMessage || "Too many requests or quota exceeded — please try again shortly.",
        429,
      );
    }
    if (response.status === 401 || response.status === 403) {
      throw new AnalysisError(
        providerMessage || "The configured OPENAI_API_KEY was rejected by OpenAI.",
        403,
      );
    }
    if (response.status === 400) {
      throw new AnalysisError(
        providerMessage || "OpenAI rejected the request. Check the image size and format.",
        400,
      );
    }
    throw new AnalysisError(
      providerMessage || "OpenAI's service is temporarily unavailable.",
      response.status >= 500 ? 503 : 502,
    );
  }

  throw new AnalysisError(
    lastMessage || "No supported OpenAI vision model is available for this API key.",
    lastStatus >= 500 ? 503 : 502,
  );
}

/** Runs the vision analysis and returns a structured report. */
export async function analyzeWithGemini(input: AnalyzeRequest): Promise<AnalysisReport> {
  const openAiKey = process.env["OPENAI_API_KEY"]?.trim();
  const lovableKey = process.env["LOVABLE_API_KEY"]?.trim();

  if (!openAiKey && !lovableKey) {
    throw new AnalysisError(
      "AI is not configured. Add OPENAI_API_KEY in Netlify → Site settings → Environment variables, then redeploy.",
      500,
    );
  }

  if (!input?.imageDataUrl || input.imageDataUrl.length < 20) {
    throw new AnalysisError("An image is required.", 400);
  }
  assertDataUrl(input.imageDataUrl);
  const note = typeof input.note === "string" ? input.note.slice(0, 500) : undefined;

  // Your own OpenAI key takes priority — this is what runs on Netlify.
  if (openAiKey) {
    return analyzeWithOpenAiKey(openAiKey, input.imageDataUrl, note);
  }

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": lovableKey!,
    },
    body: JSON.stringify({
      model: GATEWAY_MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: buildMessages(input.imageDataUrl, note),
    }),
  });

  if (response.status === 429) {
    throw new AnalysisError("Too many requests — please try again shortly.", 429);
  }
  if (response.status === 402) {
    throw new AnalysisError("AI credits are exhausted. Please top up to continue.", 402);
  }
  if (!response.ok) {
    const body = await response.text();
    console.error("AI gateway error", response.status, body);
    throw new AnalysisError("The analysis engine could not process this image.", 502);
  }

  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = payload.choices?.[0]?.message?.content ?? "";
  if (!raw) throw new AnalysisError("The analysis engine returned an empty report.", 502);
  return extractReport(raw);
}
