/**
 * A session is stale once the gap since its last heartbeat reaches the timeout window.
 */
export function isSessionStale(lastHeartbeat: Date, now: Date, timeoutMs: number): boolean {
  return now.getTime() - lastHeartbeat.getTime() >= timeoutMs;
}
