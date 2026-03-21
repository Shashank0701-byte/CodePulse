import { z } from "zod";

export const HeartbeatSchema = z.object({
  file: z.string(),
  language: z.string(),
  project: z.string(),
  branch: z.string().default("main"),
  editor: z.string().default("vscode"),
  timestamp: z.number().int().optional().default(() => Date.now()), // Allowing numeric epoch
});

export type Heartbeat = z.infer<typeof HeartbeatSchema>;
