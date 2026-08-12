/**
 * The effective end time of a coding session for duration calculations.
 *
 * Closed sessions use their recorded endTime. Open sessions that are still
 * within the timeout window are treated as ongoing (end = now). Open sessions
 * that have gone idle past the timeout (e.g. the client stopped sending
 * heartbeats without a graceful close) are capped at lastHeartbeat + timeout,
 * so idle time isn't counted as coding time.
 */
export function getEffectiveSessionEnd(
  session: { endTime: Date | null; lastHeartbeat: Date },
  now: Date,
  timeoutMs: number
): Date {
  if (session.endTime) return session.endTime;

  const staleAt = new Date(session.lastHeartbeat.getTime() + timeoutMs);
  return staleAt < now ? staleAt : now;
}
