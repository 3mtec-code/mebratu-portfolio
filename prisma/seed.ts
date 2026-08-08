import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { hash } from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Seeding database...')

    // Create admin user
    const hashedPassword = await hash('Admin@123456', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@portfolio.com' },
        update: {},
        create: {
            email: 'admin@portfolio.com',
            name: 'Admin',
            password: hashedPassword,
        },
    })
    console.log('✓ Created admin user')

    // Site Settings
    const siteSettings = await prisma.siteSettings.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            logoUrl: 'https://via.placeholder.com/48x48/6366f1/ffffff?text=M',
            faviconUrl: 'https://via.placeholder.com/32x32/6366f1/ffffff?text=M',
            siteName: 'Mebratu Muhabaw',
            tagline: 'Software Engineer • UI/UX Designer',
            email: 'mebratu@example.com',
            phone: '+251 912 345 678',
            location: 'Gondar, Ethiopia',
            cvUrl: '/cv/mebratu-muhabaw-cv.pdf',
        },
    })
    console.log('✓ Created site settings')

    // Hero Profile
    await prisma.heroProfile.create({
        data: {
            heroImageUrl: 'https://via.placeholder.com/400x500/6366f1/ffffff?text=Hero+Photo',
            aboutImageUrl: 'https://via.placeholder.com/400x500/6366f1/ffffff?text=About+Photo',
        },
    })
    console.log('✓ Created hero profile')

    // Social Links
    const socialLinks = [
        { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin', order: 0 },
        { platform: 'GitHub', url: 'https://github.com', icon: 'github', order: 1 },
        { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter', order: 2 },
        { platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram', order: 3 },
        { platform: 'Email', url: 'mailto:mebratu@example.com', icon: 'mail', order: 4 },
        { platform: 'Dribbble', url: 'https://dribbble.com', icon: 'dribbble', order: 5 },
    ]
    await prisma.socialLink.createMany({ data: socialLinks })
    console.log('✓ Created social links')

    // Hero Stats
    const stats = [
        { label: 'Years Experience', value: '30+', order: 0 },
        { label: 'Projects Completed', value: '120+', order: 1 },
        { label: 'Certificates', value: '55+', order: 2 },
        { label: 'Awards Won', value: '15+', order: 3 },
        { label: 'Client Satisfaction', value: '98%', order: 4 },
    ]
    await prisma.heroStat.createMany({ data: stats })
    console.log('✓ Created hero stats')

    // Info Cards
    const infoCards = [
        { title: 'UI/UX Designer', description: 'Designing delightful experiences', icon: 'palette', order: 0 },
        { title: 'Full Stack Developer', description: 'Building scalable applications', icon: 'code', order: 1 },
        { title: 'Problem Solver', description: 'Turning ideas into solutions', icon: 'zap', order: 2 },
        { title: 'Available', description: 'Open for new projects', icon: 'check', order: 3 },
    ]
    await prisma.infoCard.createMany({ data: infoCards })
    console.log('✓ Created info cards')

    // Skills
    const skills = [
        { name: 'React', percentage: 95, category: 'Frontend', order: 0 },
        { name: 'Next.js', percentage: 92, category: 'Frontend', order: 1 },
        { name: 'TypeScript', percentage: 90, category: 'Language', order: 2 },
        { name: 'Node.js', percentage: 88, category: 'Backend', order: 3 },
        { name: 'Tailwind CSS', percentage: 93, category: 'Frontend', order: 4 },
        { name: 'Python', percentage: 85, category: 'Language', order: 5 },
        { name: 'PostgreSQL', percentage: 87, category: 'Database', order: 6 },
        { name: 'MongoDB', percentage: 85, category: 'Database', order: 7 },
    ]
    await prisma.skill.createMany({ data: skills })
    console.log('✓ Created skills')

    // Timeline
    const timeline = [
        { year: '2006', title: 'Started Programming', description: 'Began learning software development', order: 0 },
        { year: '2010', title: 'First Professional Role', description: 'Joined as Junior Developer', order: 1 },
        { year: '2015', title: 'Senior Developer', description: 'Promoted to senior position', order: 2 },
        { year: '2019', title: 'Information Systems Degree', description: 'Graduated from University of Gondar', order: 3 },
        { year: '2020', title: 'Full Stack Lead', description: 'Leading development teams', order: 4 },
        { year: '2024', title: 'Freelance Consultant', description: 'Building custom solutions worldwide', order: 5 },
    ]
    await prisma.timelineEntry.createMany({ data: timeline })
    console.log('✓ Created timeline')

    // Projects
    const projects = [
        {
            title: 'HealthCare AI',
            description: 'AI-powered healthcare management system',
            longDescription: 'Complete healthcare platform with AI diagnostics',
            coverImageUrl: 'https://via.placeholder.com/600x400/3b82f6/ffffff?text=HealthCare+AI',
            category: 'AI',
            tags: ['React', 'Python', 'TensorFlow', 'PostgreSQL'],
            liveUrl: 'https://example.com',
            githubUrl: 'https://github.com',
            featured: true,
            order: 0,
        },
        {
            title: 'EduHub Platform',
            description: 'Educational platform for online learning',
            coverImageUrl: 'https://via.placeholder.com/600x400/6366f1/ffffff?text=EduHub',
            category: 'Web Apps',
            tags: ['Next.js', 'TypeScript', 'Prisma'],
            liveUrl: 'https://example.com',
            githubUrl: null,
            featured: true,
            order: 1,
        },
        {
            title: 'E-Commerce Mobile',
            description: 'Cross-platform shopping app',
            coverImageUrl: 'https://via.placeholder.com/600x400/8b5cf6/ffffff?text=E-Commerce',
            category: 'Mobile Apps',
            tags: ['React Native', 'Firebase'],
            liveUrl: null,
            githubUrl: 'https://github.com',
            featured: true,
            order: 2,
        },
        {
            title: 'Dashboard UI Kit',
            description: 'Premium dashboard design system',
            coverImageUrl: 'https://via.placeholder.com/600x400/14b8a6/ffffff?text=Dashboard+UI',
            category: 'UI/UX',
            tags: ['Figma', 'Design System'],
            liveUrl: 'https://example.com',
            githubUrl: null,
            featured: true,
            order: 3,
        },
    ]
    await prisma.project.createMany({ data: projects })
    console.log('✓ Created projects')

    // Certificates
    const certificates = [
        {
            title: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            issueDate: new Date('2023-06-01'),
            verificationUrl: 'https://aws.amazon.com/verification/SAMPLE',
            certificateImageUrl: 'https://via.placeholder.com/800x600/232f3e/ffffff?text=AWS+Certificate',
            order: 0,
        },
        {
            title: 'Google Cloud Professional',
            issuer: 'Google Cloud',
            issueDate: new Date('2023-03-15'),
            verificationUrl: 'https://cloud.google.com/certification/verify/SAMPLE',
            certificateImageUrl: 'https://via.placeholder.com/800x600/4285f4/ffffff?text=Google+Cloud',
            order: 1,
        },
    ]
    await prisma.certificate.createMany({ data: certificates })
    console.log('✓ Created certificates')

    // Awards
    const awards = [
        {
            title: 'Best Student Developer',
            issuer: 'University of Gondar',
            issueDate: new Date('2024-01-20'),
            description: 'Awarded for outstanding performance in software engineering',
            order: 0,
        },
        {
            title: 'Innovation Award',
            issuer: 'Tech Summit 2023',
            issueDate: new Date('2023-11-10'),
            description: 'Recognized for innovative AI healthcare solution',
            order: 1,
        },
    ]
    await prisma.award.createMany({ data: awards })
    console.log('✓ Created awards')

    // Testimonials
    const testimonials = [
        {
            reviewerName: 'John Doe',
            reviewerRole: 'CEO',
            reviewerCompany: 'Tech Corp',
            reviewerImageUrl: 'https://via.placeholder.com/100x100/6366f1/ffffff?text=JD',
            quote: 'Mebratu delivered an exceptional product. His attention to detail and technical expertise are unmatched.',
            rating: 5,
            order: 0,
        },
        {
            reviewerName: 'Jane Smith',
            reviewerRole: 'Product Manager',
            reviewerCompany: 'StartupXYZ',
            quote: 'Working with Mebratu was a pleasure. He understood our vision and brought it to life beautifully.',
            rating: 5,
            order: 1,
        },
    ]
    await prisma.testimonial.createMany({ data: testimonials })
    console.log('✓ Created testimonials')

    // Videos
    const videos = [
        {
            title: 'Building AI Projects with Next.js',
            description: 'Learn how to integrate AI APIs into your Next.js applications',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://via.placeholder.com/320x180/ff0000/ffffff?text=Video+1',
            duration: '15:42',
            order: 0,
        },
        {
            title: 'Design Systems in Figma',
            description: 'Creating reusable components in Figma',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '22:15',
            order: 1,
        },
    ]
    await prisma.video.createMany({ data: videos })
    console.log('✓ Created videos')

    // Services
    const services = [
        { title: 'Web Development', description: 'Full-stack web applications', icon: 'code', order: 0 },
        { title: 'UI/UX Design', description: 'User-centered design solutions', icon: 'palette', order: 1 },
        { title: 'Mobile App', description: 'Cross-platform mobile apps', icon: 'smartphone', order: 2 },
        { title: 'AI Solutions', description: 'Machine learning integration', icon: 'brain', order: 3 },
        { title: 'Branding', description: 'Brand identity and strategy', icon: 'megaphone', order: 4 },
        { title: 'Consulting', description: 'Technical advisory services', icon: 'barchart', order: 5 },
    ]
    await prisma.service.createMany({ data: services })
    console.log('✓ Created services')

    // Blog Posts
    const posts = [
        {
            title: 'Getting Started with Next.js 14',
            slug: 'getting-started-nextjs-14',
            excerpt: 'Learn the fundamentals of Next.js 14 and its new App Router',
            content: '<h2>Introduction</h2><p>Next.js 14 brings exciting new features...</p>',
            published: true,
            tags: ['Next.js', 'React', 'Tutorial'],
            coverImageUrl: 'https://via.placeholder.com/800x400/000000/ffffff?text=Next.js+14',
            author: 'Mebratu Muhabaw',
        },
    ]
    await prisma.blogPost.createMany({ data: posts })
    console.log('✓ Created blog posts')

    console.log('✅ Database seeded successfully!')
    console.log('\nAdmin credentials:')
    console.log('Email: admin@portfolio.com')
    console.log('Password: Admin@123456')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
