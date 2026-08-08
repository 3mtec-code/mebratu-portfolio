'use client'

import { useSession } from 'next-auth/react'
import AdminLoginPage from '@/app/mgmt-x7k2p9/login/LoginForm'
import { Loader2 } from 'lucide-react'

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()

    // Still checking session
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading admin panel…</p>
                </div>
            </div>
        )
    }

    // Not logged in — show login form inline (no redirect, no loop)
    if (!session) {
        return <AdminLoginPage />
    }

    // Authenticated — show the actual admin UI
    return <>{children}</>
}
