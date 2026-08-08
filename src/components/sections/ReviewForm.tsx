'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Send, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewFormProps {
    title?: string
    namePh?: string
    rolePh?: string
    quotePh?: string
    btnLabel?: string
    successMsg?: string
}

export default function ReviewForm({
    title = 'Leave a Review',
    namePh = 'Your Name',
    rolePh = 'Your Role / Company',
    quotePh = 'Share your experience…',
    btnLabel = 'Submit Review',
    successMsg = 'Thank you! Your review is pending approval.',
}: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [name, setName] = useState('')
    const [role, setRole] = useState('')
    const [quote, setQuote] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = () => {
        const e: Record<string, string> = {}
        if (name.trim().length < 2) e.name = 'Name must be at least 2 characters'
        if (role.trim().length < 2) e.role = 'Please enter your role or company'
        if (quote.trim().length < 10) e.quote = 'Please write at least 10 characters'
        if (rating === 0) e.rating = 'Please select a star rating'
        return e
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) { setErrors(errs); return }
        setErrors({})
        setStatus('loading')
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewerName: name, reviewerRole: role, quote, rating }),
            })
            if (res.ok) {
                setStatus('success')
                setName(''); setRole(''); setQuote(''); setRating(0)
            } else {
                setStatus('error')
            }
        } catch { setStatus('error') }
    }

    if (status === 'success') {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{successMsg}</p>
                <button onClick={() => setStatus('idle')}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    Submit another review
                </button>
            </motion.div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">{title}</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Star rating */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button"
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                                className="p-1 transition-transform hover:scale-110">
                                <Star className={cn('w-8 h-8 transition-colors', (hover || rating) >= star
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                )} />
                            </button>
                        ))}
                    </div>
                    {errors.rating && <p className="text-xs text-red-500">{errors.rating}</p>}
                </div>

                {/* Name + Role */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder={namePh}
                            className={cn('w-full px-4 py-3 text-sm rounded-xl border outline-none transition-colors bg-gray-50 dark:bg-gray-800',
                                errors.name ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500')} />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <input value={role} onChange={e => setRole(e.target.value)} placeholder={rolePh}
                            className={cn('w-full px-4 py-3 text-sm rounded-xl border outline-none transition-colors bg-gray-50 dark:bg-gray-800',
                                errors.role ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500')} />
                        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                    </div>
                </div>

                {/* Quote */}
                <div>
                    <textarea value={quote} onChange={e => setQuote(e.target.value)} placeholder={quotePh} rows={4}
                        className={cn('w-full px-4 py-3 text-sm rounded-xl border outline-none transition-colors resize-none bg-gray-50 dark:bg-gray-800',
                            errors.quote ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500')} />
                    {errors.quote && <p className="text-xs text-red-500 mt-1">{errors.quote}</p>}
                </div>

                {status === 'error' && (
                    <p className="text-sm text-red-500 text-center">Something went wrong. Please try again.</p>
                )}

                <button type="submit" disabled={status === 'loading'}
                    className="flex items-center justify-center gap-2 w-full py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60">
                    {status === 'loading' ? (
                        <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting…</>
                    ) : (
                        <><Send className="w-4 h-4" /> {btnLabel}</>
                    )}
                </button>
            </form>
        </motion.div>
    )
}
