'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Palette, Code2, Lightbulb } from 'lucide-react'
import SocialIcon from '@/components/SocialIcon'
import OnlineStatusBadge from '@/components/OnlineStatusBadge'

interface InfoCard { id: string; title: string; description: string; icon: string }
interface SocialLink { id: string; platform: string; url: string; icon: string }

interface HeroSectionProps {
    heroImageUrl?: string
    infoCards?: InfoCard[]
    socialLinks?: SocialLink[]
    onlineStatus?: string
    heroHeadline?: string
    heroSubtext?: string
    heroCta1?: string
    heroCta2?: string
    followMeLabel?: string
}

const DEFAULT_CARDS: InfoCard[] = [
    { id: '1', title: 'UI/UX Designer', description: 'Designing delightful user experiences', icon: 'palette' },
    { id: '2', title: 'Full Stack Developer', description: 'Building scalable web applications', icon: 'code' },
    { id: '3', title: 'Problem Solver', description: 'Turning ideas into real solutions', icon: 'zap' },
    { id: '4', title: 'Available for new projects', description: 'Open to opportunities', icon: 'check' },
]

function CardIcon({ title }: { title: string }) {
    const t = title.toLowerCase()
    if (t.includes('ui') || t.includes('design'))
        return <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shrink-0"><Palette className="w-4 h-4 text-white" /></div>
    if (t.includes('full') || t.includes('stack') || t.includes('dev'))
        return <div className="p-2 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 shrink-0"><Code2 className="w-4 h-4 text-white" /></div>
    if (t.includes('problem') || t.includes('solv'))
        return <div className="p-2 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 shrink-0"><Lightbulb className="w-4 h-4 text-white" /></div>
    return <span className="w-3 h-3 rounded-full bg-green-400 shrink-0 animate-pulse mt-1" />
}

export default function HeroSection({
    heroImageUrl,
    infoCards = DEFAULT_CARDS,
    socialLinks = [],
    onlineStatus = 'available',
    heroHeadline = 'I build digital products that make impact.',
    heroSubtext = "Hi, I'm Mebratu - a Full Stack Software Developer specializing in AI-powered applications, secure system architecture, and cybersecurity across Windows & Linux (Ubuntu) environments.",
    heroCta1 = 'Hire Me',
    heroCta2 = 'View My Work',
    followMeLabel = 'Follow me on',
}: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white dark:bg-gray-950">

            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950/60 dark:to-purple-950/60 opacity-80 blur-3xl" />
                <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950/40 dark:to-cyan-950/40 opacity-60 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* ── Left ── */}
                    <div className="space-y-8 order-2 lg:order-1">

                        {/* Dynamic online status badge */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <OnlineStatusBadge initialStatus={onlineStatus as 'available' | 'busy' | 'offline'} />
                        </motion.div>

                        {/* Headline — dynamic */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
                        >
                            {heroHeadline.includes('make impact') ? (
                                <>
                                    {heroHeadline.replace('make impact.', '')}
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500">
                                        make impact.
                                    </span>
                                </>
                            ) : (
                                <>
                                    {heroHeadline.split(' ').slice(0, -2).join(' ')}{' '}
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500">
                                        {heroHeadline.split(' ').slice(-2).join(' ')}
                                    </span>
                                </>
                            )}
                        </motion.h1>

                        {/* Subtext — dynamic */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed"
                        >
                            {heroSubtext}
                        </motion.p>

                        {/* CTA buttons — dynamic labels */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all">
                                {heroCta1} <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/projects"
                                className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-full font-semibold hover:border-indigo-600 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-all">
                                {heroCta2} <ChevronRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        {/* Social links */}
                        {socialLinks.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">{followMeLabel}</p>
                                <div className="flex items-center gap-3">
                                    {socialLinks.map((link) => (
                                        <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                                            aria-label={link.platform}>
                                            <SocialIcon icon={link.icon} />
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* ── Right: photo + info cards ── */}
                    <div className="order-1 lg:order-2 flex items-center justify-center gap-5 lg:gap-8">

                        {/* Portrait */}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative shrink-0">
                            <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-indigo-400/50 via-purple-500/40 to-teal-400/30 dark:from-indigo-400/60 dark:via-purple-500/50 dark:to-teal-400/40 blur-2xl" />
                            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-indigo-300/30 to-purple-400/20 dark:from-indigo-300/40 dark:to-purple-400/30 blur-lg" />
                            <div className="relative w-56 h-72 sm:w-60 sm:h-80 lg:w-64 lg:h-[340px] z-10 rounded-3xl overflow-hidden ring-2 ring-indigo-400/40 dark:ring-indigo-400/60 shadow-[0_0_40px_rgba(99,102,241,0.35)] dark:shadow-[0_0_60px_rgba(99,102,241,0.5)]">
                                {heroImageUrl ? (
                                    <Image src={heroImageUrl} alt="Profile" fill className="object-cover object-top" priority unoptimized={heroImageUrl.startsWith('/')} />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                                        <span className="text-7xl font-bold text-white/50 select-none">M</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Info cards — vertical */}
                        <div className="flex flex-col gap-3 z-10">
                            {infoCards.slice(0, 4).map((card, i) => (
                                <motion.div key={card.id}
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                                    className="flex items-start gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg shadow-gray-200/60 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 min-w-[155px] max-w-[195px] hover:-translate-y-0.5 transition-transform">
                                    <CardIcon title={card.title} />
                                    <div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{card.title}</p>
                                        {card.description && <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{card.description}</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
