import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { validateApiKey } from "./auth";
import { handleHeartbeat } from "./handlers/heartbeat";

const PORT = process.env.PORT || 3001;
const app = express();

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const server = http.createServer(app);

// Create the WebSocket Server
// We set noServer: true because we want to manually handle the UPGRADE request to perform auth.
const wss = new WebSocketServer({ noServer: true });

// Intercept the HTTP Upgrade request to validate the x-api-key
server.on("upgrade", async (request, socket, head) => {
  try {
    const apiKey = request.headers["x-api-key"] as string | undefined;

    // Validate the API key against the database
    const userId = apiKey ? await validateApiKey(apiKey) : null;

    if (!userId) {
      // 401 Unauthorized
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    // Upgrade the connection if authorized
    wss.handleUpgrade(request, socket, head, (ws) => {
      // Attach the authenticated userId to the websocket connection object
      (ws as any).userId = userId;
      wss.emit("connection", ws, request);
    });
  } catch (err) {
    console.error("Upgrade error:", err);
    socket.destroy();
  }
});

// Handle active connections
wss.on("connection", (ws: WebSocket) => {
  const userId = (ws as any).userId as string;
  console.log(`User connected: ${userId}`);

  ws.on("message", async (message: Buffer) => {
    const rawData = message.toString();
    await handleHeartbeat(userId, rawData);
  });

  ws.on("close", () => {
    console.log(`User disconnected: ${userId}`);
    // Presence TTL will naturally expire in Redis, so we don't need to manually delete.
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error for user ${userId}:`, error);
  });
});

server.listen(PORT, () => {
  console.log(`CodePulse WebSocket server running on port ${PORT}`);
});
