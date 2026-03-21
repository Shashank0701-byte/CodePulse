import { HeartbeatSchema } from "@codepulse/shared";
import { db } from "../db";
import { updatePresence } from "./presence";

export async function handleHeartbeat(userId: string, rawData: string) {
  try {
    const json = JSON.parse(rawData);
    
    // Validate payload against shared Zod schema
    const result = HeartbeatSchema.safeParse(json);
    if (!result.success) {
      console.error("Invalid heartbeat payload:", result.error);
      return;
    }

    const payload = result.data;

    // 1. Write the raw event to PostgreSQL for historical aggregation
    await db.heartbeat.create({
      data: {
        userId,
        file: payload.file,
        language: payload.language,
        project: payload.project,
        branch: payload.branch,
        editor: payload.editor,
        // using the epoch timestamp from payload if provided
        timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
      },
    });

    // 2. Update live presence in Redis
    await updatePresence(userId, payload);

  } catch (err) {
    console.error("Heartbeat handling error:", err);
  }
}
