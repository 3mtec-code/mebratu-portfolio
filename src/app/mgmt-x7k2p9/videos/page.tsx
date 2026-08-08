'use client'

import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function VideosPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/videos' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Videos" items={items as any[]} apiPath="/api/admin/videos" onRefresh={load}
            columns={[
                { key: 'title', label: 'Title' },
                { key: 'duration', label: 'Duration' },
                { key: 'video_url', label: 'URL', render: (i: any) => <span className="text-xs text-gray-500 truncate max-w-[180px] block">{i.video_url || i.videoUrl || ''}</span> },
            ]}
            fields={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'videoUrl', label: 'Video URL', type: 'url', required: true, hint: 'YouTube embed URL: https://www.youtube.com/embed/ID' },
                { key: 'thumbnailUrl', label: 'Thumbnail URL', type: 'url' },
                { key: 'duration', label: 'Duration', type: 'text', placeholder: '12:45' },
                { key: 'order', label: 'Order', type: 'number' },
            ]}
        />
    )
}
