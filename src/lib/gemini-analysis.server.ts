import type { AnalysisReport } from "@/lib/analysis-types";
import { SYSTEM_PROMPT } from "@/lib/analysis-prompt";

/**
 * Model candidates, tried in order. Override with the GEMINI_MODEL env var.
 * If Google retires one, the next is tried automatically instead of hard-failing.
 */
const GOOGLE_MODELS = [
  process.env["GEMINI_MODEL"]?.trim(),
  "gemini-flash-latest",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
].filter(Boolean) as string[];

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

/** One attempt against a specific Google model. */
async function callGoogleModel(
  model: string,
  apiKey: string,
  mimeType: string,
  base64: string,
  note?: string,
) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          {
            role: "user",
            parts: [{ text: buildUserText(note) }, { inlineData: { mimeType, data: base64 } }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    },
  );
}

/** Direct Google Generative Language API call (used when hosting outside Lovable, e.g. Netlify). */
async function analyzeWithGoogleKey(
  rawKey: string,
  imageDataUrl: string,
  note?: string,
): Promise<AnalysisReport> {
  const apiKey = rawKey.trim();
  const match = /^data:([^;,]+);base64,(.+)$/i.exec(imageDataUrl.trim());
  if (!match) throw new AnalysisError("Please upload a valid image file.", 400);
  const [, mimeType, base64] = match;

  let lastMessage = "";
  let lastStatus = 502;

  for (const model of GOOGLE_MODELS) {
    const response = await callGoogleModel(model, apiKey, mimeType!, base64!, note);

    if (response.ok) {
      const payload = (await response.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const raw = payload.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
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
    console.error("Google AI error", model, response.status, providerMessage);
    lastMessage = providerMessage;
    lastStatus = response.status;

    // Model retired / unavailable / not found for this key -> try the next candidate.
    const modelProblem =
      response.status === 404 ||
      /no longer available|not found|not supported|is not available/i.test(providerMessage);
    if (modelProblem) continue;

    if (response.status === 429) {
      throw new AnalysisError(providerMessage || "Too many requests — please try again shortly.", 429);
    }
    if (response.status === 401 || response.status === 403) {
      throw new AnalysisError(
        providerMessage || "The configured GEMINI_API_KEY was rejected by Google AI Studio.",
        403,
      );
    }
    if (response.status === 400) {
      throw new AnalysisError(
        providerMessage || "Google rejected the request. Check the image and API key restrictions.",
        400,
      );
    }
    throw new AnalysisError(
      providerMessage || "Google's analysis service is temporarily unavailable.",
      response.status >= 500 ? 503 : 502,
    );
  }

  throw new AnalysisError(
    lastMessage || "No supported Gemini model is available for this API key.",
    lastStatus >= 500 ? 503 : 502,
  );
}

/** Runs the vision analysis and returns a structured report. */
export async function analyzeWithGemini(input: AnalyzeRequest): Promise<AnalysisReport> {
  const googleKey = (
    process.env["GEMINI_API_KEY"] ??
    process.env["GOOGLE_API_KEY"] ??
    process.env["GOOGLE_GENERATIVE_AI_API_KEY"]
  )?.trim();
  const lovableKey = process.env["LOVABLE_API_KEY"]?.trim();

  if (!googleKey && !lovableKey) {
    throw new AnalysisError(
      "AI is not configured. Add GEMINI_API_KEY in Netlify → Site settings → Environment variables, then redeploy.",
      500,
    );
  }

  if (!input?.imageDataUrl || input.imageDataUrl.length < 20) {
    throw new AnalysisError("An image is required.", 400);
  }
  assertDataUrl(input.imageDataUrl);
  const note = typeof input.note === "string" ? input.note.slice(0, 500) : undefined;

  // Your own Google key takes priority — this is what runs on Netlify.
  if (googleKey) {
    return analyzeWithGoogleKey(googleKey, input.imageDataUrl, note);
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
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: buildUserText(note) },
            { type: "image_url", image_url: { url: input.imageDataUrl } },
          ],
        },
      ],
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
