'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard, Briefcase, Award, Video, MessageSquare,
    Settings, User, Wrench, FileText, Clock, BarChart3,
    Share2, LogOut, Menu, X, Trophy, Star, Globe,
    Navigation, Layers, Type,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const P = '/mgmt-x7k2p9'

const NAV_GROUPS = [
    {
        label: 'General',
        items: [
            { label: 'Dashboard', href: P, icon: LayoutDashboard },
            { label: 'Site Settings', href: `${P}/settings`, icon: Settings },
            { label: 'Site Content', href: `${P}/content`, icon: Type },
            { label: 'Profile Photos', href: `${P}/photos`, icon: User },
        ],
    },
    {
        label: 'Hero & Navigation',
        items: [
            { label: 'Hero Info Cards', href: `${P}/info-cards`, icon: Layers },
            { label: 'Hero Stats', href: `${P}/stats`, icon: BarChart3 },
            { label: 'Nav Links', href: `${P}/nav-links`, icon: Navigation },
            { label: 'Social Links', href: `${P}/social`, icon: Share2 },
        ],
    },
    {
        label: 'Portfolio Content',
        items: [
            { label: 'Projects', href: `${P}/projects`, icon: Briefcase },
            { label: 'Skills', href: `${P}/skills`, icon: BarChart3 },
            { label: 'Timeline', href: `${P}/timeline`, icon: Clock },
            { label: 'Services', href: `${P}/services`, icon: Wrench },
            { label: 'Certificates', href: `${P}/certificates`, icon: Award },
            { label: 'Awards', href: `${P}/awards`, icon: Trophy },
        ],
    },
    {
        label: 'Media & Reviews',
        items: [
            { label: 'Videos', href: `${P}/videos`, icon: Video },
            { label: 'Testimonials', href: `${P}/testimonials`, icon: MessageSquare },
            { label: 'Pending Reviews', href: `${P}/reviews`, icon: Star },
            { label: 'Blog Posts', href: `${P}/blog`, icon: FileText },
        ],
    },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        M
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">Admin Panel</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Portfolio CMS</p>
                    </div>
                </div>
            </div>

            {/* Nav groups */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                {NAV_GROUPS.map(group => (
                    <div key={group.label}>
                        <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            {group.label}
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map(item => {
                                const Icon = item.icon
                                const isRoot = item.href === P
                                const active = isRoot ? pathname === P : pathname.startsWith(item.href)
                                return (
                                    <Link key={item.href} href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                                            active
                                                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
                                        )}>
                                        <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-indigo-600 dark:text-indigo-400' : '')} />
                                        <span className="truncate">{item.label}</span>
                                        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-700 space-y-1">
                <Link href="/" target="_blank"
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white transition-all">
                    <Globe className="w-4 h-4 shrink-0" />
                    View Live Site
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all">
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sign Out
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 z-40">
                <SidebarContent />
            </aside>

            {/* Mobile hamburger */}
            <button onClick={() => setOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 z-40" />
                        <motion.aside
                            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50">
                            <button onClick={() => setOpen(false)}
                                className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg z-10">
                                <X className="w-4 h-4" />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
