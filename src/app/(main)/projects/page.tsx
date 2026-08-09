import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { readStore } from '@/lib/store'
import ProjectsSection from '@/components/sections/ProjectsSection'

export const metadata: Metadata = buildMetadata({
  title: 'Projects — Mebratu Muhabaw',
  description: 'Browse all projects by Mebratu Muhabaw — web apps, mobile apps, AI solutions.',
  path: '/projects',
})

export const dynamic = 'force-dynamic'

export default function ProjectsPage() {
    const store = readStore()
    const projects = store.projects as any[]

    return (
        <div className="pt-20 min-h-screen">
            <section className="py-16 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">MY WORK</p>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">All Projects</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-lg mx-auto">
                            A collection of work spanning web apps, mobile apps, UI/UX design, and AI solutions.
                        </p>
                    </div>
                    <ProjectsSection projects={projects} showFilters={true} />
                </div>
            </section>
        </div>
    )
}
