'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, Link as LinkIcon, Trash2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    label?: string
    className?: string
    aspectRatio?: 'square' | 'video' | 'portrait' | 'cert'
    /** If true, removing an image also deletes it from Cloudinary */
    deleteOnRemove?: boolean
}

const ASPECT: Record<string, string> = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    cert: 'aspect-[4/3]',
}

export default function ImageUpload({
    value,
    onChange,
    label,
    className,
    aspectRatio = 'video',
    deleteOnRemove = true,
}: ImageUploadProps) {
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')
    const [showUrl, setShowUrl] = useState(false)
    const [urlInput, setUrlInput] = useState('')
    const [justUploaded, setJustUploaded] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // ── Upload file ──────────────────────────────────────────────────────────────
    const handleFile = async (file: File) => {
        setError('')
        setLoading(true)
        setJustUploaded(false)
        try {
            const fd = new FormData()
            fd.append('file', file)
            const res = await fetch('/api/upload', { method: 'POST', body: fd })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Upload failed')
            onChange(data.url)
            setJustUploaded(true)
            setTimeout(() => setJustUploaded(false), 2500)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Upload failed')
        } finally {
            setLoading(false)
        }
    }

    // ── Delete from Cloudinary and clear field ───────────────────────────────────
    const handleRemove = async () => {
        if (!value) return
        if (deleteOnRemove && value.includes('res.cloudinary.com')) {
            setDeleting(true)
            try {
                await fetch('/api/admin/delete-image', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: value }),
                })
            } catch {
                // non-fatal — still clear the field
            } finally {
                setDeleting(false)
            }
        }
        onChange('')
        setError('')
    }

    // ── Paste URL ────────────────────────────────────────────────────────────────
    const applyUrl = () => {
        const u = urlInput.trim()
        if (!u) return
        if (!u.startsWith('http') && !u.startsWith('/')) {
            setError('Please enter a valid URL (http:// or /)')
            return
        }
        onChange(u)
        setUrlInput('')
        setShowUrl(false)
        setError('')
    }

    const isCloudinary = value?.includes('res.cloudinary.com')

    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}

            {/* ── Drop zone ── */}
            <div
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => !loading && !deleting && !showUrl && !value && inputRef.current?.click()}
                className={cn(
                    'relative w-full rounded-2xl border-2 overflow-hidden transition-all',
                    ASPECT[aspectRatio],
                    value
                        ? 'border-transparent cursor-default'
                        : 'border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer bg-gray-50 dark:bg-gray-900'
                )}
            >
                {value ? (
                    <>
                        {/* Preview */}
                        <Image
                            src={value}
                            alt="Uploaded"
                            fill
                            className="object-cover"
                            unoptimized={!isCloudinary}
                        />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                            {/* Replace */}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-800 text-xs font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                Replace
                            </button>
                            {/* Remove */}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemove() }}
                                disabled={deleting}
                                className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 disabled:opacity-60 transition-colors"
                            >
                                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                {deleting ? 'Removing…' : 'Remove'}
                            </button>
                        </div>

                        {/* Cloudinary badge */}
                        {isCloudinary && (
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-black/60 rounded-full text-white text-xs">
                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                                Cloudinary
                            </div>
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                        {loading ? (
                            <>
                                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                <span className="text-sm text-gray-500">Uploading to Cloudinary…</span>
                            </>
                        ) : justUploaded ? (
                            <>
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                                <span className="text-sm text-green-600 font-medium">Uploaded!</span>
                            </>
                        ) : (
                            <>
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-950 rounded-2xl">
                                    <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Drop image here or click to upload
                                </span>
                                <span className="text-xs text-gray-400">JPG, PNG, WebP • Max 10 MB</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* ── URL fallback ── */}
            {!value && (
                <div>
                    {showUrl ? (
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
                                placeholder="https://example.com/image.jpg"
                                autoFocus
                                className="flex-1 px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors"
                            />
                            <button type="button" onClick={applyUrl}
                                className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                                Use
                            </button>
                            <button type="button" onClick={() => { setShowUrl(false); setError('') }}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setShowUrl(true)}
                            className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                            <LinkIcon className="w-3.5 h-3.5" />
                            Paste image URL instead
                        </button>
                    )}
                </div>
            )}

            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    ⚠ {error}
                </p>
            )}

            <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
        </div>
    )
}
