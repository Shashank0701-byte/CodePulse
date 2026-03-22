import { prisma } from "../apps/web/src/lib/db";

async function main() {
  const users = await prisma.user.findMany();
  console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error);
