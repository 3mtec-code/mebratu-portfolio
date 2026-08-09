import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { readStore } from '@/lib/store'
import { formatDate } from '@/lib/utils'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
    title: 'Blog — Mebratu Muhabaw',
    description: 'Read articles on software engineering, design and technology.',
    path: '/blog',
})

export const dynamic = 'force-dynamic'

export default function BlogPage() {
    const store = readStore()
    const posts = (store.blogPosts as any[]).filter((p) => p.published)

    return (
        <div className="pt-20 min-h-screen">
            <section className="py-16 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">BLOG</p>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Latest Articles</h1>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`}
                                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all">
                                {post.coverImageUrl && (
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image src={post.coverImageUrl} alt={post.title} fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized={post.coverImageUrl?.startsWith('/')} />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {(post.tags || []).slice(0, 2).map((tag: string) => (
                                            <span key={tag} className="px-2 py-0.5 text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                    <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{post.title}</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-4">
                                        <span>{post.author || 'Mebratu Muhabaw'}</span>
                                        <span>•</span>
                                        <span>{formatDate(post.createdAt || new Date())}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {posts.length === 0 && (
                            <div className="col-span-3 text-center py-16 text-gray-500 dark:text-gray-400">No posts published yet.</div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
