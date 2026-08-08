'use client'

import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function SocialPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/social' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Social Links" items={items as any[]} apiPath="/api/admin/social" onRefresh={load}
            columns={[
                { key: 'platform', label: 'Platform' },
                { key: 'icon', label: 'Icon' },
                { key: 'url', label: 'URL', render: (i: any) => <a href={i.url} target="_blank" className="text-indigo-600 hover:underline text-xs">{(i.url || '').slice(0, 40)}</a> },
                { key: 'order', label: 'Order' },
            ]}
            fields={[
                { key: 'platform', label: 'Platform Name', type: 'text', required: true, placeholder: 'LinkedIn' },
                { key: 'url', label: 'Profile URL', type: 'url', required: true },
                {
                    key: 'icon', label: 'Icon', type: 'select', required: true,
                    options: [
                        { value: 'linkedin', label: 'LinkedIn' },
                        { value: 'github', label: 'GitHub' },
                        { value: 'twitter', label: 'Twitter/X' },
                        { value: 'instagram', label: 'Instagram' },
                        { value: 'dribbble', label: 'Dribbble' },
                        { value: 'youtube', label: 'YouTube' },
                        { value: 'mail', label: 'Email' },
                    ]
                },
                { key: 'order', label: 'Order', type: 'number' },
            ]}
        />
    )
}
