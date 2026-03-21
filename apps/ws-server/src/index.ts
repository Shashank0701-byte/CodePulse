import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { prisma } from "./db.js";
import { handleHeartbeat } from "./heartbeat.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Upgrade HTTP to WS if authenticated
server.on("upgrade", async (request, socket, head) => {
  try {
    const url = new URL(request.url || "", `http://${request.headers.host}`);
    
    if (url.pathname !== "/ws") {
      socket.destroy();
      return;
    }

    const apiKey = request.headers["x-api-key"] as string | undefined;

    if (!apiKey || typeof apiKey !== "string") {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\nAPI Key missing");
      socket.destroy();
      return;
    }

    const user = await prisma.user.findUnique({
      where: { apiKey }
    });

    if (!user) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\nInvalid API Key");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, user.id);
    });
  } catch (err) {
    console.error("Upgrade error:", err);
    socket.destroy();
  }
});

wss.on("connection", (ws: WebSocket, request: http.IncomingMessage, userId: string) => {
  console.log(`[WS] Connected user: ${userId}`);

  ws.on("message", async (message: Buffer) => {
    await handleHeartbeat(ws, userId, message.toString());
  });

  ws.on("close", () => {
    console.log(`[WS] Disconnected user: ${userId}`);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 ws-server listening on port ${PORT}`);
});
