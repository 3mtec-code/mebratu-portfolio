import { Metadata } from 'next'
import Link from 'next/link'
import { getAllData } from '@/lib/dal'
import {
    Briefcase, Award, Video, MessageSquare, Settings,
    FileText, BarChart3, Share2, Trophy, ArrowUpRight,
    User, Clock, Wrench, Star,
} from 'lucide-react'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

const ADMIN = '/mgmt-x7k2p9'

const sections = [
    { label: 'Projects', key: 'projects', href: `${ADMIN}/projects`, icon: Briefcase, color: 'from-blue-500 to-cyan-400' },
    { label: 'Certificates', key: 'certificates', href: `${ADMIN}/certificates`, icon: Award, color: 'from-purple-500 to-pink-400' },
    { label: 'Awards', key: 'awards', href: `${ADMIN}/awards`, icon: Trophy, color: 'from-amber-500 to-orange-400' },
    { label: 'Testimonials', key: 'testimonials', href: `${ADMIN}/testimonials`, icon: MessageSquare, color: 'from-green-500 to-teal-400' },
    { label: 'Pending Reviews', key: 'pendingReviews', href: `${ADMIN}/reviews`, icon: Star, color: 'from-rose-500 to-pink-400' },
    { label: 'Videos', key: 'videos', href: `${ADMIN}/videos`, icon: Video, color: 'from-red-500 to-rose-400' },
    { label: 'Skills', key: 'skills', href: `${ADMIN}/skills`, icon: BarChart3, color: 'from-indigo-500 to-blue-400' },
    { label: 'Blog Posts', key: 'blogPosts', href: `${ADMIN}/blog`, icon: FileText, color: 'from-teal-500 to-cyan-400' },
    { label: 'Social Links', key: 'socialLinks', href: `${ADMIN}/social`, icon: Share2, color: 'from-violet-500 to-purple-400' },
]

const quickLinks = [
    { label: 'Site Settings', desc: 'Logo, name, email, status', href: `${ADMIN}/settings`, icon: Settings, iconColor: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' },
    { label: 'Profile Photos', desc: 'Hero & about photos', href: `${ADMIN}/photos`, icon: User, iconColor: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950' },
    { label: 'Timeline', desc: 'Career milestones', href: `${ADMIN}/timeline`, icon: Clock, iconColor: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950' },
    { label: 'Services', desc: 'Service cards', href: `${ADMIN}/services`, icon: Wrench, iconColor: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950' },
]

export default async function AdminDashboard() {
    // ✅ Reads directly from Supabase via DAL
    const store = await getAllData()

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                    All numbers are live from Supabase PostgreSQL.
                </p>
            </div>

            {/* Live counts from Supabase */}
            <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Content</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {sections.map((s) => {
                        const Icon = s.icon
                        const list = (store[s.key as keyof typeof store] as unknown[]) ?? []
                        const count = list.length
                        return (
                            <Link key={s.href} href={s.href}
                                className="group p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${s.color} mb-3`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
                                <div className="flex items-center gap-1 mt-2 text-xs text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Manage <ArrowUpRight className="w-3 h-3" />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Quick Actions</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickLinks.map((q) => {
                        const Icon = q.icon
                        return (
                            <Link key={q.href} href={q.href}
                                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                                <div className={`p-2.5 rounded-xl ${q.bg} shrink-0`}>
                                    <Icon className={`w-4 h-4 ${q.iconColor}`} />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">{q.label}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{q.desc}</div>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors ml-auto shrink-0" />
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* View Live Site */}
            <Link href="/" target="_blank"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl border border-indigo-100 dark:border-indigo-900 hover:shadow-md transition-all group">
                <div>
                    <p className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm">View Live Site</p>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5">Open your portfolio in a new tab</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
            </Link>
        </div>
    )
}
