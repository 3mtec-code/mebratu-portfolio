'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import { AdminFormField, AdminInput } from '@/components/admin/AdminFormField'

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        logoUrl: '',
        faviconUrl: '',
        siteName: '',
        tagline: '',
        email: '',
        phone: '',
        location: '',
        cvUrl: '',
        startYear: '2006',
        onlineStatus: 'available',
    })

    useEffect(() => {
        fetch('/api/admin/settings').then(r => r.json()).then(data => {
            if (data) setForm({ ...form, ...data })
            setLoading(false)
        })
    }, [])

    const set = (key: string) => (v: string) => setForm(p => ({ ...p, [key]: v }))

    const handleSave = async () => {
        setSaving(true)
        setSaved(false)
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) setSaved(true)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving…' : 'Save Changes'}
                </button>
            </div>

            {saved && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl text-sm">
                    ✓ Settings saved successfully!
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                {/* Logo & Favicon */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <ImageUpload
                        label="Site Logo"
                        value={form.logoUrl}
                        onChange={set('logoUrl')}
                        aspectRatio="square"
                    />
                    <ImageUpload
                        label="Favicon (32×32 recommended)"
                        value={form.faviconUrl}
                        onChange={set('faviconUrl')}
                        aspectRatio="square"
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <AdminFormField label="Site Name" required>
                        <AdminInput value={form.siteName} onChange={e => set('siteName')(e.target.value)} placeholder="Mebratu Muhabaw" />
                    </AdminFormField>
                    <AdminFormField label="Tagline / Role" required>
                        <AdminInput value={form.tagline} onChange={e => set('tagline')(e.target.value)} placeholder="Software Engineer • UI/UX Designer" />
                    </AdminFormField>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <AdminFormField label="Email" required>
                        <AdminInput type="email" value={form.email} onChange={e => set('email')(e.target.value)} placeholder="you@example.com" />
                    </AdminFormField>
                    <AdminFormField label="Phone">
                        <AdminInput value={form.phone} onChange={e => set('phone')(e.target.value)} placeholder="+251 912 345 678" />
                    </AdminFormField>
                </div>

                <AdminFormField label="Location">
                    <AdminInput value={form.location} onChange={e => set('location')(e.target.value)} placeholder="Gondar, Ethiopia" />
                </AdminFormField>

                <AdminFormField label="CV / Resume URL" hint="Direct link to your CV PDF (e.g. Cloudinary or Google Drive)">
                    <AdminInput type="url" value={form.cvUrl} onChange={e => set('cvUrl')(e.target.value)} placeholder="https://..." />
                </AdminFormField>

                {/* ── Dynamic stats config ── */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Dynamic Stats &amp; Status</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <AdminFormField label="Career Start Year"
                            hint={`Years of Experience auto-calculated: ${new Date().getFullYear()} − ${form.startYear || 2006} = ${new Date().getFullYear() - Number(form.startYear || 2006)}+ years`}>
                            <AdminInput type="number" value={form.startYear}
                                onChange={e => set('startYear')(e.target.value)}
                                placeholder="2006" />
                        </AdminFormField>

                        <AdminFormField label="Online / Availability Status"
                            hint="Shows as a badge on the hero section and header">
                            <select value={form.onlineStatus}
                                onChange={e => setForm(p => ({ ...p, onlineStatus: e.target.value }))}
                                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors">
                                <option value="available">🟢 Available for work</option>
                                <option value="busy">🟡 Currently busy</option>
                                <option value="offline">⚫ Not available</option>
                            </select>
                        </AdminFormField>
                    </div>
                </div>
            </div>
        </div>
    )
}
