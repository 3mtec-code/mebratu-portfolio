'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trophy, ArrowUpRight } from 'lucide-react'

interface Award {
    id: string
    title: string
    issuer: string
    issueDate: string
    description?: string | null
    imageUrl?: string | null
}

interface AwardsPreviewProps {
    sectionTitle?: string
    awards?: Award[]
}

export default function AwardsPreview({ awards = [], sectionTitle = 'Awards' }: AwardsPreviewProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Awards</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Awards</h3>
                </div>
                <Link href="/certificates#awards" className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-4">
                {awards.length > 0 ? (
                    awards.map((award, index) => (
                        <motion.div
                            key={award.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md"
                        >
                            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 shrink-0">
                                <Trophy className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{award.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{award.issuer}</p>
                                {award.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{award.description}</p>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <Trophy className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No awards yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}
