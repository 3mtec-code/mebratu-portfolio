import type { Metadata } from 'next'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://mebratumuhabaw.dev'

interface SeoProps {
    title: string
    description: string
    path?: string
    imageUrl?: string
    type?: 'website' | 'article' | 'profile'
    keywords?: string[]
}

export function buildMetadata({
    title,
    description,
    path = '/',
    imageUrl,
    type = 'website',
    keywords = [],
}: SeoProps): Metadata {
    const url = `${BASE_URL}${path}`
    const ogImage = imageUrl ?? `${BASE_URL}/og-default.png`

    return {
        title,
        description,
        keywords: ['Mebratu Muhabaw', 'Software Engineer', 'UI/UX Designer', 'Portfolio', ...keywords],
        authors: [{ name: 'Mebratu Muhabaw', url: BASE_URL }],
        creator: 'Mebratu Muhabaw',
        metadataBase: new URL(BASE_URL),
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            siteName: 'Mebratu Muhabaw — Portfolio',
            type,
            locale: 'en_US',
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
            creator: '@mebratudev',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        },
    }
}
