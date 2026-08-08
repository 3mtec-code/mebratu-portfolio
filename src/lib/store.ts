/**
 * JSON file store — local dev fallback.
 * Uses async fs for non-blocking I/O and a simple
 * write-lock to prevent race conditions on concurrent saves.
 */
import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'

const STORE_PATH = path.join(process.cwd(), 'data', 'store.json')

// ─── Simple write-lock ───────────────────────────────────────────────────────
let writeLock: Promise<void> = Promise.resolve()

// ─── Types ────────────────────────────────────────────────────────────────────
export type StoreRecord = Record<string, unknown>

export interface StoreData {
    siteSettings: StoreRecord
    heroProfile: StoreRecord
    heroStats: StoreRecord[]
    infoCards: StoreRecord[]
    skills: StoreRecord[]
    timeline: StoreRecord[]
    projects: StoreRecord[]
    certificates: StoreRecord[]
    awards: StoreRecord[]
    testimonials: StoreRecord[]
    pendingReviews: StoreRecord[]
    videos: StoreRecord[]
    services: StoreRecord[]
    socialLinks: StoreRecord[]
    blogPosts: StoreRecord[]
    navLinks: StoreRecord[]
    techStack: StoreRecord[]
    siteContent: StoreRecord
    footerSettings: StoreRecord
    translations: StoreRecord
}

type ListKey = {
    [K in keyof StoreData]: StoreData[K] extends StoreRecord[] ? K : never
}[keyof StoreData]

