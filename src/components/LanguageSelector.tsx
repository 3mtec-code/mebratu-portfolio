'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { LOCALES, Locale } from '@/lib/i18n/translations'
import { cn } from '@/lib/utils'

interface LanguageSelectorProps {
    /** compact = icon + flag only (for navbar); full = flag + native name (for hero) */
    variant?: 'compact' | 'full'
}

export default function LanguageSelector({ variant = 'compact' }: LanguageSelectorProps) {
    const { locale, setLocale } = useI18n()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const current = LOCALES.find(l => l.code === locale) ?? LOCALES[0]

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className="relative">
            {/* Trigger button */}
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    'flex items-center gap-1.5 rounded-xl font-medium transition-all select-none',
                    'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    variant === 'compact'
                        ? 'px-2.5 py-1.5 text-sm'
                        : 'px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm'
                )}
                aria-label="Select language"
                aria-expanded={open}
            >
                <span className="text-base leading-none">{current.flag}</span>
                <span className="text-sm font-medium">{current.nativeLabel}</span>
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-full mt-1.5 w-44 z-50
                       bg-white dark:bg-gray-800
                       border border-gray-200 dark:border-gray-700
                       rounded-2xl shadow-xl overflow-hidden"
                    >
                        {LOCALES.map(l => (
                            <button
                                key={l.code}
                                onClick={() => { setLocale(l.code as Locale); setOpen(false) }}
                                className={cn(
                                    'flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors',
                                    locale === l.code
                                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                )}
                            >
                                <span className="text-xl leading-none">{l.flag}</span>
                                <div className="flex-1">
                                    <div className="font-medium leading-tight">{l.nativeLabel}</div>
                                    {l.nativeLabel !== l.label && (
                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{l.label}</div>
                                    )}
                                </div>
                                {locale === l.code && (
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
