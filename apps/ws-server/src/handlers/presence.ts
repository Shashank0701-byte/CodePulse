import { redis } from "../redis";
import { mergeSummaryIntoPresence } from "../lib/presence-merge";

export { mergeSummaryIntoPresence } from "../lib/presence-merge";

const PRESENCE_TTL_SECONDS = 90;

export async function updatePresence(userId: string, payload: any) {
  const key = `user:presence:${userId}`;

  try {
    let summary: string | null = null;
    try {
      summary = await redis.get(`user:summary:${userId}`);
    } catch (err) {
      console.error(`Failed to read cached summary for ${userId}:`, err);
    }

    const enrichedPayload = mergeSummaryIntoPresence(payload, summary);

    // 1. Store the latest heartbeat in Redis with a 90s TTL
    await redis.setex(key, PRESENCE_TTL_SECONDS, JSON.stringify(enrichedPayload));

    // 2. Publish to the SSE pub/sub channel for realtime frontend updates
    await redis.publish("presence:updates", JSON.stringify({ userId, ...enrichedPayload }));
  } catch (err) {
    console.error(`Failed to update presence for ${userId}:`, err);
  }
}
