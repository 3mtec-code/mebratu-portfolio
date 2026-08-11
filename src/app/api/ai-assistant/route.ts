import { NextRequest, NextResponse } from 'next/server'
import { checkAIAssistantRateLimit } from '@/lib/rate-limit'
import { getAllData } from '@/lib/dal'

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

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

        const body = await req.json()

        // Support both single message (legacy) and conversation history
        const message: string = body.message
        const history: ChatMessage[] = Array.isArray(body.history) ? body.history : []

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ message: 'Please provide a valid message.' }, { status: 400 })
        }

        // Build rich context from database
        let systemPrompt = ''
        let contactEmail = 'mebratu@gmail.com'
        let siteName = 'Mebratu Muhabaw'

        try {
            const store = await getAllData()
            const settings = store.siteSettings as any
            const projects = (store.projects as any[]) ?? []
            const skills = (store.skills as any[]) ?? []
            const certs = (store.certificates as any[]) ?? []
            const services = (store.services as any[]) ?? []
            const awards = (store.awards as any[]) ?? []
            const timeline = (store.timeline as any[]) ?? []
            const testimonials = (store.testimonials as any[]) ?? []
            const blogPosts = (store.blogPosts as any[]) ?? []
            const socialLinks = (store.socialLinks as any[]) ?? []
            const heroStats = (store.heroStats as any[]) ?? []

            siteName = settings?.siteName || settings?.site_name || 'Mebratu Muhabaw'
            contactEmail = settings?.email || 'mebratu@gmail.com'
            const location = settings?.location || 'Gondar, Ethiopia'
            const tagline = settings?.tagline || 'Software Engineer • UI/UX Designer'
            const startYear = Number(settings?.startYear || settings?.start_year || 2006)
            const yearsExp = new Date().getFullYear() - startYear

            // Build social links string for contact fallback
            const socialStr = socialLinks.length > 0
                ? socialLinks.map((s: any) => `${s.platform}: ${s.url}`).join(' | ')
                : ''

            // Build hero stats string
            const statsStr = heroStats.length > 0
                ? heroStats.map((s: any) => `${s.label}: ${s.value}`).join(', ')
                : `${yearsExp}+ years of experience`

            // Build timeline / work history string
            const timelineStr = timeline.length > 0
                ? timeline.map((t: any) => `${t.year} — ${t.title}: ${t.description}`).join(' | ')
                : ''

            // Build awards string
            const awardsStr = awards.length > 0
                ? awards.map((a: any) => `${a.title} (${a.issuer}${a.issueDate ? ', ' + new Date(a.issueDate).getFullYear() : ''})`).join(', ')
                : ''

            // Build testimonials string (brief quotes)
            const testimonialsStr = testimonials.length > 0
                ? testimonials
                    .slice(0, 5)
                    .map((t: any) => `"${t.quote?.slice(0, 80)}..." — ${t.reviewerName}, ${t.reviewerRole}${t.reviewerCompany ? ' at ' + t.reviewerCompany : ''}`)
                    .join(' | ')
                : ''

            // Build blog posts string
            const blogStr = blogPosts.filter((b: any) => b.published).length > 0
                ? blogPosts
                    .filter((b: any) => b.published)
                    .slice(0, 5)
                    .map((b: any) => `"${b.title}" (tags: ${(b.tags ?? []).join(', ')})`)
                    .join(', ')
                : ''

            systemPrompt = `You are the official AI Assistant embedded in ${siteName}'s personal portfolio website.

ABOUT ${siteName.toUpperCase()}:
- Full name: ${siteName}
- Role: ${tagline}
- Location: ${location}
- Key stats: ${statsStr}
- Contact email: ${contactEmail}
- Contact page: /contact
${socialStr ? `- Social links: ${socialStr}` : ''}

SKILLS:
${skills.map((s: any) => `- ${s.name}${s.category ? ' [' + s.category + ']' : ''}: ${s.percentage}%`).join('\n')}

SERVICES OFFERED:
${services.map((s: any) => `- ${s.title}: ${s.description}`).join('\n')}

PROJECTS:
${projects.map((p: any) => `- ${p.title} [${p.category}]: ${p.description}${p.tags?.length ? ' | Tech: ' + p.tags.join(', ') : ''}${p.liveUrl ? ' | Live: ' + p.liveUrl : ''}`).join('\n')}

CERTIFICATES & EDUCATION:
${certs.map((c: any) => `- ${c.title} issued by ${c.issuer}${c.issueDate ? ' (' + new Date(c.issueDate).getFullYear() + ')' : ''}${c.description ? ': ' + c.description : ''}`).join('\n')}

${awardsStr ? `AWARDS & ACHIEVEMENTS:\n${awards.map((a: any) => `- ${a.title} from ${a.issuer}${a.description ? ': ' + a.description : ''}`).join('\n')}` : ''}

${timelineStr ? `WORK HISTORY & JOURNEY:\n${timeline.map((t: any) => `- ${t.year} — ${t.title}: ${t.description}`).join('\n')}` : ''}

${testimonialsStr ? `TESTIMONIALS FROM CLIENTS:\n${testimonials.slice(0, 5).map((t: any) => `- "${t.quote?.slice(0, 100)}..." — ${t.reviewerName}, ${t.reviewerRole}`).join('\n')}` : ''}

${blogStr ? `RECENT BLOG POSTS:\n${blogPosts.filter((b: any) => b.published).slice(0, 5).map((b: any) => `- "${b.title}"${b.excerpt ? ': ' + b.excerpt.slice(0, 80) : ''}`).join('\n')}` : ''}

===== STRICT BEHAVIOR RULES =====
1. Answer ONLY questions related to ${siteName}, their skills, projects, work history, services, certificates, awards, blog posts, or how to contact them.
2. If asked anything off-topic (general coding tutorials, math problems, news, history, recipes, or any topic unrelated to this portfolio), politely DECLINE and say: "I'm specialized to answer questions about ${siteName}'s portfolio. For anything else, feel free to reach out at ${contactEmail}."
3. NEVER invent, fabricate, or hallucinate any experience, project, credential, or fact not listed above.
4. If information is not in the provided data, say you don't have that detail and direct the visitor to contact ${siteName} directly at ${contactEmail}.
5. Tone: Professional, welcoming, clear, and confident — like a knowledgeable colleague introducing ${siteName}.
6. For contact / hiring inquiries: direct to the /contact page or ${contactEmail}.
7. Respond in the same language the user writes in.

===== FORMATTING RULES (ALWAYS FOLLOW) =====
- Use **bold** for names, titles, numbers, and key highlights.
- Use bullet lists with "* " for multiple items — never write them as a wall of text.
- Use "---" as a divider when separating major sections.
- Use "### " headings for section titles when the answer has multiple sections.
- Use "> blockquote" for client testimonial quotes.
- Use stats in a scannable format, e.g.:
  * ⭐ **Client Satisfaction:** 98%
  * 🏆 **Awards Won:** 15+
  * 📅 **Years Experience:** 18+
- Use relevant emojis sparingly (1–2 per response) to add warmth.
- Keep each response concise and visually structured — like a ChatGPT or Gemini response.
- NEVER return a wall of plain unformatted text.`

        } catch {
            // Minimal fallback if data fetch fails
            systemPrompt = `You are the AI assistant for ${siteName}'s portfolio website. Answer questions about their skills, projects, experience, and contact information only. Be professional, concise, and helpful. Decline off-topic questions politely.`
        }

        // Build message array — include conversation history for multi-turn context
        const historyMessages = history.slice(-8).map((m) => ({
            role: m.role,
            content: m.content,
        }))
        const allMessages = [
            ...historyMessages,
            { role: 'user' as const, content: message },
        ]

        // ── Try Groq (FREE — 14,400 requests/day) ─────────────────────────────────
        const groqKey = process.env.GROQ_API_KEY
        if (groqKey) {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${groqKey}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...allMessages,
                    ],
                    max_tokens: 300,
                    temperature: 0.6,
                }),
            })
            if (res.ok) {
                const data = await res.json()
                const reply = data.choices?.[0]?.message?.content ?? ''
                if (reply) return NextResponse.json({ message: reply })
            }
        }

        // ── Try OpenAI (paid fallback) ─────────────────────────────────────────────
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
                        ...allMessages,
                    ],
                    max_tokens: 300,
                    temperature: 0.6,
                }),
            })
            if (res.ok) {
                const data = await res.json()
                const reply = data.choices?.[0]?.message?.content ?? ''
                if (reply) return NextResponse.json({ message: reply })
            }
        }

        // ── Keyword-based static fallback (no API key needed) ─────────────────────
        const lowerMsg = message.toLowerCase()
        let fallback = `Hi! I'm ${siteName}'s AI assistant. Ask me about their skills, projects, experience, or how to get in touch!`

        if (lowerMsg.includes('contact') || lowerMsg.includes('hire') || lowerMsg.includes('work with') || lowerMsg.includes('available')) {
            fallback = `You can reach ${siteName} through the Contact page on this site, or email directly at ${contactEmail}. They're open to new projects and collaborations!`
        } else if (lowerMsg.includes('skill') || lowerMsg.includes('tech') || lowerMsg.includes('stack') || lowerMsg.includes('know')) {
            fallback = `${siteName} specializes in React, Next.js, TypeScript, Node.js, Python, and PostgreSQL — with expertise across full-stack development and UI/UX design. Check the Skills section on the homepage for the full breakdown.`
        } else if (lowerMsg.includes('project') || lowerMsg.includes('built') || lowerMsg.includes('portfolio')) {
            fallback = `${siteName} has built a range of projects including AI-powered web apps, dashboards, mobile apps, and design systems. Visit the Projects page for the full list with live links.`
        } else if (lowerMsg.includes('experience') || lowerMsg.includes('background') || lowerMsg.includes('journey') || lowerMsg.includes('history')) {
            fallback = `${siteName} has years of software engineering experience spanning full-stack web development, UI/UX design, and system architecture. Check the About page for the full timeline.`
        } else if (lowerMsg.includes('certificate') || lowerMsg.includes('certification') || lowerMsg.includes('education')) {
            fallback = `${siteName} holds several professional certifications. Visit the Certificates page for the complete list with verification links.`
        } else if (lowerMsg.includes('award') || lowerMsg.includes('achievement')) {
            fallback = `${siteName} has received notable awards and recognitions. Check the portfolio for details, or reach out at ${contactEmail} to learn more.`
        } else if (lowerMsg.includes('service') || lowerMsg.includes('offer') || lowerMsg.includes('freelance')) {
            fallback = `${siteName} offers services including web development, UI/UX design, and technical consulting. Contact them at ${contactEmail} to discuss your project.`
        } else if (lowerMsg.includes('blog') || lowerMsg.includes('article') || lowerMsg.includes('post')) {
            fallback = `${siteName} writes about software development, design, and technology. Visit the Blog page to read all published articles.`
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
