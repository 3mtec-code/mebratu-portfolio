import type { Metadata } from 'next'
import Image from 'next/image'
import { readStore } from '@/lib/store'
import { buildMetadata } from '@/lib/seo'
import SkillsSection from '@/components/sections/SkillsSection'
import TimelineSection from '@/components/sections/TimelineSection'

export const metadata: Metadata = buildMetadata({
    title: 'About — Mebratu Muhabaw',
    description: 'Mebratu Muhabaw — Full Stack Software Engineer, Cybersecurity Specialist and UI/UX Designer based in Gondar, Ethiopia.',
    path: '/about',
    keywords: ['About', 'Full Stack', 'AI', 'Cybersecurity', 'Software Engineer', 'UI/UX', 'Ethiopia'],
})

// ISR: rebuild cached page every hour; admin saves bust this immediately via revalidatePath()
export const revalidate = 3600

export default function AboutPage() {
    const store = readStore()
    const settings = store.siteSettings as Record<string, string>
    const heroProfile = store.heroProfile as Record<string, string>
    const skills = store.skills as Record<string, unknown>[]
    const timeline = store.timeline as Record<string, unknown>[]

    const photoUrl = heroProfile?.aboutImageUrl || heroProfile?.about_image_url
        || heroProfile?.heroImageUrl || heroProfile?.hero_image_url
        || ''

    const email = settings?.email || 'mebratu@example.com'
    const phone = settings?.phone || '+251 912 345 678'
    const location = settings?.location || 'Gondar, Ethiopia'

    return (
        <div className="pt-20">

            {/* ── Hero ── */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-14 items-center">

                        {/* Photo */}
                        <div className="flex justify-center">
                            <div className="relative w-64 h-80 lg:w-80 lg:h-96 rounded-3xl overflow-hidden
                              ring-4 ring-indigo-100 dark:ring-indigo-900
                              shadow-2xl shadow-indigo-100 dark:shadow-indigo-950">
                                {photoUrl ? (
                                    <Image
                                        src={photoUrl}
                                        alt={settings?.siteName || 'Mebratu Muhabaw'}
                                        fill
                                        className="object-cover object-top"
                                        unoptimized={photoUrl.startsWith('/')}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                                        <span className="text-6xl font-bold text-indigo-300 dark:text-indigo-700">M</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
                                ABOUT ME
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                Building solutions{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                    with passion.
                                </span>
                            </h1>

                            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                                <p>
                                    I&apos;m Mebratu Muhabaw — a <strong className="text-gray-800 dark:text-gray-200">Full Stack Software Engineer</strong>,{' '}
                                    <strong className="text-gray-800 dark:text-gray-200">Cybersecurity Specialist</strong>, and{' '}
                                    <strong className="text-gray-800 dark:text-gray-200">UI/UX Designer</strong> based in {location}.
                                    With extensive experience across web, mobile, and secure systems, I&apos;ve dedicated my career to
                                    building digital products that solve real-world problems — from scalable applications to AI-powered tools.
                                </p>
                                <p>
                                    My expertise spans <span className="text-indigo-600 dark:text-indigo-400 font-medium">AI-powered application development</span>,{' '}
                                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">secure system architecture</span>, and{' '}
                                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">cybersecurity</span> across
                                    Windows &amp; Linux (Ubuntu) environments — combining clean code with pixel-perfect design.
                                </p>
                            </div>

                            {/* Keyword badges */}
                            <div className="flex flex-wrap gap-2 mt-5">
                                {['Full Stack', 'AI/ML', 'Cybersecurity', 'React', 'Next.js', 'Linux', 'UI/UX'].map(tag => (
                                    <span key={tag}
                                        className="px-3 py-1 text-xs font-semibold rounded-full
                               bg-indigo-50 dark:bg-indigo-950
                               text-indigo-600 dark:text-indigo-400
                               border border-indigo-100 dark:border-indigo-900">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Contact info — fixed layout, no overlap */}
                            <div className="mt-7 space-y-3">
                                {/* Email — full width row */}
                                <div className="flex items-baseline gap-3">
                                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-20 shrink-0">Email</span>
                                    <a href={`mailto:${email}`}
                                        className="text-sm text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors break-all">
                                        {email}
                                    </a>
                                </div>
                                {/* Phone — full width row */}
                                <div className="flex items-baseline gap-3">
                                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-20 shrink-0">Phone</span>
                                    <span className="text-sm text-gray-800 dark:text-gray-200">{phone}</span>
                                </div>
                                {/* Location — full width row */}
                                <div className="flex items-baseline gap-3">
                                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-20 shrink-0">Location</span>
                                    <span className="text-sm text-gray-800 dark:text-gray-200">{location}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── Skills ── */}
            <section id="skills" className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
                    <div className="text-center mb-10">
                        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">MY EXPERTISE</p>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Skills &amp; Technologies</h2>
                    </div>
                    <SkillsSection skills={skills as any} limit={12} sectionTitle="" />
                </div>
            </section>

            {/* ── Timeline ── */}
            <section id="timeline" className="py-16 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
                    <div className="text-center mb-10">
                        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">MY JOURNEY</p>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Experience &amp; Education</h2>
                    </div>
                    <TimelineSection entries={timeline as any} showViewAll={false} limit={999} sectionTitle="" />
                </div>
            </section>

        </div>
    )
}
