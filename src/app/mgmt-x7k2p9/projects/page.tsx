'use client'

import Image from 'next/image'
import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function ProjectsAdminPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/projects' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Projects" items={items as any[]} apiPath="/api/admin/projects" onRefresh={load}
            columns={[
                {
                    key: 'cover', label: 'Cover', render: (i: any) => {
                        const url = i.cover_image_url || i.coverImageUrl || ''
                        return url
                            ? <div className="relative w-14 h-10 rounded-lg overflow-hidden"><Image src={url} alt={i.title} fill className="object-cover" unoptimized={url.startsWith('/')} /></div>
                            : <div className="w-14 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-indigo-300 font-bold text-xs">{(i.title || '').charAt(0)}</div>
                    }
                },
                { key: 'title', label: 'Title' },
                { key: 'category', label: 'Category' },
                { key: 'featured', label: 'Featured', render: (i: any) => i.featured ? '⭐ Yes' : '—' },
            ]}
            fields={[
                { key: 'title', label: 'Project Title', type: 'text', required: true },
                { key: 'description', label: 'Short Description', type: 'textarea', required: true },
                { key: 'longDescription', label: 'Full Case Study', type: 'textarea' },
                {
                    key: 'category', label: 'Category', type: 'select', required: true,
                    options: [
                        { value: 'Web Apps', label: 'Web Apps' },
                        { value: 'Mobile Apps', label: 'Mobile Apps' },
                        { value: 'UI/UX', label: 'UI/UX' },
                        { value: 'AI', label: 'AI' },
                        { value: 'Full Stack', label: 'Full Stack' },
                    ]
                },
                { key: 'coverImageUrl', label: 'Cover Image URL', type: 'url', required: true },
                { key: 'tags', label: 'Tech Tags (comma-separated)', type: 'tags', placeholder: 'React, TypeScript' },
                { key: 'liveUrl', label: 'Live URL', type: 'url' },
                { key: 'githubUrl', label: 'GitHub URL', type: 'url' },
                { key: 'featured', label: 'Featured on homepage?', type: 'checkbox' },
                { key: 'order', label: 'Order', type: 'number' },
            ]}
        />
    )
}
