import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createItem, getSettings } from '@/lib/dal'
import { sendReviewNotification } from '@/lib/mailer'
import { randomUUID } from 'crypto'

const schema = z.object({
    reviewerName: z.string().min(2),
    reviewerRole: z.string().min(2),
    reviewerCompany: z.string().optional(),
    quote: z.string().min(10),
    rating: z.number().int().min(1).max(5),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const data = schema.parse(body)

        const pending = {
            id: randomUUID(),
            reviewer_name: data.reviewerName,
            reviewer_role: data.reviewerRole,
            reviewer_company: data.reviewerCompany ?? '',
            quote: data.quote,
            rating: data.rating,
            submitted_at: new Date().toISOString(),
            // camelCase aliases for local store fallback
            reviewerName: data.reviewerName,
            reviewerRole: data.reviewerRole,
            order: Date.now(),
        }

        await createItem('pendingReviews', pending)

        // Email notification
        const settings = await getSettings('siteSettings') as Record<string, string>
        const toEmail = settings.email || process.env.EMAIL_USER || ''
        const siteName = settings.site_name || settings.siteName || 'Portfolio'
        const adminUrl = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/mgmt-x7k2p9/reviews`

        if (toEmail) {
            sendReviewNotification({
                toEmail,
                reviewerName: data.reviewerName,
                reviewerRole: data.reviewerRole,
                quote: data.quote,
                rating: data.rating,
                siteName,
                adminUrl,
            }).catch((e) => console.error('[Review email]', e))
        }

        return NextResponse.json({ success: true })
    } catch (e: unknown) {
        if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 })
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
