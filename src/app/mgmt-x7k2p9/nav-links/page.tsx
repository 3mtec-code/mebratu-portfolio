'use client'

import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function NavLinksPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/navLinks' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Navigation Links" items={items as any[]} apiPath="/api/admin/navLinks" onRefresh={load}
            emptyMessage="No nav links configured."
            columns={[
                { key: 'label', label: 'Label' },
                { key: 'href', label: 'Path' },
                { key: 'order', label: 'Order' },
            ]}
            fields={[
                { key: 'label', label: 'Menu Label', type: 'text', required: true, placeholder: 'About' },
                { key: 'href', label: 'Path', type: 'text', required: true, placeholder: '/about', hint: 'Internal path starting with /' },
                { key: 'order', label: 'Order', type: 'number' },
            ]}
        />
    )
}
