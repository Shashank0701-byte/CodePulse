import { PrismaClient } from "../../web/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Because the generated Prisma client is currently inside apps/web/src/generated/prisma,
// we'll instantiate it directly from that path if it's not in node_modules,
// but actually Next.js / pnpm might resolve standard "@prisma/client" if it's there.
// For now, let's just use the standard import and rely on the generated code.

const connectionString = process.env.DATABASE_URL || "postgresql://codepulse:codepulse@localhost:5432/codepulse";
const pool = new Pool({ connectionString });
// @ts-ignore
const adapter = new PrismaPg(pool);

export const db = new PrismaClient({ adapter });
