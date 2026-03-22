import { db } from "./db";

async function debug() {
  console.log("--- DATABASE DEBUG ---");
  try {
    const userCount = await db.user.count();
    const heartbeatCount = await db.heartbeat.count();
    const sessionCount = await db.codingSession.count();
    
    console.log(`Users: ${userCount}`);
    console.log(`Heartbeats: ${heartbeatCount}`);
    console.log(`Coding Sessions: ${sessionCount}`);
    
    const latestHeartbeat = await db.heartbeat.findFirst({ orderBy: { timestamp: 'desc' } });
    console.log("Latest Heartbeat:", latestHeartbeat);
    
    const latestSession = await db.codingSession.findFirst({ orderBy: { startTime: 'desc' } });
    console.log("Latest Session:", latestSession);
    
    if (latestHeartbeat && latestSession) {
        console.log("Session matches UserId:", latestHeartbeat.userId === latestSession.userId);
    }

  } catch (err) {
    console.error("Debug failed:", err);
  } finally {
    process.exit(0);
  }
}

debug();
