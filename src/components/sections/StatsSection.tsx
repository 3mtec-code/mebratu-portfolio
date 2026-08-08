'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'

interface HeroStat {
    id: string
    label: string
    value: string
    order: number
}

interface StatsSectionProps {
    stats?: HeroStat[]
}

const defaultStats: HeroStat[] = [
    { id: '1', label: 'Years Experience', value: '30+', order: 0 },
    { id: '2', label: 'Projects Completed', value: '120+', order: 1 },
    { id: '3', label: 'Certificates', value: '55+', order: 2 },
    { id: '4', label: 'Awards Won', value: '15+', order: 3 },
    { id: '5', label: 'Client Satisfaction', value: '98%', order: 4 },
]

function parseStatValue(value: string): { number: number; suffix: string } {
    const match = value.match(/^(\d+)(.*)$/)
    if (match) {
        return { number: parseInt(match[1]), suffix: match[2] }
    }
    return { number: 0, suffix: value }
}

export default function StatsSection({ stats = defaultStats }: StatsSectionProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    const sortedStats = [...stats].sort((a, b) => a.order - b.order)

    return (
        <section ref={ref} className="py-16 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {sortedStats.map((stat, index) => {
                        const { number, suffix } = parseStatValue(stat.value)
                        return (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                    {isInView ? (
                                        <CountUp end={number} duration={2} suffix={suffix} />
                                    ) : (
                                        '0'
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
