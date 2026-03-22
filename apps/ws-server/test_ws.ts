import WebSocket from "ws";
import { db } from "./src/db";

async function runTests() {
  console.log("Starting WebSocket Integration Tests...\n");

  const user = await db.user.findFirst();
  if (!user || !user.apiKey) {
    console.error("No user with API key found in DB.");
    process.exit(1);
  }

  const validKey = user.apiKey;
  const wsUrl = "ws://127.0.0.1:3001";

  console.log("1. Testing Invalid API Key (Should reject with 401)");
  await new Promise<void>((resolve, reject) => {
    const wsFail = new WebSocket(wsUrl, { headers: { "x-api-key": "invalid_key" } });
    wsFail.on("error", (err: any) => {
      if (err.message.includes("401")) {
        console.log("✅ Verified: Rejected invalid connection with 401");
        resolve();
      } else {
        reject("Failed with wrong error: " + err.message);
      }
    });
    wsFail.on("open", () => reject("Should not have connected"));
  });

  console.log("\n2. Testing Valid API Key & Payload");
  await new Promise<void>((resolve, reject) => {
    const ws = new WebSocket(wsUrl, { headers: { "x-api-key": validKey } });
    
    ws.on("open", () => {
      console.log("✅ Verified: Connection established with valid API key");

      // Send a valid heartbeat
      const payload = {
        file: "src/test_ws.ts",
        language: "typescript",
        project: "codepulse",
        branch: "main",
        editor: "vscode",
        timestamp: Date.now()
      };
      
      ws.send(JSON.stringify(payload));
      console.log("✅ Verified: Emitted heartbeat payload");
      
      // Close after a brief delay to ensure it was processed
      setTimeout(() => {
        ws.close();
        resolve();
      }, 500);
    });

    ws.on("error", (err) => reject("Connection failed: " + err.message));
  });

  console.log("\nAll integration tests passed successfully! 🎉");
  process.exit(0);
}

runTests().catch(console.error);
