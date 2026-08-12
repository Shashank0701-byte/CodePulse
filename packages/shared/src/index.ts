import { z } from "zod";

// How long a CodingSession can go without a heartbeat before it's considered over.
export const SESSION_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

export const HeartbeatSchema = z.object({
  file: z.string(),
  language: z.string(),
  project: z.string(),
  branch: z.string().default("main"),
  editor: z.string().default("vscode"),
  timestamp: z.number().int().optional().default(() => Date.now()), // Allowing numeric epoch
});

export type Heartbeat = z.infer<typeof HeartbeatSchema>;
