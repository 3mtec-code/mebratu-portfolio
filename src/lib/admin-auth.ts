import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth-options'

export async function isAdminAuthorized(req: NextRequest): Promise<boolean> {
    // Check 1: NextAuth session (works when NEXTAUTH_URL matches)
    try {
        const session = await getServerSession(authOptions)
        if (session) return true
    } catch { }

    // Check 2: Session cookie present (fallback for URL mismatch on Vercel)
    const cookie = req.headers.get('cookie') || ''
    if (
        cookie.includes('next-auth.session-token') ||
        cookie.includes('__Secure-next-auth.session-token')
    ) {
        return true
    }

    // Check 3: Basic Auth header
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Basic ')) {
        try {
            const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8')
            const colonIdx = decoded.indexOf(':')
            const user = decoded.slice(0, colonIdx)
            const pass = decoded.slice(colonIdx + 1)
            const validUser = process.env.ADMIN_HTTP_USER || 'Mebratu'
            const validPass = process.env.ADMIN_HTTP_PASSWORD || 'Digitalpassword0262551'
            if (user === validUser && pass === validPass) return true
        } catch { }
    }

    return false
}
