/**
 * Data Access Layer (DAL)
 * ─────────────────────────────────────────────────────────────────────────────
 * ይህ layer ሁለት backend ይደግፋል:
 *  1. LOCAL  — data/store.json  (dev / no-DB mode)
 *  2. REMOTE — Supabase PostgreSQL (production)
 *
 * SUPABASE_URL + SUPABASE_ANON_KEY env vars ካሉ → Supabase ይጠቀማል
 * ካልሆነ → local JSON store ይጠቀማል
 *
 * ለ Vercel deploy: Supabase env vars ብቻ ያስፈልጋሉ።
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import {
    readStoreAsync,
    upsertItemAsync,
    deleteItemAsync,
    updateStoreKeyAsync,
    StoreData,
    StoreRecord,
    DEFAULTS,
} from './store'
import {
    normalizeSiteSettings,
    normalizeHeroProfile,
    normalizeSiteContent,
    normalizeProject,
    normalizeCertificate,
    normalizeTestimonial,
    normalizeVideo,
} from './dal-normalize'

// ─── Redis Cache (optional — only active when Upstash env vars are set) ───────
const CACHE_TTL = 3600 // 1 hour in seconds
const CACHE_KEY = 'portfolio:all'

async function getCacheClient() {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
    try {
        const { Redis } = await import('@upstash/redis')
        return Redis.fromEnv()
    } catch {
        return null
    }
}

async function getCachedData(): Promise<StoreData | null> {
    const redis = await getCacheClient()
    if (!redis) return null
    try {
        return await redis.get<StoreData>(CACHE_KEY)
    } catch {
        return null
    }
}

async function setCachedData(data: StoreData): Promise<void> {
    const redis = await getCacheClient()
    if (!redis) return
    try {
        await redis.set(CACHE_KEY, data, { ex: CACHE_TTL })
    } catch { /* non-critical — continue without cache */ }
}

/** Bust the Redis data cache — called after any admin save */
export async function bustDataCache(): Promise<void> {
    const redis = await getCacheClient()
    if (!redis) return
    try {
        await redis.del(CACHE_KEY)
    } catch { /* non-critical */ }
}

// ─── Supabase Client (lazy init) ──────────────────────────────────────────────
let _supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient | null {
    if (_supabase) return _supabase
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY
    if (!url || !key) return null
    _supabase = createClient(url, key)
    return _supabase
}

export function isSupabaseEnabled(): boolean {
    return !!(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY))
}

// ─── Table name mapping ───────────────────────────────────────────────────────
const TABLE_MAP: Partial<Record<keyof StoreData, string>> = {
    projects: 'projects',
    certificates: 'certificates',
    awards: 'awards',
    testimonials: 'testimonials',
    pendingReviews: 'pending_reviews',
    videos: 'videos',
    services: 'services',
    socialLinks: 'social_links',
    blogPosts: 'blog_posts',
    skills: 'skills',
    timeline: 'timeline_entries',
    heroStats: 'hero_stats',
    infoCards: 'info_cards',
    navLinks: 'nav_links',
    techStack: 'tech_stack',
}

