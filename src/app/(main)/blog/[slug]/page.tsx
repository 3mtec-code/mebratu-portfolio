import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { readStore } from '@/lib/store'
import { formatDate, calcReadingTime } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

// ISR: rebuild cached page every hour; admin saves bust this immediately via revalidatePath()
export const revalidate = 3600

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const store = readStore()
    const post = (store.blogPosts as any[]).find((p) => p.slug === params.slug)
    if (!post) return { title: 'Post Not Found' }
    return { title: post.title, description: post.excerpt }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const store = readStore()
    const post = (store.blogPosts as any[]).find((p) => p.slug === params.slug && p.published)
    if (!post) notFound()

    return (
        <div className="pt-20 min-h-screen">
            <article className="py-16 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(post.tags || []).map((tag: string) => (
                            <span key={tag} className="px-3 py-1 text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full">{tag}</span>
                        ))}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-8">
                        <span>{post.author || 'Mebratu Muhabaw'}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt || new Date())}</span>
                        <span>•</span>
                        <span>{post.read_time_min || calcReadingTime(post.content || '')} min read</span>
                    </div>
                    {post.coverImageUrl && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-10">
                            <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover"
                                unoptimized={post.coverImageUrl?.startsWith('/')} />
                        </div>
                    )}
                    <div
                        className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: post.content || '' }}
                    />
                </div>
            </article>
        </div>
    )
}
