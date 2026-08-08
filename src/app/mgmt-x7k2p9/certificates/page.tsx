'use client'

import Image from 'next/image'
import { useCrud } from '@/hooks/useCrud'
import AdminCrudPage from '@/components/admin/AdminCrudPage'
import { Loader2 } from 'lucide-react'

export default function CertificatesPage() {
    const { items, loading, load } = useCrud({ apiPath: '/api/admin/certificates' })
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
    return (
        <AdminCrudPage title="Certificates" items={items as any[]} apiPath="/api/admin/certificates" onRefresh={load}
            columns={[
                {
                    key: 'certificate_image_url', label: 'Image', render: (i: any) => {
                        const url = i.certificate_image_url || i.certificateImageUrl || ''
                        return url ? <div className="relative w-14 h-10 rounded-lg overflow-hidden"><Image src={url} alt={i.title} fill className="object-cover" unoptimized={url.startsWith('/')} /></div> : <div className="w-14 h-10 bg-gray-100 rounded-lg" />
                    }
                },
                { key: 'title', label: 'Title' },
                { key: 'issuer', label: 'Issuer' },
                {
                    key: 'issue_date', label: 'Date', render: (i: any) => {
                        const d = i.issue_date || i.issueDate
                        return d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''
                    }
                },
                {
                    key: 'verification_url', label: 'Verify Link', render: (i: any) => {
                        const u = i.verification_url || i.verificationUrl
                        return u ? <span className="text-green-600 text-xs">✓ Set</span> : <span className="text-red-400 text-xs">✗ Missing</span>
                    }
                },
            ]}
            fields={[
                { key: 'title', label: 'Certificate Title', type: 'text', required: true },
                { key: 'issuer', label: 'Issuer', type: 'text', required: true },
                { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
                { key: 'certificateImageUrl', label: 'Certificate Image URL', type: 'url', required: true },
                { key: 'verificationUrl', label: 'Verification URL', type: 'url', required: true, hint: 'Must always be a valid link' },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'order', label: 'Order', type: 'number' },
            ]}
        />
    )
}
