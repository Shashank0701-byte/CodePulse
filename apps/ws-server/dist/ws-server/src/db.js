"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.prisma = void 0;
const client_js_1 = require("../../../apps/web/src/generated/prisma/client.js");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const ioredis_1 = require("ioredis");
function createPrismaClient() {
    const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    return new client_js_1.PrismaClient({ adapter });
}
exports.prisma = createPrismaClient();
exports.redis = new ioredis_1.Redis(process.env.REDIS_URL || "redis://localhost:6379");
//# sourceMappingURL=db.js.map