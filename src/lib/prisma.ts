import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
    const url = process.env.DATABASE_URL

    if (!url) {
        console.warn('[Prisma] DATABASE_URL not set — DB features will be unavailable')
    }

    // Use a fallback URL that will fail gracefully rather than crash at startup
    const connectionString = url || 'postgresql://localhost:5432/portfolio'

    const pool = new Pool({
        connectionString,
        // Short timeouts so DB errors fail fast instead of hanging
        connectionTimeoutMillis: 3000,
        idleTimeoutMillis: 10000,
        max: 5,
    })

    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
