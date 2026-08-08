'use client'

import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function SkillsPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/skills' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Skills" items={items as any[]} apiPath="/api/admin/skills" onRefresh={load}
            columns={[
                { key: 'name', label: 'Skill' },
                { key: 'percentage', label: '%', render: (i: any) => `${i.percentage}%` },
                { key: 'category', label: 'Category' },
                { key: 'order', label: 'Order' },
            ]}
            fields={[
                { key: 'name', label: 'Skill Name', type: 'text', required: true, placeholder: 'React' },
                { key: 'percentage', label: 'Percentage (0–100)', type: 'number', required: true },
                {
                    key: 'category', label: 'Category', type: 'select', options: [
                        { value: 'Frontend', label: 'Frontend' },
                        { value: 'Backend', label: 'Backend' },
                        { value: 'Database', label: 'Database' },
                        { value: 'Language', label: 'Language' },
                        { value: 'Design', label: 'Design' },
                        { value: 'DevOps', label: 'DevOps' },
                    ]
                },
                { key: 'order', label: 'Order', type: 'number' },
            ]}
        />
    )
}
