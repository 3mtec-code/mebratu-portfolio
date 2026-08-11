import { MetadataRoute } from 'next'
import { readStore } from '@/lib/store'

const BASE = process.env.NEXTAUTH_URL ?? 'https://mebratumuhabaw.dev'

export default function sitemap(): MetadataRoute.Sitemap {
    const store = readStore()
    const posts = (store.blogPosts as any[]).filter((p: any) => p.published)

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE, priority: 1.0, changeFrequency: 'daily' },
        { url: `${BASE}/about`, priority: 0.9, changeFrequency: 'monthly' },
        { url: `${BASE}/projects`, priority: 0.9, changeFrequency: 'weekly' },
        { url: `${BASE}/certificates`, priority: 0.7, changeFrequency: 'monthly' },
        { url: `${BASE}/videos`, priority: 0.7, changeFrequency: 'weekly' },
        { url: `${BASE}/blog`, priority: 0.8, changeFrequency: 'weekly' },
        { url: `${BASE}/contact`, priority: 0.6, changeFrequency: 'yearly' },
    ]

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
        url: `${BASE}/blog/${post.slug || post.id}`,
        lastModified: new Date(post.updatedAt || post.updated_at || post.createdAt || Date.now()),
        priority: 0.7,
        changeFrequency: 'weekly',
    }))

    return [...staticRoutes, ...blogRoutes]
}
