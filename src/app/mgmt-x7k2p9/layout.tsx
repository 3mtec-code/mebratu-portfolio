import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminShell from '@/components/admin/AdminShell'

export const metadata: Metadata = {
    title: {
        default: 'Admin Dashboard',
        template: '%s | Admin',
    },
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminShell>
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                <AdminSidebar />
                <main className="flex-1 lg:ml-64 min-h-screen">
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </AdminShell>
    )
}
