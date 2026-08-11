import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import Image from 'next/image'
import { readStore } from '@/lib/store'
import { ExternalLink, Trophy } from 'lucide-react'

export const metadata: Metadata = buildMetadata({
    title: 'Certificates & Awards — Mebratu Muhabaw',
    description: 'Professional certifications and awards earned by Mebratu Muhabaw.',
    path: '/certificates',
})

// ISR: rebuild cached page every hour; admin saves bust this immediately via revalidatePath()
export const revalidate = 3600

export default function CertificatesPage() {
    const store = readStore()
    const certificates = store.certificates as any[]
    const awards = store.awards as any[]
    const testimonials = store.testimonials as any[]

    return (
        <div className="pt-20 min-h-screen">
            <section className="py-16 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">ACHIEVEMENTS</p>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Certificates &amp; Awards</h1>
                    </div>

                    {/* Certificates */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Certificates</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {certificates.map((cert) => (
                            <div key={cert.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                                {cert.certificateImageUrl && (
                                    <div className="relative aspect-[4/3]">
                                        <Image
                                            src={cert.certificateImageUrl}
                                            alt={cert.title}
                                            fill
                                            className="object-cover"
                                            unoptimized={cert.certificateImageUrl?.startsWith('/')}
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{cert.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cert.issuer}</p>
                                    {cert.issueDate && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                            {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                        </p>
                                    )}
                                    {cert.verificationUrl && (
                                        <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-3">
                                            <ExternalLink className="w-3 h-3" /> Verify Certificate
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Awards */}
                    <h2 id="awards" className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Awards</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {awards.map((award) => (
                            <div key={award.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center mb-4">
                                    <Trophy className="w-6 h-6 text-amber-500" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{award.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{award.issuer}</p>
                                {award.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{award.description}</p>}
                            </div>
                        ))}
                    </div>

                    {/* Testimonials */}
                    <h2 id="testimonials" className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Testimonials</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex gap-0.5 mb-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className={`text-lg ${i < (t.rating ?? 5) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                                    ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    {t.reviewerImageUrl ? (
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                            <Image src={t.reviewerImageUrl} alt={t.reviewerName} fill className="object-cover" unoptimized={t.reviewerImageUrl?.startsWith('/')} />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                            {t.reviewerName?.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.reviewerName}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {t.reviewerRole}{t.reviewerCompany && `, ${t.reviewerCompany}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
