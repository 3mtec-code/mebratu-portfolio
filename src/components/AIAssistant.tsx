'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

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

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isOpen])

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/ai-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.content }),
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
                    content: "Sorry, something went wrong. Please try again later.",
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

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
                                <Bot className="w-5 h-5" />
                                <div>
                                    <p className="font-medium text-sm">AI Assistant</p>
                                    <p className="text-xs opacity-80">Ask about Mebratu</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
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
                                            'max-w-[85%] px-3 py-2 rounded-2xl text-sm',
                                            msg.role === 'assistant'
                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-none'
                                                : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none'
                                        )}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

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
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                    placeholder="Ask me anything..."
                                    className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                aria-label="Open AI assistant"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
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
