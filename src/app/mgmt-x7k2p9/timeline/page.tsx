'use client'

import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function TimelinePage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/timeline' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Timeline Entries" items={items as any[]} apiPath="/api/admin/timeline" onRefresh={load}
            columns={[
                { key: 'year', label: 'Year' },
                { key: 'title', label: 'Title' },
                { key: 'description', label: 'Description', render: (i: any) => (i.description || '').slice(0, 50) + '…' },
                { key: 'order', label: 'Order' },
            ]}
            fields={[
                { key: 'year', label: 'Year', type: 'text', required: true, placeholder: '2024' },
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea', required: true },
                { key: 'order', label: 'Order', type: 'number' },
            ]}
        />
    )
}
