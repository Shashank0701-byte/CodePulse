import { randomBytes } from "crypto";

/**
 * Generates a secure, URL-safe API key.
 * Format: cp_<32 random hex characters> (e.g. cp_a1b2c3d4e5f6...)
 */
export function generateApiKey(): string {
  const key = randomBytes(32).toString("hex");
  return `cp_${key}`;
}
