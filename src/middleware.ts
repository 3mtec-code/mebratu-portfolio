import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PATH = '/mgmt-x7k2p9'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only apply to admin paths
    if (!pathname.startsWith(ADMIN_PATH)) {
        return NextResponse.next()
    }

    // Skip Basic Auth for:
    // - The login page itself
    // - NextAuth API routes (sign-in callback, session checks)
    const isLoginPage = pathname === `${ADMIN_PATH}/login`
    const isNextAuthApi = pathname.startsWith('/api/auth')

    if (isLoginPage || isNextAuthApi) {
        return NextResponse.next()
    }

    // Require Basic HTTP Auth for everything else under /mgmt-x7k2p9
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
                    user === process.env.ADMIN_HTTP_USER &&
                    pass === process.env.ADMIN_HTTP_PASSWORD
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
    matcher: ['/mgmt-x7k2p9/:path*'],
}
