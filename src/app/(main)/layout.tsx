import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
import { readStore } from '@/lib/store'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const store = readStore()
    const settings = store.siteSettings as any
    const socialLinks = store.socialLinks as any[]
    const footer = store.footerSettings as any

    return (
        <>
            <Header siteSettings={settings} />
            <PageTransition>
                <main>{children}</main>
            </PageTransition>
            <Footer
                socialLinks={socialLinks}
                siteName={settings?.siteName}
                footerNote={footer?.footerNote}
            />
        </>
    )
}
