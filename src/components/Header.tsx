'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/context'

interface HeaderProps {
    siteSettings?: {
        logoUrl: string
        siteName: string
        tagline: string
        cvUrl?: string | null
    }
}

const NAV_KEYS = [
    { key: 'nav_home', href: '/' },
    { key: 'nav_about', href: '/about' },
    { key: 'nav_projects', href: '/projects' },
    { key: 'nav_certificates', href: '/certificates' },
    { key: 'nav_videos', href: '/videos' },
    { key: 'nav_blog', href: '/blog' },
    { key: 'nav_contact', href: '/contact' },
] as const

export default function Header({ siteSettings }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const { t } = useI18n()

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled
                    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm'
                    : 'bg-transparent'
            )}
        >
            <nav className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {siteSettings?.logoUrl && (
                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-2 group-hover:scale-105 transition-transform">
                                <Image
                                    src={siteSettings.logoUrl}
                                    alt={siteSettings.siteName || 'Logo'}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {siteSettings?.siteName || 'Mebratu Muhabaw'}
                            </h1>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {siteSettings?.tagline || 'Software Engineer • UI/UX Designer'}
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {NAV_KEYS.map((link) => (
                            <Link
                                key={link.key}
                                href={link.href}
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group"
                            >
                                {t(link.key as any)}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        {siteSettings?.cvUrl && (
                            <Link href={siteSettings.cvUrl} target="_blank"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-600 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                                <Download className="w-4 h-4" />
                                {t('nav_download_cv')}
                            </Link>
                        )}
                        <Link href="/contact"
                            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:shadow-lg hover:scale-105 transition-all">
                            {t('nav_lets_talk')}
                        </Link>
                        {mounted && (
                            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Toggle theme">
                                {theme === 'dark' ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden items-center gap-2">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                )}
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6 text-gray-900 dark:text-white" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-4">
                                {NAV_KEYS.map((link) => (
                                    <Link
                                        key={link.key}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {t(link.key as any)}
                                    </Link>
                                ))}
                                <div className="pt-4 space-y-3">
                                    {siteSettings?.cvUrl && (
                                        <Link
                                            href={siteSettings.cvUrl}
                                            target="_blank"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-600 dark:hover:border-indigo-400 transition-all"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download CV
                                        </Link>
                                    )}
                                    <Link href="/contact" onClick={() => setIsOpen(false)}
                                        className="block text-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:shadow-lg transition-all">
                                        {t('nav_lets_talk')}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    )
}
