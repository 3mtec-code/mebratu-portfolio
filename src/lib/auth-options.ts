import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
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

                // 1️⃣ Try Supabase admin_users table (production)
                try {
                    const { createClient } = await import('@supabase/supabase-js')
                    const url = process.env.SUPABASE_URL
                    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
                    if (url && key) {
                        const sb = createClient(url, key)
                        const { data: user } = await sb
                            .from('admin_users')
                            .select('*')
                            .eq('email', credentials.email)
                            .single()

                        if (user?.password_hash) {
                            const { compare } = await import('bcryptjs')
                            const valid = await compare(credentials.password, user.password_hash)
                            if (!valid) return null
                            return { id: user.id, email: user.email, name: user.name ?? 'Admin' }
                        }
                    }
                } catch {
                    // Supabase unreachable — fall through
                }

                // 2️⃣ Try Prisma User table (if DATABASE_URL is set)
                try {
                    const { prisma } = await import('./prisma')
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    })
                    if (user?.password) {
                        const { compare } = await import('bcryptjs')
                        const valid = await compare(credentials.password, user.password)
                        if (!valid) return null
                        return { id: user.id, email: user.email!, name: user.name ?? 'Admin' }
                    }
                } catch {
                    // DB unreachable — fall through
                }

                // 3️⃣ Dev fallback — only in development
                if (process.env.NODE_ENV !== 'production') {
                    if (
                        credentials.email === 'admin@portfolio.com' &&
                        credentials.password === 'Admin@123456'
                    ) {
                        return { id: 'dev-admin', email: 'admin@portfolio.com', name: 'Admin (Dev)' }
                    }
                }

                return null
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
