import { getAllData } from '@/lib/dal'
import { computeStats, readStore } from '@/lib/store'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import ServicesSection from '@/components/sections/ServicesSection'
import SkillsSection from '@/components/sections/SkillsSection'
import TimelineSection from '@/components/sections/TimelineSection'
import CertificatesPreview from '@/components/sections/CertificatesPreview'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import AwardsPreview from '@/components/sections/AwardsPreview'
import VideosSection from '@/components/sections/VideosSection'
import ContactSection from '@/components/sections/ContactSection'
import TechStackSection from '@/components/sections/TechStackSection'
import ReviewForm from '@/components/sections/ReviewForm'
import WorldMap from '@/components/WorldMap'

// ISR: rebuild cached page every hour; admin saves bust this immediately via revalidatePath()
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
    try {
        const store = await getAllData()
        const settings = store.siteSettings as any
        return buildMetadata({
            title: settings?.siteName || 'Mebratu Muhabaw — Full Stack Developer & AI Specialist',
            description: settings?.tagline || 'Full Stack Developer specializing in AI-powered applications, secure system architecture, and cybersecurity — Mebratu Muhabaw.',
            path: '/',
            type: 'profile',
            keywords: ['Ethiopian developer', 'Gondar', 'Full Stack', 'AI', 'Cybersecurity', 'React', 'Next.js'],
        })
    } catch {
        return buildMetadata({ title: 'Mebratu Muhabaw', description: 'Portfolio', path: '/' })
    }
}

export default async function HomePage() {
    const store = await getAllData()
    const settings = store.siteSettings as any
    const content = store.siteContent as any

    const heroProfile = store.heroProfile as any
    const heroStats = computeStats(store) as any[]
    const infoCards = store.infoCards as any[]
    const skills = store.skills as any[]
    const timeline = store.timeline as any[]
    const allProjects = store.projects as any[]
    const certificates = store.certificates as any[]
    const awards = store.awards as any[]
    const testimonials = store.testimonials as any[]
    const videos = store.videos as any[]
    const services = store.services as any[]
    const socialLinks = store.socialLinks as any[]
    const techStack = store.techStack as any[]
    const featuredProjects = allProjects.filter((p: any) => p.featured).slice(0, 4)
    const location = (settings?.location || settings?.location || 'Gondar, Ethiopia') as string

    const c = (key: string, fallback: string) =>
        content?.[key] || content?.[`${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`] || fallback

    return (
        <>
            {/* ── Hero ── */}
            <HeroSection
                heroImageUrl={heroProfile?.heroImageUrl || heroProfile?.hero_image_url}
                infoCards={infoCards}
                socialLinks={socialLinks}
                onlineStatus={settings?.onlineStatus || settings?.online_status || 'available'}
                heroHeadline={c('heroHeadline', 'I build intelligent, secure digital products.')}
                heroSubtext={c('heroSubtext', "Hi, I'm Mebratu — a Full Stack Software Developer specializing in AI-powered applications, secure system architecture, and cybersecurity across Windows & Linux (Ubuntu) environments.")}
                heroCta1={c('heroCta1', 'Hire Me')}
                heroCta2={c('heroCta2', 'View My Work')}
                followMeLabel={c('followMeLabel', 'Follow me on')}
            />

            {/* ── Stats ── */}
            <StatsSection stats={heroStats} />

            {/* ── Timeline (4 items) + Skills (6 items) ── */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-10">
                        <TimelineSection
                            entries={timeline}
                            limit={4}
                            sectionLabel="MY JOURNEY"
                            sectionTitle={c('timelineTitle', 'My Journey')}
                        />
                        <SkillsSection
                            skills={skills}
                            limit={6}
                            sectionTitle={c('skillsTitle', 'Skills')}
                        />
                    </div>
                </div>
            </section>

            {/* ── Featured Projects ── */}
            <section className="py-16 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="mb-8">
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-1">
                            {c('featuredProjectsLabel', 'MY WORK')}
                        </p>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {c('featuredProjectsTitle', 'Featured Projects')}
                        </h2>
                    </div>
                    <ProjectsSection projects={featuredProjects} showFilters={true} limit={4} />
                </div>
            </section>

            {/* ── Certificates / Awards / Testimonials ── */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-6">
                        <CertificatesPreview certificates={certificates} sectionTitle={c('certsTitle', 'Certificates')} />
                        <AwardsPreview awards={awards} sectionTitle={c('awardsTitle', 'Awards')} />
                        <TestimonialsSection testimonials={testimonials} sectionTitle={c('testimonialsTitle', 'What People Say')} />
                    </div>
                </div>
            </section>

            {/* ── Services ── */}
            <ServicesSection
                services={services}
                sectionLabel={c('servicesLabel', 'WHAT I DO')}
                sectionTitle={c('servicesTitle', 'Services I Provide')}
            />

            {/* ── Latest Videos (3) + Tech Stack ── */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <VideosSection
                            videos={videos}
                            limit={3}
                            sectionTitle={c('videosTitle', 'Latest Videos')}
                        />
                        <TechStackSection
                            techStack={techStack}
                            sectionLabel={c('techStackLabel', 'Tech Stack')}
                            sectionTitle={c('techStackTitle', 'Technologies I Use')}
                        />
                    </div>
                </div>
            </section>

            {/* ── Contact: LET'S CONNECT — left: form + review, right: info + map ── */}
            <ContactSection
                siteSettings={settings}
                socialLinks={socialLinks}
                sectionLabel={c('contactLabel', "LET'S CONNECT")}
                sectionTitle={c('contactTitle', 'Get In Touch')}
                successMsg={c('contactSuccessMsg', "✓ Message sent! I'll get back to you soon.")}
                errorMsg={c('contactErrorMsg', 'Something went wrong. Please try again.')}
                namePh={c('contactFormNamePh', 'Your Name')}
                emailPh={c('contactFormEmailPh', 'Your Email')}
                subjectPh={c('contactFormSubjPh', 'Subject')}
                messagePh={c('contactFormMsgPh', 'Your Message')}
                btnLabel={c('contactFormBtn', 'Send Message')}
                followMeLabel={c('followMeLabel', 'Follow me')}
                reviewTitle={c('reviewFormTitle', 'Leave a Review')}
                reviewNamePh={c('reviewFormNamePh', 'Your Name')}
                reviewRolePh={c('reviewFormRolePh', 'Your Role / Company')}
                reviewQuotePh={c('reviewFormQuotePh', 'Share your experience…')}
                reviewBtn={c('reviewFormBtn', 'Submit Review')}
                reviewSuccess={c('reviewPendingMsg', 'Thank you! Your review is pending approval.')}
                location={location}
            />
        </>
    )
}
