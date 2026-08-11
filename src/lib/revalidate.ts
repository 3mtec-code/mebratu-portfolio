import { revalidatePath } from 'next/cache'
import { bustDataCache } from './dal'

export const PUBLIC_ROUTES = [
    '/', '/about', '/projects', '/certificates',
    '/videos', '/blog', '/contact',
] as const

export async function revalidateAll() {
    // 1. Bust Redis data cache so next request fetches fresh data from Supabase
    await bustDataCache()

    // 2. Trigger Next.js ISR revalidation for all public pages
    PUBLIC_ROUTES.forEach(r => revalidatePath(r))
    revalidatePath('/', 'layout')
}
