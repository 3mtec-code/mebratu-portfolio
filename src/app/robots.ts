import { MetadataRoute } from 'next'

const BASE = process.env.NEXTAUTH_URL ?? 'https://mebratumuhabaw.dev'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/mgmt-x7k2p9/',
                    '/api/',
                    '/_next/',
                ],
            },
        ],
        sitemap: `${BASE}/sitemap.xml`,
    }
}
