"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHeartbeat = handleHeartbeat;
const db_js_1 = require("./db.js");
const shared_1 = require("@codepulse/shared");
async function handleHeartbeat(ws, userId, message) {
    try {
        const rawData = JSON.parse(message);
        const result = shared_1.HeartbeatSchema.safeParse(rawData);
        if (!result.success) {
            ws.send(JSON.stringify({ error: "Invalid heartbeat payload", details: result.error }));
            return;
        }
        const heartbeat = result.data;
        const now = new Date(heartbeat.timestamp);
        // 1. Insert into PostgreSQL
        const inserted = await db_js_1.prisma.heartbeat.create({
            data: {
                userId,
                file: heartbeat.file,
                language: heartbeat.language,
                project: heartbeat.project,
                branch: heartbeat.branch,
                editor: heartbeat.editor,
                timestamp: now,
            },
        });
        // 2. Set live presence in Redis with 90s TTL
        const presenceKey = `user:presence:${userId}`;
        const presenceData = {
            ...heartbeat,
            userId,
            isLive: true,
            lastUpdated: now.toISOString(),
        };
        await db_js_1.redis.set(presenceKey, JSON.stringify(presenceData), "EX", 90);
        // Ack back to extension
        ws.send(JSON.stringify({ status: "acknowledged", id: inserted.id }));
    }
    catch (err) {
        console.error("Failed to handle heartbeat:", err);
        ws.send(JSON.stringify({ error: "Internal server error processing heartbeat" }));
    }
}
//# sourceMappingURL=heartbeat.js.map