import { PrismaClient } from "../../../apps/web/src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { Redis } from "ioredis";

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool as any);
  return new PrismaClient({ adapter });
}

export const prisma = createPrismaClient();

export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
