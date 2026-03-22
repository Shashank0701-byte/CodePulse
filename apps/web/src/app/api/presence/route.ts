import { auth } from "@/lib/auth";
import { Redis } from "ioredis";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get("userId");

  const session = await auth();
  const currentUserId = session?.user?.id;
  const userId = targetUserId || currentUserId;

  if (!userId) {
    return new Response("Missing userId", { status: 400 });
  }

  const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
  const subscriber = redis.duplicate();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Send initial keepalive
      controller.enqueue(encoder.encode("data: {\"type\":\"connected\"}\n\n"));

      await subscriber.subscribe("presence:updates");

      subscriber.on("message", (channel, message) => {
        try {
          const data = JSON.parse(message);
          if (data.userId === userId) {
            controller.enqueue(encoder.encode(`data: ${message}\n\n`));
          }
        } catch (err) {
          console.error("Error parsing presence message:", err);
        }
      });

      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch(e) { /* ignore */ }
      }, 15000);

      req.signal.onabort = () => {
        clearInterval(keepAlive);
        subscriber.unsubscribe();
        subscriber.quit();
        redis.quit();
        try { controller.close(); } catch(e) {}
      };
    },
    cancel() {
      subscriber.unsubscribe();
      subscriber.quit();
      redis.quit();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
