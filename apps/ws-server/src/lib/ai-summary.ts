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
