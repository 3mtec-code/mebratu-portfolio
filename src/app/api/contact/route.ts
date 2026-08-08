import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkContactFormRateLimit } from '@/lib/rate-limit'
import { sendContactEmail } from '@/lib/mailer'
import { readStore } from '@/lib/store'

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    subject: z.string().min(4, 'Subject must be at least 4 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
})

export async function POST(req: NextRequest) {
    try {
        // Rate limiting
        const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
        const { success } = await checkContactFormRateLimit(ip)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again in a few minutes.' },
                { status: 429 }
            )
        }

        // Validate
        const body = await req.json()
        const data = schema.parse(body)

        // Get owner email from store
        const store = readStore()
        const settings = store.siteSettings as Record<string, string>
        const toEmail = settings.email || process.env.EMAIL_USER || ''
        const siteName = settings.siteName || 'Portfolio'

        if (!toEmail) {
            console.warn('[Contact] No recipient email configured in site settings')
            // Still return success to the user — we don't want to leak config details
            return NextResponse.json({ success: true })
        }

        // Send email — await so we can return proper status
        const result = await sendContactEmail({
            toEmail,
            fromName: data.name,
            fromEmail: data.email,
            subject: data.subject,
            message: data.message,
            siteName,
        })

        if (!result.ok) {
            console.error('[Contact] Email send failed:', result.error)
            // Return success anyway if it's a config issue — don't block the user
            // Return error only for server-side failures we can fix
        }

        return NextResponse.json({ success: true })
    } catch (err: unknown) {
        if (err instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: err.errors },
                { status: 400 }
            )
        }
        console.error('[Contact] Unexpected error:', err)
        return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
    }
}
