'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Tag, ArrowRight } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { cn } from '@/lib/utils'

interface Project {
    id: string
    title: string
    description: string
    longDescription?: string
    coverImageUrl?: string
    cover_image_url?: string
    category: string
    tags: string[]
    liveUrl?: string | null
    live_url?: string | null
    githubUrl?: string | null
    github_url?: string | null
    featured?: boolean
}

interface CaseStudyModalProps {
    project: Project | null
    onClose: () => void
}

export default function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [onClose])

    // Prevent body scroll when open
    useEffect(() => {
        if (project) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [project])

    if (!project) return null

    const coverImage = project.coverImageUrl || project.cover_image_url || ''
    const liveUrl = project.liveUrl || project.live_url || ''
    const githubUrl = project.githubUrl || project.github_url || ''
    const longDesc = project.longDescription || project.description

    return (
        <AnimatePresence>
            {project && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header image */}
                        <div className="relative h-52 shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
                            {coverImage ? (
                                <Image
                                    src={coverImage}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                    unoptimized={coverImage.startsWith('/')}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-6xl font-bold text-indigo-200 dark:text-indigo-700">
                                        {project.title.charAt(0)}
                                    </span>
                                </div>
                            )}

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                            {/* Category badge */}
                            <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold bg-white/90 dark:bg-gray-900/90 text-indigo-600 dark:text-indigo-400 rounded-full">
                                {project.category}
                            </span>

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-xl transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{project.description}</p>
                            </div>

                            {/* Tags */}
                            {project.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag}
                                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-900">
                                            <Tag className="w-3 h-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Long description */}
                            {longDesc && longDesc !== project.description && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                        <ArrowRight className="w-4 h-4 text-indigo-500" />
                                        About this project
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{longDesc}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer actions */}
                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                            {liveUrl && liveUrl !== '#' && (
                                <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all">
                                    <ExternalLink className="w-4 h-4" />
                                    View Live
                                </a>
                            )}
                            {githubUrl && githubUrl !== '#' && (
                                <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
                                    <FaGithub className="w-4 h-4" />
                                    GitHub
                                </a>
                            )}
                            {(!liveUrl || liveUrl === '#') && (!githubUrl || githubUrl === '#') && (
                                <button onClick={onClose}
                                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    Close
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
