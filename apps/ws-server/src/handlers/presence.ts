import { redis } from "../redis";

const PRESENCE_TTL_SECONDS = 90;

export async function updatePresence(userId: string, payload: any) {
  const key = `user:presence:${userId}`;
  
  try {
    // 1. Store the latest heartbeat in Redis with a 90s TTL
    await redis.setex(key, PRESENCE_TTL_SECONDS, JSON.stringify(payload));
    
    // 2. Publish to the SSE pub/sub channel for realtime frontend updates
    await redis.publish("presence:updates", JSON.stringify({ userId, ...payload }));
  } catch (err) {
    console.error(`Failed to update presence for ${userId}:`, err);
  }
}
