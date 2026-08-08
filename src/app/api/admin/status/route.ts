import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getSettings, updateSettings } from '@/lib/dal'
import { revalidatePath } from 'next/cache'

export async function GET() {
    const settings = await getSettings('siteSettings')
    const s = settings as Record<string, unknown>
    return NextResponse.json({
        onlineStatus: s.onlineStatus ?? s.online_status ?? 'available',
    })
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { onlineStatus } = await req.json()
    if (!['available', 'busy', 'offline'].includes(onlineStatus)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const current = await getSettings('siteSettings') as Record<string, unknown>
    await updateSettings('siteSettings', { ...current, onlineStatus, online_status: onlineStatus })
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, onlineStatus })
}
