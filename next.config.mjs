/** @type {import('next').NextConfig} */
const nextConfig = {
    // Clean previous build output completely
    cleanDistDir: true,

    images: {
        // Cache optimized images for 24 hours on Vercel's edge
        minimumCacheTTL: 86400,
        // Serve modern image formats (avif first, then webp) — smaller file sizes
        formats: ['image/avif', 'image/webp'],
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
            { protocol: 'https', hostname: 'upload.wikimedia.org' },
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
                ],
            },
            {
                source: '/mgmt-x7k2p9(.*)',
                headers: [
                    { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
                ],
            },
            {
                // Public API routes (not admin) — cache at CDN edge for 1 hour,
                // serve stale while revalidating in background for up to 24 hours
                source: '/api/((?!admin|auth).*)',
                headers: [
                    { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
                ],
            },
        ]
    },
}

export default nextConfig
