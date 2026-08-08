'use client'

import { motion } from 'framer-motion'
import SocialIcon from '@/components/SocialIcon'
import { useI18n } from '@/lib/i18n/context'

interface SocialLink { id: string; platform: string; url: string; icon: string }
interface FooterProps {
    socialLinks?: SocialLink[]
    siteName?: string
    footerNote?: string
}

export default function Footer({
    socialLinks = [],
    siteName = 'Mebratu Muhabaw',
    footerNote,
}: FooterProps) {
    const year = new Date().getFullYear()
    const { t } = useI18n()
    const note = footerNote ?? t('footer_note')

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 lg:px-8 py-8">
                {note && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">{note}</p>
                )}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {year} {siteName}. {t('footer_rights')}
                    </p>
                    <div className="flex items-center gap-3">
                        {socialLinks.map((link) => (
                            <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                aria-label={link.platform}>
                                <SocialIcon icon={link.icon} />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
