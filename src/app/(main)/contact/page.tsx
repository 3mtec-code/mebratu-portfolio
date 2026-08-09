import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { readStore } from '@/lib/store'
import ContactSection from '@/components/sections/ContactSection'

export const metadata: Metadata = buildMetadata({
  title: 'Contact — Mebratu Muhabaw',
  description: 'Get in touch with Mebratu Muhabaw for collaborations and projects.',
  path: '/contact',
})

export const dynamic = 'force-dynamic'

export default function ContactPage() {
    const store = readStore()
    const settings = store.siteSettings as any
    const socialLinks = store.socialLinks as any[]

    return (
        <div className="pt-20 min-h-screen">
            <ContactSection siteSettings={settings} socialLinks={socialLinks} />
        </div>
    )
}
