'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column<T> {
    key: keyof T | string
    label: string
    render?: (item: T) => React.ReactNode
}

interface Field {
    key: string
    label: string
    type: 'text' | 'textarea' | 'number' | 'url' | 'email' | 'date' | 'select' | 'checkbox' | 'tags'
    required?: boolean
    options?: { value: string; label: string }[]
    placeholder?: string
    hint?: string
}

interface AdminCrudPageProps<T extends { id: string }> {
    title: string
    items: T[]
    columns: Column<T>[]
    fields: Field[]
    apiPath: string
    onRefresh: () => void
    emptyMessage?: string
    dateFields?: string[]
}

export default function AdminCrudPage<T extends { id: string }>({
    title,
    items,
    columns,
    fields,
    apiPath,
    onRefresh,
    emptyMessage = 'No items yet.',
    dateFields = [],
}: AdminCrudPageProps<T>) {
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<T | null>(null)
    const [form, setForm] = useState<Record<string, any>>({})
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [error, setError] = useState('')

    const openCreate = () => {
        setEditing(null)
        const defaults: Record<string, any> = {}
        fields.forEach((f) => {
            if (f.type === 'checkbox') defaults[f.key] = false
            else if (f.type === 'number') defaults[f.key] = 0
            else if (f.type === 'tags') defaults[f.key] = []
            else defaults[f.key] = ''
        })
        setForm(defaults)
        setError('')
        setShowForm(true)
    }

    const openEdit = (item: T) => {
        setEditing(item)
        const vals: Record<string, any> = {}
        fields.forEach((f) => {
            const val = (item as any)[f.key]
            if (f.type === 'date' && val) {
                vals[f.key] = new Date(val).toISOString().split('T')[0]
            } else if (f.type === 'tags' && Array.isArray(val)) {
                vals[f.key] = val.join(', ')
            } else {
                vals[f.key] = val ?? ''
            }
        })
        setForm(vals)
        setError('')
        setShowForm(true)
    }

    const handleSave = async () => {
        setSaving(true)
        setError('')
        try {
            const payload: Record<string, any> = { ...form }

            // Convert tags string → array
            fields.forEach((f) => {
                if (f.type === 'tags' && typeof payload[f.key] === 'string') {
                    payload[f.key] = payload[f.key]
                        .split(',')
                        .map((t: string) => t.trim())
                        .filter(Boolean)
                }
                if (f.type === 'number') payload[f.key] = Number(payload[f.key])
            })

            const url = editing ? `${apiPath}/${editing.id}` : apiPath
            const method = editing ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Save failed')
            }

            setShowForm(false)
            onRefresh()
        } catch (e: any) {
            setError(e.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item? This cannot be undone.')) return
        setDeleting(id)
        try {
            await fetch(`${apiPath}/${id}`, { method: 'DELETE' })
            onRefresh()
        } finally {
            setDeleting(null)
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {items.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">{emptyMessage}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    {columns.map((col) => (
                                        <th
                                            key={String(col.key)}
                                            className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => (
                                    <tr
                                        key={item.id}
                                        className={cn(
                                            'border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors',
                                            i === items.length - 1 && 'border-b-0'
                                        )}
                                    >
                                        {columns.map((col) => (
                                            <td key={String(col.key)} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="p-1.5 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={deleting === item.id}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {deleting === item.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 20 }}
                            className="fixed inset-x-4 top-8 bottom-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        >
                            {/* Modal header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="font-semibold text-gray-900 dark:text-white">
                                    {editing ? 'Edit' : 'Add New'} {title.replace(/s$/, '')}
                                </h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {error && (
                                    <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        {error}
                                    </div>
                                )}

                                {fields.map((field) => (
                                    <div key={field.key} className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>

                                        {field.type === 'textarea' ? (
                                            <textarea
                                                value={form[field.key] ?? ''}
                                                onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                                                placeholder={field.placeholder}
                                                rows={4}
                                                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors resize-y"
                                            />
                                        ) : field.type === 'checkbox' ? (
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!!form[field.key]}
                                                    onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.checked }))}
                                                    className="w-4 h-4 rounded accent-primary-600"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{field.placeholder || 'Enabled'}</span>
                                            </label>
                                        ) : field.type === 'select' ? (
                                            <select
                                                value={form[field.key] ?? ''}
                                                onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                                                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                                            >
                                                <option value="">Select…</option>
                                                {field.options?.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={field.type}
                                                value={form[field.key] ?? ''}
                                                onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                                                placeholder={field.placeholder}
                                                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                                            />
                                        )}

                                        {field.hint && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500">{field.hint}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Modal footer */}
                            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {saving ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