// ─── Singleton settings table key ────────────────────────────────────────────
const SETTINGS_TABLES: Partial<Record<keyof StoreData, string>> = {
    siteSettings: 'site_settings',
    heroProfile: 'hero_profile',
    siteContent: 'site_content',
    footerSettings: 'footer_settings',
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PUBLIC API — use these everywhere instead of store.ts directly
// ═══════════════════════════════════════════════════════════════════════════════

/** ሁሉንም data አንድ ጊዜ ያነባል — homepage ላይ ጥቅም ላይ ይውላል */
export async function getAllData(): Promise<StoreData> {
    // 1. Try Redis cache first (fast path — ~1ms from Upstash edge)
    const cached = await getCachedData()
    if (cached) return cached

    // 2. Cache miss — fetch from Supabase or local store
    const sb = getSupabase()
    if (!sb) {
        const data = await readStoreAsync()
        await setCachedData(data)
        return data
    }

    try {
        // Fetch all tables in parallel
        const [
            siteSettingsRes,
            heroProfileRes,
            siteContentRes,
            footerRes,
            projectsRes,
            certsRes,
            awardsRes,
            testimonialsRes,
            pendingRes,
            videosRes,
            servicesRes,
            socialRes,
            blogRes,
            skillsRes,
            timelineRes,
            statsRes,
            infoCardsRes,
            navRes,
            techRes,
        ] = await Promise.all([
            sb.from('site_settings').select('*').eq('id', 'default').single(),
            sb.from('hero_profile').select('*').eq('id', 'default').single(),
            sb.from('site_content').select('*').eq('id', 'default').single(),
            sb.from('footer_settings').select('*').eq('id', 'default').single(),
            sb.from('projects').select('*').order('order'),
            sb.from('certificates').select('*').order('order'),
            sb.from('awards').select('*').order('order'),
            sb.from('testimonials').select('*').eq('approved', true).order('order'),
            sb.from('pending_reviews').select('*').order('created_at'),
            sb.from('videos').select('*').order('order'),
            sb.from('services').select('*').order('order'),
            sb.from('social_links').select('*').order('order'),
            sb.from('blog_posts').select('*').order('created_at', { ascending: false }),
            sb.from('skills').select('*').order('order'),
            sb.from('timeline_entries').select('*').order('order'),
            sb.from('hero_stats').select('*').order('order'),
            sb.from('info_cards').select('*').order('order'),
            sb.from('nav_links').select('*').order('order'),
            sb.from('tech_stack').select('*').order('order'),
        ])

        const result: StoreData = {
            siteSettings: normalizeSiteSettings((siteSettingsRes.data ?? DEFAULTS.siteSettings) as any),
            heroProfile: normalizeHeroProfile((heroProfileRes.data ?? DEFAULTS.heroProfile) as any),
            siteContent: normalizeSiteContent((siteContentRes.data ?? DEFAULTS.siteContent) as any),
            footerSettings: footerRes.data ?? DEFAULTS.footerSettings,
            projects: (projectsRes.data ?? []).map((r: any) => normalizeProject(r)),
            certificates: (certsRes.data ?? []).map((r: any) => normalizeCertificate(r)),
            awards: awardsRes.data ?? [],
            testimonials: (testimonialsRes.data ?? []).map((r: any) => normalizeTestimonial(r)),
            pendingReviews: pendingRes.data ?? [],
            videos: (videosRes.data ?? []).map((r: any) => normalizeVideo(r)),
            services: servicesRes.data ?? [],
            socialLinks: socialRes.data ?? [],
            blogPosts: blogRes.data ?? [],
            skills: skillsRes.data ?? [],
            timeline: timelineRes.data ?? [],
            heroStats: statsRes.data ?? DEFAULTS.heroStats,
            infoCards: infoCardsRes.data ?? DEFAULTS.infoCards,
            navLinks: navRes.data ?? DEFAULTS.navLinks,
            techStack: techRes.data ?? DEFAULTS.techStack,
            translations: {},
        }

        // 3. Warm the cache for subsequent requests (non-blocking)
        setCachedData(result).catch(() => { })

        return result
    } catch (err) {
        console.error('[DAL] Supabase getAllData failed, falling back to store.json', err)
        return readStoreAsync()
    }
}

/** Single settings object (siteSettings, heroProfile, etc.) ያነባል */
export async function getSettings<K extends keyof typeof SETTINGS_TABLES>(key: K): Promise<StoreRecord> {
    const sb = getSupabase()
    if (!sb) {
        const store = await readStoreAsync()
        return store[key] as StoreRecord
    }
    const table = SETTINGS_TABLES[key]!
    const { data, error } = await sb.from(table).select('*').eq('id', 'default').single()
    if (error || !data) return (DEFAULTS[key] ?? {}) as StoreRecord
    return data as StoreRecord
}

/** Single settings object ያዘምናል */
export async function updateSettings<K extends keyof typeof SETTINGS_TABLES>(
    key: K,
    value: StoreRecord
): Promise<StoreRecord> {
    const sb = getSupabase()
    if (!sb) {
        await updateStoreKeyAsync(key, value)
        return value
    }
    const table = SETTINGS_TABLES[key]!
    const payload = { ...value, id: 'default' }
    const { data, error } = await sb.from(table).upsert(payload).select().single()
    if (error) throw new Error(`[DAL] updateSettings failed: ${error.message}`)
    return data as StoreRecord
}

/** List ያነባል */
export async function getList<K extends keyof typeof TABLE_MAP>(
    key: K,
    filter?: Record<string, unknown>
): Promise<StoreRecord[]> {
    const sb = getSupabase()
    if (!sb) {
        const store = await readStoreAsync()
        let list = (store[key] as StoreRecord[]) ?? []
        if (filter) {
            list = list.filter(item => Object.entries(filter).every(([k, v]) => item[k] === v))
        }
        return list.sort((a, b) => ((a.order as number) ?? 0) - ((b.order as number) ?? 0))
    }

    const table = TABLE_MAP[key]!
    let query = sb.from(table).select('*').order('order')
    if (filter) {
        Object.entries(filter).forEach(([k, v]) => { query = query.eq(k, v) as typeof query })
    }
    const { data, error } = await query
    if (error) {
        console.error(`[DAL] getList(${String(key)}) failed:`, error.message)
        return []
    }
    return (data ?? []) as StoreRecord[]
}

/** Item ፈጥሮ ያስቀምጣል */
export async function createItem<K extends keyof typeof TABLE_MAP>(
    key: K,
    item: StoreRecord
): Promise<StoreRecord> {
    const sb = getSupabase()
    if (!sb) return upsertItemAsync(key as any, item)

    const table = TABLE_MAP[key]!
    const { data, error } = await sb.from(table).insert(item).select().single()
    if (error) throw new Error(`[DAL] createItem(${String(key)}) failed: ${error.message}`)
    return data as StoreRecord
}

/** Item ያዘምናል */
export async function updateItem<K extends keyof typeof TABLE_MAP>(
    key: K,
    id: string,
    patch: Partial<StoreRecord>
): Promise<StoreRecord> {
    const sb = getSupabase()
    if (!sb) {
        const store = await readStoreAsync()
        const storeAny = store as unknown as Record<string, StoreRecord[]>
        const list = storeAny[key as string] as StoreRecord[]
        const existing = list.find(x => x.id === id)
        if (!existing) throw new Error('Not found')
        const updated = { ...existing, ...patch, id }
        return upsertItemAsync(key as any, updated)
    }

    const table = TABLE_MAP[key]!
    const { data, error } = await sb.from(table).update(patch).eq('id', id).select().single()
    if (error) throw new Error(`[DAL] updateItem(${String(key)}) failed: ${error.message}`)
    return data as StoreRecord
}

/** Item ይሰርዛል */
export async function deleteItemDal<K extends keyof typeof TABLE_MAP>(
    key: K,
    id: string
): Promise<void> {
    const sb = getSupabase()
    if (!sb) return deleteItemAsync(key as any, id)

    const table = TABLE_MAP[key]!
    const { error } = await sb.from(table).delete().eq('id', id)
    if (error) throw new Error(`[DAL] deleteItem(${String(key)}) failed: ${error.message}`)
}
