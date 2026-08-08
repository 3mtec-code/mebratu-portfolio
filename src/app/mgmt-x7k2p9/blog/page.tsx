'use client'

import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function BlogAdminPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/blog' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Blog Posts" items={items as any[]} apiPath="/api/admin/blog" onRefresh={load}
            columns={[
                { key: 'title', label: 'Title' },
                { key: 'slug', label: 'Slug' },
                {
                    key: 'published', label: 'Status', render: (i: any) => i.published
                        ? <span className="text-green-600 text-xs font-semibold">✅ Published</span>
                        : <span className="text-gray-400 text-xs">Draft</span>
                },
                { key: 'tags', label: 'Tags', render: (i: any) => (Array.isArray(i.tags) ? i.tags : []).join(', ') },
            ]}
            fields={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'slug', label: 'Slug (auto if empty)', type: 'text', hint: 'URL-friendly, e.g. my-post-title' },
                { key: 'excerpt', label: 'Excerpt / Summary', type: 'textarea', required: true },
                { key: 'content', label: 'Content (HTML)', type: 'textarea', required: true },
                { key: 'coverImageUrl', label: 'Cover Image URL', type: 'url' },
                { key: 'tags', label: 'Tags (comma-separated)', type: 'tags', placeholder: 'React, Tutorial' },
                { key: 'author', label: 'Author', type: 'text', placeholder: 'Mebratu Muhabaw' },
                { key: 'published', label: 'Publish now?', type: 'checkbox', placeholder: 'Make visible on site' },
            ]}
        />
    )
}
