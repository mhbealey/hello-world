import { PrismaClient } from "../../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function getDbUrl(): string {
  const url = process.env.TURSO_DATABASE_URL;
  if (url) return url;

  // Local dev fallback — only works on a real filesystem, never on Vercel
  if (process.env.NODE_ENV !== "production") {
    return "file:./prisma/dev.db";
  }

  throw new Error(
    "TURSO_DATABASE_URL is not set. " +
    "Verify it exists in .env.production and that next.config.ts passes it via the env config."
  );
}

function createPrismaClient() {
  const url = getDbUrl();
  const adapter = new PrismaLibSql({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
