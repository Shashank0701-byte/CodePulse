export function getStatusHeadline(
  presence: { project: string; summary?: string } | null
): string | null {
  if (!presence) return null;
  const summary = presence.summary?.trim();
  return summary ? summary : `Working on "${presence.project}"`;
}
