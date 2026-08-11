'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

// Suggested questions shown on first open
const SUGGESTED_QUESTIONS = [
    'What projects has he built?',
    'What are his top skills?',
    'How can I hire him?',
    'Does he have certifications?',
]

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm Mebratu's AI assistant. Ask me anything about his skills, projects, experience, or how to get in touch! 👋",
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Scroll to bottom whenever messages update
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isOpen])

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 150)
        }
    }, [isOpen])

    const sendMessage = async (text?: string) => {
        const content = (text ?? input).trim()
        if (!content || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
        }

        const updatedMessages = [...messages, userMessage]
        setMessages(updatedMessages)
        setInput('')
        setIsLoading(true)

        // Build conversation history to send (exclude the initial greeting, last 8 turns)
        const history = updatedMessages
            .slice(1) // skip the initial greeting
            .slice(-9, -1) // last 8 messages before the current one
            .map(({ role, content }) => ({ role, content }))

        try {
            const res = await fetch('/api/ai-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content, history }),
            })

            const data = await res.json()

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.message || "I'm sorry, I couldn't process that. Please try again.",
                },
            ])
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'Sorry, something went wrong. Please try again later.',
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    // Show suggested questions only when there's just the greeting
    const showSuggestions = messages.length === 1 && isOpen

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Bot className="w-5 h-5" />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">AI Assistant</p>
                                    <p className="text-xs opacity-80">Ask about Mebratu</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-72 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : '')}
                                >
                                    <div className={cn(
                                        'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1',
                                        msg.role === 'assistant'
                                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                    )}>
                                        {msg.role === 'assistant' ? (
                                            <Bot className="w-3 h-3 text-white" />
                                        ) : (
                                            <User className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                        )}
                                    </div>
                                    <div
                                        className={cn(
                                            'max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed',
                                            msg.role === 'assistant'
                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-none'
                                                : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none'
                                        )}
                                    >
                                        {msg.role === 'assistant' ? (
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                                                    ul: ({ children }) => <ul className="mt-1 mb-1.5 space-y-0.5 list-none pl-0">{children}</ul>,
                                                    ol: ({ children }) => <ol className="mt-1 mb-1.5 space-y-0.5 list-decimal pl-4">{children}</ol>,
                                                    li: ({ children }) => (
                                                        <li className="flex items-start gap-1.5">
                                                            <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500" />
                                                            <span>{children}</span>
                                                        </li>
                                                    ),
                                                    strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                                                    em: ({ children }) => <em className="italic">{children}</em>,
                                                    h3: ({ children }) => <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-2 mb-1">{children}</h3>,
                                                    h4: ({ children }) => <h4 className="font-semibold text-gray-900 dark:text-gray-100 mt-1.5 mb-0.5">{children}</h4>,
                                                    a: ({ href, children }) => (
                                                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-500 dark:text-indigo-400 underline hover:text-indigo-700">
                                                            {children}
                                                        </a>
                                                    ),
                                                    hr: () => <hr className="border-gray-200 dark:border-gray-700 my-2" />,
                                                    blockquote: ({ children }) => (
                                                        <blockquote className="border-l-2 border-indigo-400 pl-2 italic text-gray-500 dark:text-gray-400 my-1">
                                                            {children}
                                                        </blockquote>
                                                    ),
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isLoading && (
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                                        <Bot className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                                                    style={{ animationDelay: `${i * 150}ms` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Suggested questions — shown only on first open */}
                            {showSuggestions && !isLoading && (
                                <div className="pt-1 space-y-1.5">
                                    {SUGGESTED_QUESTIONS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => sendMessage(q)}
                                            className="block w-full text-left text-xs px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                    placeholder="Ask me anything..."
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors disabled:opacity-60"
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Send message"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow"
                aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ scale: 0.5, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.5 }}>
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                            <MessageCircle className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}
