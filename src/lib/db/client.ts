import { PrismaClient } from "../../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  __prisma: PrismaClient | undefined;
};

/**
 * Get the Prisma client singleton.
 * Lazily created on first call so env vars are resolved at runtime, not bundle time.
 */
function getClient(): PrismaClient {
  if (!globalForPrisma.__prisma) {
    // Bracket notation prevents bundler from inlining/replacing env vars
    const url = process.env["TURSO_DATABASE_URL"] || "file:./prisma/dev.db";
    const authToken = process.env["TURSO_AUTH_TOKEN"];

    console.log(`[DB] Connecting to: ${url.startsWith("libsql") ? "Turso (remote)" : url}`);

    const adapter = new PrismaLibSql({ url, authToken });
    globalForPrisma.__prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.__prisma;
}

// Use a Proxy so callers can import `prisma` and use it like a normal object,
// but the actual client is created lazily on first property access.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
