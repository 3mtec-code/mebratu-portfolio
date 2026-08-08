'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Clock, ArrowRight } from 'lucide-react'

interface SiteSettings {
    siteName: string
    tagline: string
    email: string
    phone: string
    location: string
}

interface AboutPanelProps {
    siteSettings?: SiteSettings
    bio?: string
    yearsExperience?: string
}

export default function AboutPanel({ siteSettings, bio, yearsExperience }: AboutPanelProps) {
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Building solutions{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        with passion.
                    </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    {bio || "I'm a developer, designer and problem solver. I love building digital products that solve real-world problems and create value."}
                </p>
                <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                    More About Me
                    <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Contact Details */}
                <div className="mt-8 space-y-3">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm">{siteSettings?.location || 'Gondar, Ethiopia'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        <a href={`mailto:${siteSettings?.email}`} className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            {siteSettings?.email || 'mebratu@example.com'}
                        </a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm">{siteSettings?.phone || '+251 912 345 678'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm">{yearsExperience || '30+'} Years of Experience</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
