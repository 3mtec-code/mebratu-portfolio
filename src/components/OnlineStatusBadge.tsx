'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Status = 'available' | 'busy' | 'offline'

const DOT: Record<Status, string> = {
    available: 'bg-green-500',
    busy: 'bg-amber-500',
    offline: 'bg-gray-400',
}

const BADGE: Record<Status, string> = {
    available: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
    busy: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400',
    offline: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400',
}

const LABELS: Record<Status, string> = {
    available: 'Available for new opportunities',
    busy: 'Currently busy',
    offline: 'Not available right now',
}

export default function OnlineStatusBadge({ initialStatus = 'available' }: { initialStatus?: Status }) {
    const [status, setStatus] = useState<Status>(initialStatus)

    useEffect(() => {
        const refresh = () =>
            fetch('/api/admin/status', { cache: 'no-store' })
                .then(r => r.json())
                .then(d => { if (d.onlineStatus) setStatus(d.onlineStatus as Status) })
                .catch(() => { })
        refresh()
        const id = setInterval(refresh, 60_000)
        return () => clearInterval(id)
    }, [])

    return (
        <span className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium', BADGE[status])}>
            <span className={cn('w-2 h-2 rounded-full', DOT[status], status === 'available' && 'animate-pulse')} />
            {LABELS[status]}
        </span>
    )
}
