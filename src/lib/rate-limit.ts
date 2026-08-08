import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create a rate limiter that allows 5 requests per 60 seconds
let ratelimit: Ratelimit | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, '60 s'),
        analytics: true,
    })
}

export async function checkRateLimit(identifier: string) {
    if (!ratelimit) {
        // If rate limiting is not configured, allow the request
        return { success: true }
    }

    const { success, limit, reset, remaining } = await ratelimit.limit(identifier)

    return {
        success,
        limit,
        reset,
        remaining,
    }
}

// Specific rate limiters for different endpoints
export async function checkContactFormRateLimit(ip: string) {
    return checkRateLimit(`contact_${ip}`)
}

export async function checkAIAssistantRateLimit(ip: string) {
    return checkRateLimit(`ai_${ip}`)
}

export async function checkAdminLoginRateLimit(ip: string) {
    return checkRateLimit(`admin_login_${ip}`)
}
