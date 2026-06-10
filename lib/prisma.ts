import { PrismaClient } from '@prisma/client'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  })()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
