'use client'

import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function TestimonialsPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/testimonials' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Testimonials" items={items as any[]} apiPath="/api/admin/testimonials" onRefresh={load}
            columns={[
                { key: 'reviewer_name', label: 'Name', render: (i: any) => i.reviewer_name || i.reviewerName || '' },
                { key: 'reviewer_role', label: 'Role', render: (i: any) => i.reviewer_role || i.reviewerRole || '' },
                { key: 'rating', label: 'Rating', render: (i: any) => '★'.repeat(i.rating || 5) },
                { key: 'approved', label: 'Status', render: (i: any) => i.approved ? '✅ Published' : '⏳ Draft' },
            ]}
            fields={[
                { key: 'reviewerName', label: 'Reviewer Name', type: 'text', required: true },
                { key: 'reviewerRole', label: 'Role / Title', type: 'text', required: true },
                { key: 'reviewerCompany', label: 'Company', type: 'text' },
                { key: 'quote', label: 'Quote', type: 'textarea', required: true },
                {
                    key: 'rating', label: 'Stars (1-5)', type: 'select', required: true,
                    options: [5, 4, 3, 2, 1].map(n => ({ value: String(n), label: '★'.repeat(n) + ` (${n})` }))
                },
                { key: 'order', label: 'Order', type: 'number' },
            ]}
        />
    )
}
