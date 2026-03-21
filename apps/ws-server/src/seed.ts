import { PrismaClient } from "../../../apps/web/src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { generateApiKey } from "../../../apps/web/src/lib/api-key.js";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgresql://codepulse:codepulse@localhost:5432/codepulse?schema=public" });
  const adapter = new PrismaPg(pool as any);
  const prisma = new PrismaClient({ adapter });

  // Create a fake test user
  const apiKey = generateApiKey();
  const user = await prisma.user.create({
    data: {
      username: "test_bot_" + Date.now(),
      displayName: "Test Bot",
      apiKey: apiKey,
    }
  });

  console.log("=========================================");
  console.log("CREATED TEST USER:");
  console.log("ID:", user.id);
  console.log("Username:", user.username);
  console.log("API Key:", apiKey);
  console.log("=========================================");

  await prisma.$disconnect();
}

main().catch(console.error);
