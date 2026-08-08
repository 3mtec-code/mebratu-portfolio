'use client'

import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AwardsPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/awards' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Awards" items={items as any[]} apiPath="/api/admin/awards" onRefresh={load}
            columns={[
                { key: 'title', label: 'Title' },
                { key: 'issuer', label: 'Issuer' },
                { key: 'issue_date', label: 'Date', render: (i: any) => i.issue_date ? formatDate(i.issue_date) : i.issueDate ? formatDate(i.issueDate) : '' },
            ]}
            fields={[
                { key: 'title', label: 'Award Title', type: 'text', required: true },
                { key: 'issuer', label: 'Issuer', type: 'text', required: true },
                { key: 'issueDate', label: 'Date', type: 'date', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'order', label: 'Order', type: 'number' },
            ]}
        />
    )
}
