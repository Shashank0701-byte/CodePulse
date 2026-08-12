export function buildFallbackSummary(payload: { project: string; language: string }): string {
  return `Building ${payload.project} in ${payload.language}`;
}

export function truncateSummary(text: string, maxLength = 80): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;

  const sliced = trimmed.slice(0, maxLength - 1); // reserve room for the ellipsis
  const lastSpace = sliced.lastIndexOf(" ");
  const cut = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
  return `${cut.trimEnd()}…`;
}

export const SUMMARY_TTL_SECONDS = 4 * 60 * 60;

export interface SummaryPayload {
  file: string;
  language: string;
  project: string;
  branch: string;
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.5-flash-lite";
const REQUEST_TIMEOUT_MS = 8000;

export async function generateSummary(
  payload: SummaryPayload,
  deps: { fetchImpl?: typeof fetch } = {}
): Promise<string> {
  const fallback = truncateSummary(buildFallbackSummary(payload));

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return fallback;

  const fetchImpl = deps.fetchImpl ?? fetch;
  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetchImpl(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: `In one line (max 80 characters, no quotes), describe what a developer is building right now. File: ${payload.file}. Language: ${payload.language}. Project: ${payload.project}. Branch: ${payload.branch}.`,
          },
        ],
        max_tokens: 40,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error("OpenRouter returned", response.status);
      return fallback;
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || text.trim().length === 0) return fallback;

    return truncateSummary(text);
  } catch (err) {
    console.error("AI summary generation failed, using fallback:", err);
    return fallback;
  } finally {
    clearTimeout(timeoutHandle);
  }
}
