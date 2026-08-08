'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Type } from 'lucide-react'
import { AdminFormField, AdminInput, AdminTextarea } from '@/components/admin/AdminFormField'

const FIELDS = [
    {
        section: '🦸 Hero Section', fields: [
            { key: 'heroHeadline', label: 'Hero Headline', placeholder: 'I build intelligent, secure digital products.' },
            { key: 'heroSubtext', label: 'Hero Sub-text', placeholder: "Hi, I'm Mebratu…", textarea: true },
            { key: 'heroCta1', label: 'CTA Button 1', placeholder: 'Hire Me' },
            { key: 'heroCta2', label: 'CTA Button 2', placeholder: 'View My Work' },
            { key: 'followMeLabel', label: '"Follow me on" label', placeholder: 'Follow me on' },
        ]
    },
    {
        section: '📋 Section Titles', fields: [
            { key: 'featuredProjectsLabel', label: 'Projects Section Label', placeholder: 'MY WORK' },
            { key: 'featuredProjectsTitle', label: 'Projects Section Title', placeholder: 'Featured Projects' },
            { key: 'servicesLabel', label: 'Services Label', placeholder: 'WHAT I DO' },
            { key: 'servicesTitle', label: 'Services Title', placeholder: 'Services I Provide' },
            { key: 'timelineTitle', label: 'Timeline Section Title', placeholder: 'My Journey' },
            { key: 'skillsTitle', label: 'Skills Section Title', placeholder: 'Skills' },
            { key: 'videosTitle', label: 'Videos Section Title', placeholder: 'Latest Videos' },
            { key: 'techStackLabel', label: 'Tech Stack Label', placeholder: 'Tech Stack' },
            { key: 'techStackTitle', label: 'Tech Stack Title', placeholder: 'Technologies I Use' },
            { key: 'testimonialsTitle', label: 'Testimonials Title', placeholder: 'What People Say' },
            { key: 'awardsTitle', label: 'Awards Title', placeholder: 'Awards' },
            { key: 'certsTitle', label: 'Certificates Title', placeholder: 'Certificates' },
        ]
    },
    {
        section: '📬 Contact Section', fields: [
            { key: 'contactLabel', label: 'Contact Label', placeholder: "LET'S CONNECT" },
            { key: 'contactTitle', label: 'Contact Title', placeholder: 'Get In Touch' },
            { key: 'contactFormNamePh', label: 'Name Placeholder', placeholder: 'Your Name' },
            { key: 'contactFormEmailPh', label: 'Email Placeholder', placeholder: 'Your Email' },
            { key: 'contactFormSubjPh', label: 'Subject Placeholder', placeholder: 'Subject' },
            { key: 'contactFormMsgPh', label: 'Message Placeholder', placeholder: 'Your Message' },
            { key: 'contactFormBtn', label: 'Send Button Text', placeholder: 'Send Message' },
            { key: 'contactSuccessMsg', label: 'Success Message', placeholder: "✓ Message sent! I'll get back to you soon." },
            { key: 'contactErrorMsg', label: 'Error Message', placeholder: 'Something went wrong. Please try again.' },
        ]
    },
    {
        section: '⭐ Review Form', fields: [
            { key: 'reviewFormTitle', label: 'Review Form Title', placeholder: 'Leave a Review' },
            { key: 'reviewFormNamePh', label: 'Reviewer Name Placeholder', placeholder: 'Your Name' },
            { key: 'reviewFormRolePh', label: 'Role Placeholder', placeholder: 'Your Role / Company' },
            { key: 'reviewFormQuotePh', label: 'Quote Placeholder', placeholder: 'Share your experience…' },
            { key: 'reviewFormBtn', label: 'Submit Button Text', placeholder: 'Submit Review' },
            { key: 'reviewPendingMsg', label: 'Pending Message', placeholder: 'Thank you! Your review is pending approval.' },
        ]
    },
]

export default function SiteContentPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState<Record<string, string>>({})

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(r => r.json())
            .then(() => {
                // Load siteContent separately
                fetch('/api/admin/content')
                    .then(r => r.json())
                    .then(d => { if (d && typeof d === 'object') setForm(d); setLoading(false) })
                    .catch(() => setLoading(false))
            })
            .catch(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true); setSaved(false)
        await fetch('/api/admin/content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
        setSaving(false); setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Content</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Edit every text label and button on the site</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving…' : 'Save All'}
                </button>
            </div>

            {saved && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl text-sm">
                    ✓ Content saved! Changes are live on the site.
                </div>
            )}

            <div className="space-y-8">
                {FIELDS.map(({ section, fields }) => (
                    <div key={section} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-6">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
                            {section}
                        </h2>
                        <div className="space-y-4">
                            {fields.map(f => (
                                <AdminFormField key={f.key} label={f.label}>
                                    {f.textarea ? (
                                        <textarea
                                            value={form[f.key] || ''}
                                            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            placeholder={f.placeholder}
                                            rows={3}
                                            className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                                        />
                                    ) : (
                                        <AdminInput
                                            value={form[f.key] || ''}
                                            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            placeholder={f.placeholder}
                                        />
                                    )}
                                </AdminFormField>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
