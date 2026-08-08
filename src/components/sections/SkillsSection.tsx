'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface Skill { id: string; name: string; percentage: number; category?: string | null; order: number }

interface SkillsSectionProps {
    skills?: Skill[]
    sectionTitle?: string
    /** Max skills to show (default 6) */
    limit?: number
}

const COLORS: Record<string, string> = {
    'React': 'from-cyan-400 to-blue-500',
    'Next.js': 'from-gray-600 to-gray-900',
    'TypeScript': 'from-blue-400 to-blue-700',
    'Node.js': 'from-green-400 to-green-700',
    'Tailwind CSS': 'from-teal-400 to-cyan-500',
    'Python': 'from-yellow-400 to-yellow-600',
    'PostgreSQL': 'from-blue-500 to-indigo-700',
    'MongoDB': 'from-green-500 to-green-800',
    'Cybersecurity': 'from-red-500 to-rose-700',
    'Linux/Ubuntu': 'from-orange-500 to-amber-600',
    'Docker': 'from-blue-400 to-cyan-600',
    'AI/ML': 'from-purple-500 to-indigo-600',
}

export default function SkillsSection({ skills = [], sectionTitle = 'Skills', limit = 6 }: SkillsSectionProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })
    const sorted = [...skills].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    const visible = sorted.slice(0, limit)
    const hasMore = sorted.length > limit

    return (
        <div ref={ref}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-0.5">EXPERTISE</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{sectionTitle}</h3>
                </div>
                <Link href="/about#skills"
                    className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline shrink-0">
                    View All Skills <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-3.5">
                {visible.map((skill, i) => (
                    <motion.div key={skill.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: i * 0.07 }}
                    >
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{skill.name}</span>
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{skill.percentage}%</span>
                        </div>
                        {/* Progress bar track */}
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={isInView ? { width: `${skill.percentage}%` } : { width: 0 }}
                                transition={{ duration: 1, delay: 0.2 + i * 0.07, ease: 'easeOut' }}
                                className={`h-full rounded-full bg-gradient-to-r ${COLORS[skill.name] ?? 'from-indigo-500 to-purple-500'}`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {hasMore && (
                <div className="mt-4">
                    <Link href="/about#skills"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                        View all {sorted.length} skills <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    )
}
