'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Code2, Palette, Smartphone, Brain, Megaphone, BarChart3 } from 'lucide-react'

interface Service {
    id: string
    title: string
    description: string
    icon: string
    order: number
}

interface ServicesSectionProps {
    sectionLabel?: string
    sectionTitle?: string
    services?: Service[]
}

const iconMap: Record<string, React.ReactNode> = {
    code: <Code2 className="w-6 h-6" />,
    palette: <Palette className="w-6 h-6" />,
    smartphone: <Smartphone className="w-6 h-6" />,
    brain: <Brain className="w-6 h-6" />,
    megaphone: <Megaphone className="w-6 h-6" />,
    barchart: <BarChart3 className="w-6 h-6" />,
}

const gradients = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-400',
    'from-orange-500 to-amber-400',
    'from-green-500 to-teal-400',
    'from-red-500 to-rose-400',
    'from-indigo-500 to-blue-400',
]

export default function ServicesSection({ services = [], sectionLabel = 'WHAT I DO', sectionTitle = 'Services I Provide' }: ServicesSectionProps) {
    const sorted = [...services].sort((a, b) => a.order - b.order)

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">WHAT I DO</p>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{sectionTitle}</h2>
                    </div>
                    <Link href="/contact" className="hidden md:flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                        View All Services
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sorted.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300"
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} mb-4`}>
                                <div className="text-white">
                                    {iconMap[service.icon.toLowerCase()] || <Code2 className="w-6 h-6" />}
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>

                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Explore
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
