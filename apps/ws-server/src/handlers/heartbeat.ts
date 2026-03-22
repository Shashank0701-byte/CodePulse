import { HeartbeatSchema } from "@codepulse/shared";
import { db } from "../db";
import { updatePresence } from "./presence";

export async function handleHeartbeat(userId: string, rawData: string) {
  console.log(`[WS] Heartbeat received from ${userId} at ${new Date().toISOString()}`);
  try {
    const json = JSON.parse(rawData);
    
    // Validate payload against shared Zod schema
    const result = HeartbeatSchema.safeParse(json);
    if (!result.success) {
      console.error("Invalid heartbeat payload:", result.error);
      return;
    }

    const payload = result.data;
    const now = new Date();

    // 1. Write the raw event to PostgreSQL for historical aggregation
    await db.heartbeat.create({
      data: {
        userId,
        file: payload.file,
        language: payload.language,
        project: payload.project,
        branch: payload.branch,
        editor: payload.editor,
        timestamp: payload.timestamp ? new Date(payload.timestamp) : now,
      },
    });

    // 2. Session Management: Find or create an active session
    const SESSION_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes window
    
    const lastSession = await db.codingSession.findFirst({
        where: {
            userId,
            primaryProject: payload.project,
            endTime: null, // Still active according to our current logic
        },
        orderBy: { startTime: 'desc' }
    });

    if (lastSession) {
        // Update existing session
        await db.codingSession.update({
            where: { id: lastSession.id },
            data: {
                primaryFile: payload.file,
                primaryLanguage: payload.language,
                lastHeartbeat: now,
            }
        });
    } else {
        // Start new session
        await db.codingSession.create({
            data: {
                userId,
                primaryProject: payload.project,
                primaryFile: payload.file,
                primaryLanguage: payload.language,
                startTime: now,
                lastHeartbeat: now,
            }
        });
    }

    // 3. Update live presence in Redis
    await updatePresence(userId, payload);

  } catch (err) {
    console.error("Heartbeat handling error:", err);
  }
}
