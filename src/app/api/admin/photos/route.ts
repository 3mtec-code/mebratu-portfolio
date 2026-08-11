import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getSettings, updateSettings } from '@/lib/dal'
import { revalidateAll } from '@/lib/revalidate'

export async function GET() {
    const data = await getSettings('heroProfile')
    return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const updated = await updateSettings('heroProfile', body)
    await revalidateAll()
    return NextResponse.json(updated)
}
