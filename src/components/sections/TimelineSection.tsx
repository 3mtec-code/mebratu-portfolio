'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface TimelineEntry { id: string; year: string; title: string; description: string; order: number }

interface TimelineSectionProps {
    entries?: TimelineEntry[]
    showViewAll?: boolean
    sectionLabel?: string
    sectionTitle?: string
    /** Max items to show before "View Full Timeline" (default 4) */
    limit?: number
}

export default function TimelineSection({
    entries = [], showViewAll = true,
    sectionLabel = 'MY JOURNEY', sectionTitle = 'My Journey',
    limit = 4,
}: TimelineSectionProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })
    const sorted = [...entries].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    const visible = sorted.slice(0, limit)
    const hasMore = sorted.length > limit

    return (
        <div ref={ref}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-0.5">{sectionLabel}</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{sectionTitle}</h3>
                </div>
                {showViewAll && (
                    <Link href="/about#timeline"
                        className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline shrink-0">
                        View Full Timeline <ArrowUpRight className="w-4 h-4" />
                    </Link>
                )}
            </div>

            {/* Timeline */}
            <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-300 to-purple-300 dark:from-indigo-700 dark:to-purple-700" />

                <div className="space-y-5">
                    {visible.map((entry, i) => (
                        <motion.div key={entry.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="relative pl-9"
                        >
                            <div className="absolute left-1.5 top-2 w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 ring-2 ring-white dark:ring-gray-950 shadow-sm shadow-indigo-200 dark:shadow-indigo-900" />
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{entry.year}</span>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{entry.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{entry.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* "View Full Timeline" footer if truncated */}
                {hasMore && showViewAll && (
                    <div className="mt-5 pl-9">
                        <Link href="/about#timeline"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                            View {sorted.length - limit} more milestones <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
