'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react'

// Dev-mode pre-fill — visible only in development build
const IS_DEV = process.env.NODE_ENV === 'development'
const DEV_EMAIL = 'admin@portfolio.com'
const DEV_PASSWORD = 'Admin@123456'

export default function LoginForm() {
    const [email, setEmail] = useState(IS_DEV ? DEV_EMAIL : '')
    const [password, setPassword] = useState(IS_DEV ? DEV_PASSWORD : '')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        setLoading(false)

        if (res?.ok) {
            // Hard-navigate so the session cookie is picked up by AdminShell
            window.location.href = '/mgmt-x7k2p9'
        } else {
            setError('Invalid email or password.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 px-4">
            <div className="w-full max-w-sm">

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Sign in to manage your portfolio
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="admin@portfolio.com"
                                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    tabIndex={-1}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Dev hint */}
                        {IS_DEV && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                                <span className="font-semibold">Dev mode — credentials pre-filled.</span>
                                <br />Just click <strong>Sign In</strong>.
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 text-center">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Signing in…
                                </span>
                            ) : 'Sign In'}
                        </button>

                    </form>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    This panel is not publicly accessible.
                </p>
            </div>
        </div>
    )
}
