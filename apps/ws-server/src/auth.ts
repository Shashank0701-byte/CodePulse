import { db } from "./db";

/**
 * Validates the x-api-key header against the database.
 * @param apiKey The raw API key string
 * @returns The user's ID if valid, or null if invalid
 */
export async function validateApiKey(apiKey: string): Promise<string | null> {
  if (!apiKey || !apiKey.startsWith("cp_")) return null;

  try {
    const user = await db.user.findUnique({
      where: { apiKey },
      select: { id: true },
    });
    
    return user?.id || null;
  } catch (err) {
    console.error("Auth DB Error:", err);
    return null;
  }
}
