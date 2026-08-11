import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthorized } from '@/lib/admin-auth'
import { getList, createItem, deleteItemDal } from '@/lib/dal'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

// GET — all pending reviews
export async function GET(req: NextRequest) {
    const authorized = await isAdminAuthorized(req)
    if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const reviews = await getList('pendingReviews')
    return NextResponse.json(reviews)
}

// POST — approve: move pending → testimonials
export async function POST(req: NextRequest) {
    const authorized = await isAdminAuthorized(req)
    if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await req.json()
    const pending = await getList('pendingReviews')
    const review = pending.find((r) => r.id === id) as Record<string, unknown> | undefined

    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Add to testimonials
    await createItem('testimonials', {
        ...review,
        id: randomUUID(),
        approved: true,
        reviewer_name: review.reviewerName ?? review.reviewer_name,
        reviewer_role: review.reviewerRole ?? review.reviewer_role,
        reviewer_company: review.reviewerCompany ?? review.reviewer_company ?? '',
        reviewer_image_url: '',
        order: Date.now(),
    })

    // Remove from pending
    await deleteItemDal('pendingReviews', id)

    revalidatePath('/')
    return NextResponse.json({ success: true })
}

// DELETE — reject a pending review
export async function DELETE(req: NextRequest) {
    const authorized = await isAdminAuthorized(req)
    if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await req.json()
    await deleteItemDal('pendingReviews', id)
    return NextResponse.json({ success: true })
}
