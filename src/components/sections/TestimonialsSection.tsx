'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'

interface Testimonial {
    id: string
    reviewerName: string
    reviewerRole: string
    reviewerCompany?: string | null
    reviewerImageUrl?: string | null
    quote: string
    rating: number
}

interface TestimonialsSectionProps {
    sectionTitle?: string
    testimonials?: Testimonial[]
}

export default function TestimonialsSection({ testimonials = [], sectionTitle = 'What People Say' }: TestimonialsSectionProps) {
    const [current, setCurrent] = useState(0)

    const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))
    const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))

    if (!testimonials.length) return null

    const testimonial = testimonials[current]

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Testimonials</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">What People Say</h3>
                </div>
                <Link href="/certificates#testimonials" className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 relative min-h-[200px]">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-indigo-100 dark:text-indigo-900" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Stars */}
                        <div className="flex gap-0.5 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>

                        {/* Quote */}
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 italic">
                            &ldquo;{testimonial.quote}&rdquo;
                        </p>

                        {/* Reviewer */}
                        <div className="flex items-center gap-3">
                            {testimonial.reviewerImageUrl ? (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                    <Image src={testimonial.reviewerImageUrl} alt={testimonial.reviewerName} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                    {testimonial.reviewerName.charAt(0)}
                                </div>
                            )}
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white text-sm">{testimonial.reviewerName}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {testimonial.reviewerRole}{testimonial.reviewerCompany && `, ${testimonial.reviewerCompany}`}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                {testimonials.length > 1 && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button onClick={prev} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <div className="flex gap-1">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-indigo-600 w-4' : 'bg-gray-300 dark:bg-gray-600'}`}
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
