"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const db_js_1 = require("./db.js");
const heartbeat_js_1 = require("./heartbeat.js");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ noServer: true });
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
        const apiKey = request.headers["x-api-key"];
        if (!apiKey || typeof apiKey !== "string") {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\nAPI Key missing");
            socket.destroy();
            return;
        }
        const user = await db_js_1.prisma.user.findUnique({
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
    }
    catch (err) {
        console.error("Upgrade error:", err);
        socket.destroy();
    }
});
wss.on("connection", (ws, request, userId) => {
    console.log(`[WS] Connected user: ${userId}`);
    ws.on("message", async (message) => {
        await (0, heartbeat_js_1.handleHeartbeat)(ws, userId, message.toString());
    });
    ws.on("close", () => {
        console.log(`[WS] Disconnected user: ${userId}`);
    });
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 ws-server listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map