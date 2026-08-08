'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Clock, ArrowUpRight } from 'lucide-react'

interface Video {
    id: string
    title: string
    description?: string | null
    videoUrl: string
    thumbnailUrl?: string | null
    duration?: string | null
    order: number
}

interface VideosSectionProps {
    sectionTitle?: string
    videos?: Video[]
    limit?: number
}

export default function VideosSection({ videos = [], limit, sectionTitle = 'Latest Videos' }: VideosSectionProps) {
    const sorted = [...videos].sort((a, b) => a.order - b.order)
    const displayed = limit ? sorted.slice(0, limit) : sorted

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Latest Videos</p>
                </div>
                <Link href="/videos" className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All Videos
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-3">
                {displayed.map((video, index) => (
                    <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                    >
                        <Link
                            href={`/videos#${video.id}`}
                            className="flex gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md shadow-sm transition-all group"
                        >
                            {/* Thumbnail */}
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0">
                                {video.thumbnailUrl ? (
                                    <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="p-1.5 bg-white/90 rounded-full">
                                        <Play className="w-3 h-3 text-indigo-600 fill-indigo-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {video.title}
                                </h4>
                                {video.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{video.description}</p>
                                )}
                            </div>

                            {/* Duration */}
                            {video.duration && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                    <Clock className="w-3 h-3" />
                                    {video.duration}
                                </div>
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
