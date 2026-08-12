export function mergeSummaryIntoPresence<T extends object>(
  payload: T,
  summary: string | null
): T & { summary?: string } {
  if (!summary) return payload;
  return { ...payload, summary };
}