// ─── Defaults ─────────────────────────────────────────────────────────────────
export const DEFAULTS: StoreData = {
    siteSettings: {
        id: 'default',
        siteName: 'Mebratu Muhabaw',
    tagline:      'Full Stack Developer • AI & Cybersecurity',
        email: 'mebratu@example.com',
        phone: '+251 912 345 678',
        location: 'Gondar, Ethiopia',
        logoUrl: '',
        faviconUrl: '',
        cvUrl: '',
        startYear: 2006,
        onlineStatus: 'available',
    },
    heroProfile: { id: 'default', heroImageUrl: '', aboutImageUrl: '' },
    heroStats: [
        { id: '1', label: 'Years Experience', value: '18+', order: 0, autoCalc: 'yearsExperience' },
        { id: '2', label: 'Projects Completed', value: '0', order: 1, autoCalc: 'projectCount' },
        { id: '3', label: 'Certificates', value: '0', order: 2, autoCalc: 'certCount' },
        { id: '4', label: 'Awards Won', value: '15+', order: 3, autoCalc: null },
        { id: '5', label: 'Client Satisfaction', value: '98%', order: 4, autoCalc: null },
    ],
    infoCards: [
    { id: '2', title: 'Cybersecurity',          description: 'Secure architecture & penetration testing', icon: 'zap',   order: 1 },
    { id: '2', title: 'Cybersecurity',          description: 'Secure architecture & penetration testing', icon: 'zap',   order: 1 },
    { id: '3', title: 'AI Solutions',           description: 'Machine learning & automation',             icon: 'brain', order: 2 },
    { id: '4', title: 'Available for projects', description: 'Windows & Linux environments',              icon: 'check', order: 3 },
    ],
    skills: [
        { id: '1', name: 'React', percentage: 95, category: 'Frontend', order: 0 },
        { id: '2', name: 'Next.js', percentage: 92, category: 'Frontend', order: 1 },
        { id: '3', name: 'TypeScript', percentage: 90, category: 'Language', order: 2 },
        { id: '4', name: 'Node.js', percentage: 88, category: 'Backend', order: 3 },
        { id: '5', name: 'Tailwind CSS', percentage: 93, category: 'Frontend', order: 4 },
        { id: '6', name: 'Python', percentage: 85, category: 'Language', order: 5 },
        { id: '7', name: 'PostgreSQL', percentage: 87, category: 'Database', order: 6 },
        { id: '8', name: 'MongoDB', percentage: 85, category: 'Database', order: 7 },
    ],
    timeline: [
        { id: '1', year: '2006', title: 'Started Programming', description: 'Began learning software development', order: 0 },
        { id: '2', year: '2010', title: 'First Professional Role', description: 'Joined as Junior Developer', order: 1 },
        { id: '3', year: '2015', title: 'Senior Developer', description: 'Promoted to senior position', order: 2 },
        { id: '4', year: '2019', title: 'Information Systems Degree', description: 'Graduated from University of Gondar', order: 3 },
        { id: '5', year: '2021', title: 'Full Stack Lead', description: 'Leading development teams', order: 4 },
        { id: '6', year: '2024', title: 'Freelance Consultant', description: 'Building custom solutions worldwide', order: 5 },
    ],
    projects: [
        { id: '1', title: 'SmartCare AI', category: 'AI', featured: true, order: 0, coverImageUrl: '', tags: ['React', 'Python', 'TensorFlow'], liveUrl: '#', githubUrl: '#', description: 'AI-powered healthcare assistant.', longDescription: '' },
        { id: '2', title: 'EduHub Platform', category: 'Web Apps', featured: true, order: 1, coverImageUrl: '', tags: ['Next.js', 'TypeScript', 'Prisma'], liveUrl: '#', githubUrl: '#', description: 'Learning management system.', longDescription: '' },
        { id: '3', title: 'FinDash Analytics', category: 'Full Stack', featured: true, order: 2, coverImageUrl: '', tags: ['React', 'D3.js', 'Node.js'], liveUrl: '#', githubUrl: '#', description: 'Financial analytics dashboard.', longDescription: '' },
        { id: '4', title: 'TaskFlow App', category: 'Mobile Apps', featured: true, order: 3, coverImageUrl: '', tags: ['React Native', 'Firebase'], liveUrl: '#', githubUrl: '#', description: 'Team task management app.', longDescription: '' },
    ],
    certificates: [
        { id: '1', title: 'Google Professional Cloud Developer', issuer: 'Google Cloud', issueDate: '2023-06-01', order: 0, certificateImageUrl: '', verificationUrl: 'https://cloud.google.com/certification', description: '' },
        { id: '2', title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', issueDate: '2023-03-15', order: 1, certificateImageUrl: '', verificationUrl: 'https://aws.amazon.com/certification', description: '' },
    ],
    awards: [
        { id: '1', title: 'Best Student Developer', issuer: 'University of Gondar', issueDate: '2024-01-20', description: 'Awarded for outstanding performance', imageUrl: '', order: 0 },
        { id: '2', title: 'Innovation Award', issuer: 'Tech Summit 2023', issueDate: '2023-11-10', description: 'Recognized for innovative AI solution', imageUrl: '', order: 1 },
    ],
    testimonials: [
        { id: '1', reviewerName: 'Abebe Kebede', reviewerRole: 'CEO', reviewerCompany: 'EthioTech Solutions', reviewerImageUrl: '', quote: 'Mebratu is an exceptional developer. He delivers high-quality work on time.', rating: 5, order: 0, approved: true },
        { id: '2', reviewerName: 'Sarah Johnson', reviewerRole: 'Product Manager', reviewerCompany: 'StartupXYZ', reviewerImageUrl: '', quote: 'Working with Mebratu was a pleasure. He understood our vision beautifully.', rating: 5, order: 1, approved: true },
    ],
    pendingReviews: [],
    videos: [
        { id: '1', title: 'Building AI Projects with Next.js', description: 'Learn how to integrate AI APIs', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', duration: '15:42', order: 0 },
        { id: '2', title: 'My Developer Journey', description: 'Story & Experience', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', duration: '10:15', order: 1 },
        { id: '3', title: 'Full Stack Project Build', description: 'Step by Step Guide', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', duration: '32:05', order: 2 },
    ],
    services: [
        { id: '1', title: 'Web Development', description: 'Building beautiful, high-performance websites.', icon: 'code', order: 0 },
        { id: '2', title: 'UI/UX Design', description: 'Creating beautiful, intuitive user experiences.', icon: 'palette', order: 1 },
        { id: '3', title: 'Mobile App', description: 'Building cross-platform mobile applications.', icon: 'smartphone', order: 2 },
        { id: '4', title: 'AI Solutions', description: 'Intelligent solutions powered by AI.', icon: 'brain', order: 3 },
        { id: '5', title: 'Branding', description: 'Brand identity and visual design systems.', icon: 'megaphone', order: 4 },
        { id: '6', title: 'Consulting', description: 'Technical consulting and mentoring.', icon: 'barchart', order: 5 },
    ],
    socialLinks: [
        { id: '1', platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin', order: 0 },
        { id: '2', platform: 'GitHub', url: 'https://github.com', icon: 'github', order: 1 },
        { id: '3', platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter', order: 2 },
        { id: '4', platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram', order: 3 },
        { id: '5', platform: 'Email', url: 'mailto:mebratu@example.com', icon: 'mail', order: 4 },
    ],
    blogPosts: [],
    navLinks: [
        { id: '1', label: 'Home', href: '/', order: 0 },
        { id: '2', label: 'About', href: '/about', order: 1 },
        { id: '3', label: 'Projects', href: '/projects', order: 2 },
        { id: '4', label: 'Certificates', href: '/certificates', order: 3 },
        { id: '5', label: 'Videos', href: '/videos', order: 4 },
        { id: '6', label: 'Blog', href: '/blog', order: 5 },
        { id: '7', label: 'Contact', href: '/contact', order: 6 },
    ],
    techStack: [
        { id: '1', name: 'React', color: '#61DAFB', bg: '#E3F9FF', order: 0 },
        { id: '2', name: 'Next.js', color: '#000000', bg: '#F0F0F0', order: 1 },
        { id: '3', name: 'TypeScript', color: '#3178C6', bg: '#EBF3FD', order: 2 },
        { id: '4', name: 'Node.js', color: '#339933', bg: '#E8F8E8', order: 3 },
        { id: '5', name: 'Python', color: '#3776AB', bg: '#EBF3FD', order: 4 },
        { id: '6', name: 'PostgreSQL', color: '#336791', bg: '#EBF3FD', order: 5 },
        { id: '7', name: 'MongoDB', color: '#47A248', bg: '#E8F8E8', order: 6 },
        { id: '8', name: 'Tailwind', color: '#06B6D4', bg: '#E0F8FF', order: 7 },
        { id: '9', name: 'Figma', color: '#F24E1E', bg: '#FEF0EC', order: 8 },
        { id: '10', name: 'Docker', color: '#2496ED', bg: '#EBF5FD', order: 9 },
        { id: '11', name: 'AWS', color: '#FF9900', bg: '#FFF5E6', order: 10 },
        { id: '12', name: 'GraphQL', color: '#E10098', bg: '#FDE6F4', order: 11 },
    ],
    siteContent: {
        heroHeadline: 'I build digital products that make impact.',
    heroSubtext:           "Hi, I'm Mebratu - a Full Stack Software Developer specializing in AI-powered applications, secure system architecture, and cybersecurity across Windows and Linux (Ubuntu) environments.",
        heroCta1: 'Hire Me',
        heroCta2: 'View My Work',
        followMeLabel: 'Follow me on',
        featuredProjectsLabel: 'MY WORK',
        featuredProjectsTitle: 'Featured Projects',
        servicesLabel: 'WHAT I DO',
        servicesTitle: 'Services I Provide',
        contactLabel: "LET'S CONNECT",
        contactTitle: 'Get In Touch',
        contactFormNamePh: 'Your Name',
        contactFormEmailPh: 'Your Email',
        contactFormSubjPh: 'Subject',
        contactFormMsgPh: 'Your Message',
        contactFormBtn: 'Send Message',
        contactSuccessMsg: "✓ Message sent! I'll get back to you soon.",
        contactErrorMsg: 'Something went wrong. Please try again.',
        footerCopyright: 'All rights reserved.',
        reviewFormTitle: 'Leave a Review',
        reviewFormNamePh: 'Your Name',
        reviewFormRolePh: 'Your Role / Company',
        reviewFormQuotePh: 'Share your experience…',
        reviewFormBtn: 'Submit Review',
        reviewPendingMsg: 'Thank you! Your review is pending approval.',
        techStackLabel: 'Tech Stack',
        techStackTitle: 'Technologies I Use',
        availabilityBadge: 'Available for new opportunities',
        timelineTitle: 'My Journey',
        skillsTitle: 'Skills',
        videosTitle: 'Latest Videos',
        testimonialsTitle: 'What People Say',
        awardsTitle: 'Awards',
        certsTitle: 'Certificates',
    },
    footerSettings: {
        copyrightText: '',
        footerNote: "Let's build something great together.",
    },
    translations: {},
}

// ─── Computed Stats ───────────────────────────────────────────────────────────
export function computeStats(store: StoreData): StoreRecord[] {
    const now = new Date().getFullYear()
    const startYear = Number((store.siteSettings as any).startYear ?? 2006)
    const yearsExp = Math.max(0, now - startYear)
    const projectCount = (store.projects as StoreRecord[]).length
    const certCount = (store.certificates as StoreRecord[]).length

    return (store.heroStats as StoreRecord[]).map((stat) => {
        switch ((stat as any).autoCalc) {
            case 'yearsExperience': return { ...stat, value: `${yearsExp}+` }
            case 'projectCount': return { ...stat, value: String(projectCount) }
            case 'certCount': return { ...stat, value: String(certCount) }
            default: return stat
        }
    })
}

// ─── SYNC read (used in Server Components — file is small, acceptable) ────────
export function readStore(): StoreData {
    try {
        if (fs.existsSync(STORE_PATH)) {
            const raw = fs.readFileSync(STORE_PATH, 'utf8')
            const data = JSON.parse(raw) as Partial<StoreData>
            return { ...DEFAULTS, ...data }
        }
    } catch { /* corrupted — use defaults */ }
    return { ...DEFAULTS }
}

// ─── ASYNC read (use in API routes for non-blocking I/O) ─────────────────────
export async function readStoreAsync(): Promise<StoreData> {
    try {
        const raw = await fsp.readFile(STORE_PATH, 'utf8')
        const data = JSON.parse(raw) as Partial<StoreData>
        return { ...DEFAULTS, ...data }
    } catch {
        return { ...DEFAULTS }
    }
}

// ─── ASYNC write with lock (prevents race conditions) ────────────────────────
export async function writeStoreAsync(data: StoreData): Promise<void> {
    writeLock = writeLock.then(async () => {
        const dir = path.dirname(STORE_PATH)
        if (!fs.existsSync(dir)) await fsp.mkdir(dir, { recursive: true })
        await fsp.writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf8')
    })
    return writeLock
}

// ─── Sync write (kept for compatibility) ─────────────────────────────────────
export function writeStore(data: StoreData): void {
    const dir = path.dirname(STORE_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8')
}

// ─── Update a top-level key (async) ──────────────────────────────────────────
export async function updateStoreKeyAsync(key: keyof StoreData, value: unknown): Promise<void> {
    const store = await readStoreAsync()
        ; (store as any)[key] = value
    await writeStoreAsync(store)
}

// ─── Sync version (kept for compatibility) ───────────────────────────────────
export function updateStoreKey(key: keyof StoreData, value: unknown): void {
    const store = readStore()
        ; (store as any)[key] = value
    writeStore(store)
}

// ─── Upsert one item into a list (async) ─────────────────────────────────────
export async function upsertItemAsync(key: ListKey, item: StoreRecord): Promise<StoreRecord> {
    const store = await readStoreAsync()
    const list = store[key] as StoreRecord[]
    const idx = list.findIndex((x) => x.id === item.id)
    if (idx >= 0) list[idx] = item
    else list.push(item)
    store[key] = list
    await writeStoreAsync(store)
    return item
}

// ─── Sync upsert (kept for compatibility) ────────────────────────────────────
export function upsertItem(key: ListKey, item: StoreRecord): StoreRecord {
    const store = readStore()
    const list = store[key] as StoreRecord[]
    const idx = list.findIndex((x) => x.id === item.id)
    if (idx >= 0) list[idx] = item
    else list.push(item)
    store[key] = list
    writeStore(store)
    return item
}

// ─── Delete one item (async) ──────────────────────────────────────────────────
export async function deleteItemAsync(key: ListKey, id: string): Promise<void> {
    const store = await readStoreAsync()
    store[key] = (store[key] as StoreRecord[]).filter((x) => x.id !== id)
    await writeStoreAsync(store)
}

// ─── Sync delete (kept for compatibility) ────────────────────────────────────
export function deleteItem(key: ListKey, id: string): void {
    const store = readStore()
    store[key] = (store[key] as StoreRecord[]).filter((x) => x.id !== id)
    writeStore(store)
}
