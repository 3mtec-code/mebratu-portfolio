'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseCrudOptions<T> {
    apiPath: string
}

export function useCrud<T extends { id: string }>({ apiPath }: UseCrudOptions<T>) {
    const [items, setItems] = useState<T[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [error, setError] = useState('')

    const load = useCallback(() => {
        setLoading(true)
        setError('')
        fetch(apiPath)
            .then(r => r.json())
            .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
            .catch(e => { setError(e.message); setLoading(false) })
    }, [apiPath])

    useEffect(() => { load() }, [load])

    const create = async (data: Record<string, unknown>): Promise<boolean> => {
        setSaving(true)
        setError('')
        try {
            const res = await fetch(apiPath, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Create failed') }
            load()
            return true
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Create failed')
            return false
        } finally { setSaving(false) }
    }

    const update = async (id: string, data: Record<string, unknown>): Promise<boolean> => {
        setSaving(true)
        setError('')
        try {
            const res = await fetch(`${apiPath}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Update failed') }
            load()
            return true
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Update failed')
            return false
        } finally { setSaving(false) }
    }

    const remove = async (id: string): Promise<boolean> => {
        if (!confirm('Delete this item? This cannot be undone.')) return false
        setDeleting(id)
        try {
            await fetch(`${apiPath}/${id}`, { method: 'DELETE' })
            load()
            return true
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Delete failed')
            return false
        } finally { setDeleting(null) }
    }

    return { items, loading, saving, deleting, error, load, create, update, remove }
}
