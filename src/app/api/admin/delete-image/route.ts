import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Extract public_id from a Cloudinary URL
// e.g. https://res.cloudinary.com/Mebratu/image/upload/v123/portfolio/abc.jpg → portfolio/abc
function extractPublicId(url: string): string {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/)
    return match ? match[1] : ''
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { url } = await req.json()
        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
        }

        // Only delete from Cloudinary — ignore local /uploads/ paths
        if (!url.includes('res.cloudinary.com')) {
            return NextResponse.json({ success: true, note: 'Local file — not deleted from Cloudinary' })
        }

        const publicId = extractPublicId(url)
        if (!publicId) {
            return NextResponse.json({ error: 'Could not extract public_id from URL' }, { status: 400 })
        }

        const result = await cloudinary.uploader.destroy(publicId)
        return NextResponse.json({ success: true, result })
    } catch (error) {
        console.error('[Delete image]', error)
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
}
