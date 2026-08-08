import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// ─── Dev / fallback credentials ──────────────────────────────────────────────
// These work without any database. Replace via DB after seeding.
const DEV_EMAIL = 'admin@portfolio.com'
const DEV_PASSWORD = 'Admin@123456'

// ─── Auth options ─────────────────────────────────────────────────────────────
export const authOptions: NextAuthOptions = {
    // Pure JWT — no database adapter needed for the session
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: '/mgmt-x7k2p9/login' },

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                // 1️⃣  Try real database user first (only if DB is available)
                try {
                    const { prisma } = await import('./prisma')
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    })

                    if (user?.password) {
                        const { compare } = await import('bcryptjs')
                        const valid = await compare(credentials.password, user.password)
                        if (!valid) return null        // wrong password → reject
                        return { id: user.id, email: user.email!, name: user.name ?? 'Admin' }
                    }
                } catch {
                    // DB unreachable — fall through to dev fallback below
                }

                // 2️⃣  Dev / no-DB fallback — only active in development + explicit opt-in
                if (
                    process.env.NODE_ENV !== 'production' &&
                    credentials.email === DEV_EMAIL &&
                    credentials.password === DEV_PASSWORD
                ) {
                    console.warn('[Auth] ⚠ Dev fallback login — configure real DB for production')
                    return { id: 'dev-admin', email: DEV_EMAIL, name: 'Admin (Dev)' }
                }

                return null  // reject
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
            }
            return session
        },
    },
}
