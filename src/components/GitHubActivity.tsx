'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub } from 'react-icons/fa'
import { GitCommitHorizontal, Star, GitFork, ArrowUpRight } from 'lucide-react'

interface GitHubEvent {
    id: string
    type: string
    repo: { name: string; url: string }
    created_at: string
    payload: Record<string, unknown>
}

interface GitHubActivityProps {
    username: string
    maxEvents?: number
}

const EVENT_ICON: Record<string, string> = {
    PushEvent: '📌',
    CreateEvent: '🌿',
    WatchEvent: '⭐',
    ForkEvent: '🍴',
    IssuesEvent: '🐛',
    PullRequestEvent: '🔀',
    ReleaseEvent: '🚀',
    DeleteEvent: '🗑️',
}

const EVENT_LABEL: Record<string, string> = {
    PushEvent: 'Pushed to',
    CreateEvent: 'Created',
    WatchEvent: 'Starred',
    ForkEvent: 'Forked',
    IssuesEvent: 'Opened issue in',
    PullRequestEvent: 'Pull request in',
    ReleaseEvent: 'Released in',
    DeleteEvent: 'Deleted from',
}

function timeAgo(dateStr: string): string {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
    if (diff < 60) return `${Math.floor(diff)}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
}

export default function GitHubActivity({ username, maxEvents = 6 }: GitHubActivityProps) {
    const [events, setEvents] = useState<GitHubEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!username) { setLoading(false); return }
        fetch(`https://api.github.com/users/${username}/events/public?per_page=20`)
            .then(r => { if (!r.ok) throw new Error('Failed'); return r.json() })
            .then((data: GitHubEvent[]) => {
                setEvents(data.slice(0, maxEvents))
                setLoading(false)
            })
            .catch(() => { setError(true); setLoading(false) })
    }, [username, maxEvents])

    if (!username) return null

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <FaGithub className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">GitHub Activity</h3>
                </div>
                <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    @{username} <ArrowUpRight className="w-3 h-3" />
                </a>
            </div>

            {/* Events */}
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {loading && Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0" />
                        <div className="flex-1 space-y-1">
                            <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
                            <div className="h-2 w-1/3 bg-gray-50 dark:bg-gray-800/60 rounded" />
                        </div>
                    </div>
                ))}

                {error && (
                    <div className="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                        Could not load GitHub activity.
                    </div>
                )}

                {!loading && !error && events.length === 0 && (
                    <div className="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                        No recent public activity.
                    </div>
                )}

                {!loading && events.map((event, i) => {
                    const repoName = event.repo.name.split('/')[1] || event.repo.name
                    const icon = EVENT_ICON[event.type] || '📄'
                    const label = EVENT_LABEL[event.type] || 'Activity in'

                    return (
                        <motion.div key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <span className="text-base mt-0.5 shrink-0">{icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                                    <span className="text-gray-500 dark:text-gray-400">{label} </span>
                                    <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer"
                                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                                        {repoName}
                                    </a>
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    {timeAgo(event.created_at)}
                                </p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 text-center">
                <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                    View all activity on GitHub →
                </a>
            </div>
        </div>
    )
}
