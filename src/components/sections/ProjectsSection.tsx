'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ArrowUpRight } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { cn } from '@/lib/utils'
import CaseStudyModal from '@/components/CaseStudyModal'

interface Project {
    id: string
    title: string
    description: string
    coverImageUrl: string
    category: string
    tags: string[]
    liveUrl?: string | null
    githubUrl?: string | null
    featured: boolean
}

interface ProjectsSectionProps {
    projects?: Project[]
    showFilters?: boolean
    limit?: number
}

const categories = ['All', 'Web Apps', 'Mobile Apps', 'UI/UX', 'AI', 'Full Stack']

export default function ProjectsSection({ projects = [], showFilters = true, limit }: ProjectsSectionProps) {
    const [activeCategory, setActiveCategory] = useState('All')
    const [selectedProject, setSelectedProject] = useState<any>(null)

    const filtered = activeCategory === 'All'
        ? projects
        : projects.filter((p) => p.category === activeCategory)

    const displayed = limit ? filtered.slice(0, limit) : filtered

    return (
        <section className="py-16">
            {/* Filter Tabs */}
            {showFilters && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                                activeCategory === cat
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                    <Link
                        href="/projects"
                        className="ml-auto flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        View All Projects
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {/* Project Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {displayed.map((project, index) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            onClick={() => setSelectedProject(project)} style={{ cursor: "pointer" }} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800"
                        >
                            {/* Cover Image */}
                            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
                                {project.coverImageUrl ? (
                                    <Image
                                        src={project.coverImageUrl}
                                        alt={project.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        unoptimized={project.coverImageUrl.startsWith('/')}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-indigo-300 dark:text-indigo-600">
                                            {project.title.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                {/* Category tag */}
                                <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-white/90 dark:bg-gray-900/90 text-indigo-600 rounded-full">
                                    {project.category}
                                </span>
                                {/* Action icons on hover */}
                                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white rounded-full shadow-md hover:bg-indigo-50 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink className="w-4 h-4 text-gray-700" />
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white rounded-full shadow-md hover:bg-indigo-50 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <FaGithub className="w-4 h-4 text-gray-700" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{project.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>

                                {/* Tags */}
                                {project.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {project.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Links */}
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                                    {project.liveUrl ? (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Live
                                        </a>
                                    ) : null}
                                    {project.githubUrl ? (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            <FaGithub className="w-3 h-3" />
                                            GitHub
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <CaseStudyModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      {/* Empty state */}
            {displayed.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400">No projects found in this category.</p>
                </div>
            )}
        </section>
    )
}
