'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Send } from 'lucide-react'
import SocialIcon from '@/components/SocialIcon'
import WorldMap from '@/components/WorldMap'
import ReviewForm from '@/components/sections/ReviewForm'
import { cn } from '@/lib/utils'

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    subject: z.string().min(4, 'Subject must be at least 4 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
})
type ContactForm = z.infer<typeof contactSchema>

interface SocialLink { id: string; platform: string; url: string; icon: string }

interface ContactSectionProps {
    siteSettings?: { email?: string; phone?: string; location?: string;[k: string]: unknown }
    socialLinks?: SocialLink[]
    sectionLabel?: string
    sectionTitle?: string
    successMsg?: string
    errorMsg?: string
    namePh?: string
    emailPh?: string
    subjectPh?: string
    messagePh?: string
    btnLabel?: string
    followMeLabel?: string
    // Review form props
    reviewTitle?: string
    reviewNamePh?: string
    reviewRolePh?: string
    reviewQuotePh?: string
    reviewBtn?: string
    reviewSuccess?: string
    // Map
    location?: string
}

export default function ContactSection({
    siteSettings,
    socialLinks = [],
    sectionLabel = "LET'S CONNECT",
    sectionTitle = 'Get In Touch',
    successMsg = "✓ Message sent! I'll get back to you soon.",
    errorMsg = 'Something went wrong. Please try again.',
    namePh = 'Your Name',
    emailPh = 'Your Email',
    subjectPh = 'Subject',
    messagePh = 'Your Message',
    btnLabel = 'Send Message',
    followMeLabel = 'Follow me',
    reviewTitle = 'Leave a Review',
    reviewNamePh = 'Your Name',
    reviewRolePh = 'Your Role / Company',
    reviewQuotePh = 'Share your experience…',
    reviewBtn = 'Submit Review',
    reviewSuccess = 'Thank you! Your review is pending approval.',
    location,
}: ContactSectionProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
        resolver: zodResolver(contactSchema),
    })

    const email = siteSettings?.email as string || ''
    const phone = siteSettings?.phone as string || ''
    const loc = location || siteSettings?.location as string || 'Gondar, Ethiopia'

    const inputCls = (hasErr: boolean) => cn(
        'w-full px-4 py-3 text-sm rounded-xl outline-none transition-all',
        'bg-gray-50 dark:bg-gray-800/80',
        'border text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500',
        hasErr
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20'
            : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15'
    )

    const onSubmit = async (data: ContactForm) => {
        setStatus('loading')
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            setStatus(res.ok ? 'success' : 'error')
            if (res.ok) reset()
        } catch { setStatus('error') }
    }

    return (
        <section id="contact" className="py-20 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Section heading */}
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
                        {sectionLabel}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{sectionTitle}</h2>
                </div>

                {/* Two-column layout */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* ── LEFT: Contact form + Review form below ── */}
                    <motion.div className="space-y-8"
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5 }}>

                        {/* Contact form */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Send a Message</h3>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <input {...register('name')} placeholder={namePh} className={inputCls(!!errors.name)} />
                                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <input {...register('email')} placeholder={emailPh} type="email" className={inputCls(!!errors.email)} />
                                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                                    </div>
                                </div>
                                <div>
                                    <input {...register('subject')} placeholder={subjectPh} className={inputCls(!!errors.subject)} />
                                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                                </div>
                                <div>
                                    <textarea {...register('message')} placeholder={messagePh} rows={5}
                                        className={cn(inputCls(!!errors.message), 'resize-none')} />
                                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                                </div>

                                <button type="submit" disabled={status === 'loading'}
                                    className="flex items-center justify-center gap-2 w-full py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                                    {status === 'loading'
                                        ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                                        : <><Send className="w-4 h-4" /> {btnLabel}</>}
                                </button>

                                {status === 'success' && <p className="text-sm text-green-600 dark:text-green-400 text-center">{successMsg}</p>}
                                {status === 'error' && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}
                            </form>
                        </div>

                        {/* Review form — directly below the contact form */}
                        <ReviewForm
                            title={reviewTitle}
                            namePh={reviewNamePh}
                            rolePh={reviewRolePh}
                            quotePh={reviewQuotePh}
                            btnLabel={reviewBtn}
                            successMsg={reviewSuccess}
                        />
                    </motion.div>

                    {/* ── RIGHT: Contact info + Social links + World Map ── */}
                    <motion.div className="space-y-6"
                        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5 }}>

                        {/* Contact info */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contact Details</h3>

                            {[
                                { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
                                { icon: Phone, label: 'Phone', value: phone, href: `tel:${phone}` },
                                { icon: MapPin, label: 'Location', value: loc, href: undefined },
                            ].map(({ icon: Icon, label, value, href }) => value ? (
                                <div key={label} className="flex items-center gap-4">
                                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 rounded-xl shrink-0">
                                        <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                                        {href
                                            ? <a href={href} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{value}</a>
                                            : <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>}
                                    </div>
                                </div>
                            ) : null)}

                            {/* Social links */}
                            {socialLinks.length > 0 && (
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">{followMeLabel}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {socialLinks.map(link => (
                                            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                                aria-label={link.platform}
                                                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700 transition-all">
                                                <SocialIcon icon={link.icon} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* World Map — single instance, only here */}
                        <WorldMap location={loc} lat={12.6} lng={37.5} />

                    </motion.div>
                </div>
            </div>
        </section>
    )
}
