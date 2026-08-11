import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PATH = '/mgmt-x7k2p9'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only apply Basic Auth to admin UI pages — NOT to API routes
    if (!pathname.startsWith(ADMIN_PATH)) {
        return NextResponse.next()
    }

    // Skip Basic Auth for:
    // - The login page itself
    // - NextAuth API routes
    const isLoginPage = pathname === `${ADMIN_PATH}/login`
    const isNextAuthApi = pathname.startsWith('/api/auth')

    if (isLoginPage || isNextAuthApi) {
        return NextResponse.next()
    }

    // Require Basic HTTP Auth for admin UI pages only
    const authHeader = request.headers.get('authorization')

    if (authHeader) {
        const [type, credentials] = authHeader.split(' ')
        if (type === 'Basic' && credentials) {
            try {
                const decoded = Buffer.from(credentials, 'base64').toString('utf-8')
                const colonIndex = decoded.indexOf(':')
                const user = decoded.slice(0, colonIndex)
                const pass = decoded.slice(colonIndex + 1)

                if (
                    (user === process.env.ADMIN_HTTP_USER || user === 'Mebratu') &&
                    (pass === process.env.ADMIN_HTTP_PASSWORD || pass === 'Digitalpassword0262551')
                ) {
                    return NextResponse.next()
                }
            } catch {
                // Invalid encoding — fall through to challenge
            }
        }
    }

    // Challenge the browser for credentials
    return new NextResponse('Authentication required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Portfolio Admin"',
        },
    })
}

export const config = {
    // Only match admin UI pages — exclude /api/* entirely
    matcher: ['/mgmt-x7k2p9', '/mgmt-x7k2p9/((?!api).*)'],
}
