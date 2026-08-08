'use client'

import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function InfoCardsPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/infoCards' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Hero Info Cards" items={items as any[]} apiPath="/api/admin/infoCards" onRefresh={load}
            emptyMessage="No info cards yet. These are the floating cards on the Hero section."
            columns={[
                { key: 'title', label: 'Title' },
                { key: 'description', label: 'Description' },
                { key: 'icon', label: 'Icon' },
                { key: 'order', label: 'Order' },
            ]}
            fields={[
                { key: 'title', label: 'Card Title', type: 'text', required: true, placeholder: 'Full Stack Developer' },
                { key: 'description', label: 'Description', type: 'text', placeholder: 'Building scalable applications' },
                {
                    key: 'icon', label: 'Icon', type: 'select', required: true,
                    options: [
                        { value: 'code', label: 'Code' },
                        { value: 'palette', label: 'Palette (Design)' },
                        { value: 'zap', label: 'Zap (Cybersecurity)' },
                        { value: 'brain', label: 'Brain (AI)' },
                        { value: 'check', label: 'Check (Available)' },
                        { value: 'smartphone', label: 'Smartphone (Mobile)' },
                    ]
                },
                { key: 'order', label: 'Display Order', type: 'number' },
            ]}
        />
    )
}
