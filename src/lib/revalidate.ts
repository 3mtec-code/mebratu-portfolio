import { revalidatePath } from 'next/cache'

export const PUBLIC_ROUTES = [
    '/', '/about', '/projects', '/certificates',
    '/videos', '/blog', '/contact',
] as const

export function revalidateAll() {
    PUBLIC_ROUTES.forEach(r => revalidatePath(r))
    revalidatePath('/', 'layout')
}
