'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2, Star, Clock } from 'lucide-react'

interface Review {
    id: string
    reviewerName: string
    reviewerRole: string
    reviewerCompany?: string
    quote: string
    rating: number
    submittedAt: string
}

export default function PendingReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [acting, setActing] = useState<string | null>(null)

    const load = () => {
        setLoading(true)
        fetch('/api/admin/reviews')
            .then(r => r.json())
            .then(d => { setReviews(Array.isArray(d) ? d : []); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(load, [])

    const approve = async (id: string) => {
        setActing(id)
        await fetch('/api/admin/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        load()
        setActing(null)
    }

    const reject = async (id: string) => {
        if (!confirm('Reject and delete this review?')) return
        setActing(id)
        await fetch('/api/admin/reviews', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        load()
        setActing(null)
    }

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Reviews</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                    Approve reviews to publish them publicly. Rejected reviews are permanently deleted.
                </p>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-16 text-center border border-gray-100 dark:border-gray-700">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="font-semibold text-gray-900 dark:text-white">All clear!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No pending reviews right now.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {reviews.map((review) => (
                            <motion.div key={review.id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                            {review.reviewerName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{review.reviewerName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {review.reviewerRole}{review.reviewerCompany && ` · ${review.reviewerCompany}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                                        <Clock className="w-3 h-3" />
                                        {new Date(review.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>

                                {/* Stars */}
                                <div className="flex gap-0.5 mb-3">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-gray-700 dark:text-gray-300 text-sm italic mb-5">
                                    &ldquo;{review.quote}&rdquo;
                                </p>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button onClick={() => approve(review.id)} disabled={acting === review.id}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 disabled:opacity-60 transition-colors">
                                        {acting === review.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        Approve & Publish
                                    </button>
                                    <button onClick={() => reject(review.id)} disabled={acting === review.id}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:bg-red-100 dark:hover:bg-red-900 disabled:opacity-60 transition-colors border border-red-200 dark:border-red-800">
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
