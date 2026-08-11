import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth-options'
import { getList, createItem, updateItem, deleteItemDal } from './dal'
import { StoreData, StoreRecord } from './store'
import { revalidateAll } from './revalidate'
import { randomUUID } from 'crypto'

type ListKey = {
    [K in keyof StoreData]: StoreData[K] extends StoreRecord[] ? K : never
}[keyof StoreData]

/**
 * Convert camelCase keys to snake_case for Supabase columns.
 * Supabase stores cover_image_url, live_url, etc.
 */
function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(obj)) {
        // Convert camelCase → snake_case
        const snake = key.replace(/([A-Z])/g, '_$1').toLowerCase()
        result[snake] = val
        // Also keep camelCase for local store fallback
        if (snake !== key) result[key] = val
    }
    return result
}

export function makeStoreCrud(key: ListKey) {

    async function GET() {
        try {
            const items = await getList(key as any)
            return NextResponse.json(items)
        } catch (e: unknown) {
            return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
        }
    }

    async function POST(req: NextRequest) {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        try {
            const body = await req.json()
            const payload = toSnakeCase({ id: randomUUID(), order: 0, ...body })
            const created = await createItem(key as any, payload)
            await revalidateAll()
            return NextResponse.json(created, { status: 201 })
        } catch (e: unknown) {
            return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
        }
    }

    async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        try {
            const body = await req.json()
            const payload = toSnakeCase(body)
            const updated = await updateItem(key as any, params.id, payload)
            await revalidateAll()
            return NextResponse.json(updated)
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Error'
            const status = msg === 'Not found' ? 404 : 500
            return NextResponse.json({ error: msg }, { status })
        }
    }

    async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        try {
            await deleteItemDal(key as any, params.id)
            await revalidateAll()
            return NextResponse.json({ success: true })
        } catch (e: unknown) {
            return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
        }
    }

    return { GET, POST, PATCH, DELETE }
}
