'use client'

import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function ServicesPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/services' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Services" items={items as any[]} apiPath="/api/admin/services" onRefresh={load}
            columns={[
                { key: 'title', label: 'Service' },
                { key: 'description', label: 'Description', render: (i: any) => (i.description || '').slice(0, 60) + '…' },
                { key: 'icon', label: 'Icon' },
                { key: 'order', label: 'Order' },
            ]}
            fields={[
                { key: 'title', label: 'Service Title', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea', required: true },
                {
                    key: 'icon', label: 'Icon', type: 'select', required: true,
                    options: [
                        { value: 'code', label: 'Code (Web Dev)' },
                        { value: 'palette', label: 'Palette (Design)' },
                        { value: 'smartphone', label: 'Smartphone (Mobile)' },
                        { value: 'brain', label: 'Brain (AI)' },
                        { value: 'megaphone', label: 'Megaphone (Branding)' },
                        { value: 'barchart', label: 'Chart (Consulting)' },
                    ]
                },
                { key: 'order', label: 'Order', type: 'number' },
            ]}
        />
    )
}
