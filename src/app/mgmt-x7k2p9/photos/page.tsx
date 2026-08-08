'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'

export default function PhotosPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [heroImageUrl, setHeroImageUrl] = useState('')
    const [aboutImageUrl, setAboutImageUrl] = useState('')

    useEffect(() => {
        fetch('/api/admin/photos').then(r => r.json()).then(data => {
            if (data) {
                setHeroImageUrl(data.heroImageUrl || '')
                setAboutImageUrl(data.aboutImageUrl || '')
            }
            setLoading(false)
        })
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setSaved(false)
        try {
            const res = await fetch('/api/admin/photos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ heroImageUrl, aboutImageUrl }),
            })
            if (res.ok) setSaved(true)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary-600" /></div>

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Photos</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-60 transition-colors"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving…' : 'Save Photos'}
                </button>
            </div>

            {saved && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl text-sm">
                    ✓ Photos updated successfully!
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="grid sm:grid-cols-2 gap-8">
                    <ImageUpload
                        label="Hero / Home Page Portrait"
                        value={heroImageUrl}
                        onChange={setHeroImageUrl}
                        aspectRatio="portrait"
                    />
                    <ImageUpload
                        label="About Page Profile Photo"
                        value={aboutImageUrl}
                        onChange={setAboutImageUrl}
                        aspectRatio="portrait"
                    />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                    Recommended: portrait photos, min 400×500px. Supported formats: JPG, PNG, WebP.
                </p>
            </div>
        </div>
    )
}
