import { HeartbeatSchema, SESSION_TIMEOUT_MS } from "@codepulse/shared";
import { db } from "../db";
import { updatePresence } from "./presence";
import { isSessionStale } from "./session-timeout";

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
    const lastSession = await db.codingSession.findFirst({
        where: {
            userId,
            primaryProject: payload.project,
            endTime: null, // Still open, but may have gone stale since its last heartbeat
        },
        orderBy: { startTime: 'desc' }
    });

    if (lastSession && !isSessionStale(lastSession.lastHeartbeat, now, SESSION_TIMEOUT_MS)) {
        // Continuation of the same session
        await db.codingSession.update({
            where: { id: lastSession.id },
            data: {
                primaryFile: payload.file,
                primaryLanguage: payload.language,
                lastHeartbeat: now,
            }
        });
    } else {
        if (lastSession) {
            // Too much time has passed since the last heartbeat - close it out before starting fresh
            await db.codingSession.update({
                where: { id: lastSession.id },
                data: { endTime: lastSession.lastHeartbeat },
            });
        }

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
