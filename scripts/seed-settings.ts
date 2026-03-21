import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db";
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const defaults = [
    { key: "colorblind_mode", value: "false" },
    { key: "last_refresh", value: "null" },
    { key: "onboarding_complete", value: "false" },
    { key: "daily_api_cap", value: "20" },
    { key: "monthly_budget", value: "15.00" },
    { key: "trash_data", value: "null" },
    { key: "trash_expires_at", value: "null" },
    { key: "tooltips_shown", value: "false" },
  ];

  for (const s of defaults) {
    await prisma.appSettings.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  console.log("Seeded default AppSettings");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
