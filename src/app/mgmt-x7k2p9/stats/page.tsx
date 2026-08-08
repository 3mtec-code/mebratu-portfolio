'use client'

import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function StatsPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/stats' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Hero Stats" items={items as any[]} apiPath="/api/admin/stats" onRefresh={load}
            emptyMessage="No stats yet."
            columns={[
                { key: 'label', label: 'Label' },
                { key: 'value', label: 'Value', render: (i: any) => `${i.value}` },
                { key: 'auto_calc', label: 'Auto-Calc', render: (i: any) => i.auto_calc || i.autoCalc ? '✅ Auto' : '✏️ Manual' },
                { key: 'order', label: 'Order' },
            ]}
            fields={[
                { key: 'label', label: 'Label', type: 'text', required: true, placeholder: 'Years Experience' },
                { key: 'value', label: 'Value', type: 'text', required: true, placeholder: '30+', hint: 'Auto-calculated stats override this at runtime.' },
                { key: 'order', label: 'Order', type: 'number' },
            ]}
        />
    )
}
