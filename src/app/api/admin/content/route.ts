import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthorized } from '@/lib/admin-auth'
import { getSettings, updateSettings } from '@/lib/dal'
import { revalidateAll } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'

export async function GET() {
    const data = await getSettings('siteContent')
    return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
    const authorized = await isAdminAuthorized(req)
    if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const current = await getSettings('siteContent') as Record<string, unknown>
    const updated = { ...current, ...body }
    await updateSettings('siteContent', updated)
    await revalidateAll()
    return NextResponse.json(updated)
}
