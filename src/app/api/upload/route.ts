import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import path from 'path'
import fs from 'fs/promises'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

// ─── Cloudinary upload ────────────────────────────────────────────────────────
async function uploadToCloudinary(file: File): Promise<string> {
    const { v2: cloudinary } = await import('cloudinary')
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: 'portfolio', resource_type: 'auto' }, (err, result) => {
                if (err || !result) reject(err ?? new Error('No result'))
                else resolve(result.secure_url)
            })
            .end(buffer)
    })
}

// ─── Local filesystem fallback ────────────────────────────────────────────────
// Saves to /public/uploads/ and returns a relative URL usable by next/image
async function saveLocally(file: File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const ext = file.name.split('.').pop() ?? 'jpg'
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const dest = path.join(uploadDir, name)

    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(dest, buffer)

    return `/uploads/${name}`
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        // Auth check
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG` },
                { status: 400 }
            )
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'File too large. Maximum size: 10 MB' }, { status: 400 })
        }

        let url: string

        // Use Cloudinary if fully configured, otherwise save locally
        const hasCloudinary =
            process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET &&
            process.env.CLOUDINARY_CLOUD_NAME !== 'demo'

        if (hasCloudinary) {
            url = await uploadToCloudinary(file)
            console.log('[Upload] Cloudinary upload successful:', url)
        } else {
            // Local fallback — works in dev without any external account
            url = await saveLocally(file)
        }

        return NextResponse.json({ url })
    } catch (error) {
        console.error('[Upload] error:', error)
        return NextResponse.json(
            { error: 'Upload failed. Please try again.' },
            { status: 500 }
        )
    }
}
