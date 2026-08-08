'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'

interface Certificate {
    id: string
    title: string
    issuer: string
    issueDate: string
    verificationUrl?: string | null
    certificateImageUrl: string
}

interface CertificatesPreviewProps {
    sectionTitle?: string
    certificates?: Certificate[]
}

export default function CertificatesPreview({ certificates = [], sectionTitle = 'Certificates' }: CertificatesPreviewProps) {
    const [current, setCurrent] = useState(0)

    if (!certificates.length) return null

    const cert = certificates[current]
    const prev = () => setCurrent((c) => (c === 0 ? certificates.length - 1 : c - 1))
    const next = () => setCurrent((c) => (c === certificates.length - 1 ? 0 : c + 1))

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Achievements</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Certificates</h3>
                </div>
                <Link href="/certificates" className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    View All
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                {/* Certificate image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                    {cert.certificateImageUrl ? (
                        <Image
                            src={cert.certificateImageUrl}
                            alt={cert.title}
                            fill
                            className="object-cover"
                            unoptimized={cert.certificateImageUrl.startsWith('/')}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl">ðŸ†</span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{cert.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cert.issuer}</p>

                    {cert.verificationUrl && (
                        <a
                            href={cert.verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline mt-2"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Verify Certificate
                        </a>
                    )}
                </div>

                {/* Navigation */}
                {certificates.length > 1 && (
                    <div className="flex items-center justify-between px-4 pb-4">
                        <button onClick={prev} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <div className="flex gap-1">
                            {certificates.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-primary-600 w-4' : 'bg-gray-300 dark:bg-gray-600'}`}
                                />
                            ))}
                        </div>
                        <button onClick={next} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
