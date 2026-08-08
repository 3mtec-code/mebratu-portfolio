import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { readStore } from '@/lib/store'
import { Play } from 'lucide-react'

export const metadata: Metadata = buildMetadata({
  title: 'Videos — Mebratu Muhabaw',
  description: 'Watch tutorials and project showcases from Mebratu Muhabaw.',
  path: '/videos',
})

export const dynamic = 'force-dynamic'

export default function VideosPage() {
    const store = readStore()
    const videos = store.videos as any[]

    return (
        <div className="pt-20 min-h-screen">
            <section className="py-16 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">MEDIA</p>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Videos</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-lg mx-auto">
                            Tutorials, talks, and project showcases.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <div key={video.id} id={video.id}
                                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                                {video.videoUrl?.includes('youtube.com') || video.videoUrl?.includes('youtu.be') ? (
                                    <div className="relative aspect-video">
                                        <iframe
                                            src={video.videoUrl.replace('watch?v=', 'embed/')}
                                            title={video.title}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <div className="relative aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                                        <Play className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{video.title}</h3>
                                    {video.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{video.description}</p>}
                                    {video.duration && <p className="text-xs text-gray-400 mt-2">{video.duration}</p>}
                                </div>
                            </div>
                        ))}
                        {videos.length === 0 && (
                            <div className="col-span-3 text-center py-16">
                                <Play className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">No videos yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
