import { PrismaClient } from "../../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;

  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "TURSO_DATABASE_URL is not set. Add it to your Vercel project environment variables."
      );
    }
    // Local dev fallback to SQLite file
    const adapter = new PrismaLibSql({ url: "file:./prisma/dev.db" });
    return new PrismaClient({ adapter });
  }

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
