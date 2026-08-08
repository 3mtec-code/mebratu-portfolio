/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Allow local /uploads/ path (dev fallback when Cloudinary isn't configured)
        localPatterns: [
            { pathname: '/uploads/**' },
        ],
        remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'via.placeholder.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: '**.supabase.co' },
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: blob: https:",
                            "connect-src 'self' https://api.cloudinary.com https://*.supabase.co https://vitals.vercel-insights.com",
                            "frame-src 'self' https://www.youtube.com https://www.google.com",
                        ].join('; '),
                    },
                ],
            },
            // Admin routes — no-index
            {
                source: '/mgmt-x7k2p9(.*)',
                headers: [
                    { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
                ],
            },
        ]
    },
}

export default nextConfig
