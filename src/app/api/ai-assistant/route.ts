import { NextRequest, NextResponse } from 'next/server'
import { checkAIAssistantRateLimit } from '@/lib/rate-limit'
import { getAllData } from '@/lib/dal'

export async function POST(req: NextRequest) {
    try {
        // Rate limiting
        const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
        const { success } = await checkAIAssistantRateLimit(ip)
        if (!success) {
            return NextResponse.json(
                { message: "I'm receiving too many requests right now. Please try again in a minute." },
                { status: 429 }
            )
        }

        const { message } = await req.json()
        if (!message || typeof message !== 'string') {
            return NextResponse.json({ message: 'Please provide a valid message.' }, { status: 400 })
        }

        // Build context from Supabase data
        let systemPrompt = ''
        try {
            const store = await getAllData()
            const settings = store.siteSettings as any
            const projects = store.projects as any[]
            const skills = store.skills as any[]
            const certs = store.certificates as any[]
            const services = store.services as any[]

            const siteName = settings?.site_name || settings?.siteName || 'Mebratu Muhabaw'
            const email = settings?.email || 'mebratu@gmail.com'
            const location = settings?.location || 'Gondar, Ethiopia'
            const tagline = settings?.tagline || 'Software Engineer • UI/UX Designer'
            const startYear = Number(settings?.start_year || settings?.startYear || 2006)
            const years = new Date().getFullYear() - startYear

            systemPrompt = `You are an AI assistant for ${siteName}'s professional portfolio website.

ABOUT ${siteName.toUpperCase()}:
- Role: ${tagline}
- Location: ${location}
- Years of experience: ${years}+
- Email: ${email}
- Contact: /contact page on this website

SKILLS: ${skills.map((s: any) => `${s.name} (${s.percentage}%)`).join(', ')}

PROJECTS: ${projects.map((p: any) => `${p.title} (${p.category}): ${p.description}`).join(' | ')}

SERVICES: ${services.map((s: any) => s.title).join(', ')}

CERTIFICATES: ${certs.map((c: any) => `${c.title} from ${c.issuer}`).join(', ')}

INSTRUCTIONS:
- Answer ONLY questions about ${siteName}, his work, skills, and portfolio
- Be friendly, professional and concise (max 3 sentences)
- For contact/hiring: direct to the Contact page or email ${email}
- Do NOT answer off-topic questions (politics, other topics)
- If asked something unrelated: "I can only help with questions about ${siteName}'s portfolio."
- Respond in the same language the user writes in`

        } catch {
            systemPrompt = `You are an AI assistant for Mebratu Muhabaw's portfolio. He is a Full Stack Developer specializing in AI-powered applications, cybersecurity, and secure system architecture across Windows and Linux environments. Answer questions about his skills, projects, and how to contact him. Keep responses brief, professional, and accurate.`
        }

        // ── Try Groq (FREE — 14,400 requests/day, no credit card) ──────────────────
        const groqKey = process.env.GROQ_API_KEY
        if (groqKey) {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${groqKey}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant', // free, fast
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message },
                    ],
                    max_tokens: 200,
                    temperature: 0.7,
                }),
            })
            if (res.ok) {
                const data = await res.json()
                const reply = data.choices?.[0]?.message?.content ?? ''
                if (reply) return NextResponse.json({ message: reply })
            }
        }

        // ── Try OpenAI (paid) ───────────────────────────────────────────────────────
        const openaiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY
        if (openaiKey) {
            const res = await fetch(process.env.LLM_API_URL ?? 'https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`,
                },
                body: JSON.stringify({
                    model: process.env.LLM_MODEL ?? 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message },
                    ],
                    max_tokens: 200,
                    temperature: 0.7,
                }),
            })
            if (res.ok) {
                const data = await res.json()
                const reply = data.choices?.[0]?.message?.content ?? ''
                if (reply) return NextResponse.json({ message: reply })
            }
        }

        // ── Smart fallback (no API key needed) ─────────────────────────────────────
        const lowerMsg = message.toLowerCase()
        let fallback = "Hi! I'm Mebratu's AI assistant. I can answer questions about his skills, projects, and experience."

        if (lowerMsg.includes('contact') || lowerMsg.includes('hire') || lowerMsg.includes('work with')) {
            fallback = "You can reach Mebratu through the Contact page on this site, or email him directly at mebratu@gmail.com. He's available for new projects!"
        } else if (lowerMsg.includes('skill') || lowerMsg.includes('tech') || lowerMsg.includes('know')) {
            fallback = "Mebratu is proficient in React, Next.js, TypeScript, Node.js, Python, PostgreSQL, and MongoDB. He specializes in full-stack web development and UI/UX design."
        } else if (lowerMsg.includes('project') || lowerMsg.includes('work') || lowerMsg.includes('built')) {
            fallback = "Mebratu has built projects including AI-powered healthcare systems, learning management platforms, financial dashboards, and mobile apps. Visit the Projects page to see them all!"
        } else if (lowerMsg.includes('experience') || lowerMsg.includes('year') || lowerMsg.includes('long')) {
            fallback = "Mebratu has 18+ years of software engineering experience, with expertise in both frontend and backend development, plus UI/UX design."
        } else if (lowerMsg.includes('location') || lowerMsg.includes('where') || lowerMsg.includes('gondar')) {
            fallback = "Mebratu is based in Gondar, Ethiopia, and works with clients worldwide. He's available for remote collaboration globally."
        } else if (lowerMsg.includes('certificate') || lowerMsg.includes('award')) {
            fallback = "Mebratu holds Google Professional Cloud Developer and AWS Certified Solutions Architect certifications. Visit the Certificates page for the full list."
        }

        return NextResponse.json({ message: fallback })
    } catch (error) {
        console.error('[AI Assistant]', error)
        return NextResponse.json(
            { message: "I'm having trouble responding right now. Please try the contact form instead!" },
            { status: 500 }
        )
    }
}
