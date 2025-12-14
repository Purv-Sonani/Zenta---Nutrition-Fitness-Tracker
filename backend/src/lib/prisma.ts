import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// 1. Setup the Postgres Driver (pg)
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// 2. Setup the Prisma Adapter
// This "adapter" layer is what makes Prisma 7 modern and serverless-ready
const adapter = new PrismaPg(pool);

// 3. Setup Singleton for Dev (Prevents "Too many connections" on reload)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, // 👈 CRITICAL: This MUST be here for the modern config to work
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
