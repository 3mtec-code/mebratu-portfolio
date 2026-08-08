export type Locale = 'en'

export const LOCALES: { code: Locale; label: string; nativeLabel: string; flag: string }[] = [
    { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
]

export type TranslationKey = keyof typeof defaultTranslations.en

export const defaultTranslations = {
    en: {
        nav_home: 'Home',
        nav_about: 'About',
        nav_projects: 'Projects',
        nav_certificates: 'Certificates',
        nav_videos: 'Videos',
        nav_blog: 'Blog',
        nav_contact: 'Contact',
        nav_download_cv: 'Download CV',
        nav_lets_talk: "Let's Talk",

        hero_available: 'Available for new opportunities',
        hero_headline: 'I build digital products that make impact.',
        hero_subtext: "Hi, I'm Mebratu. I design and develop modern, scalable web & mobile experiences.",
        hero_cta1: 'Hire Me',
        hero_cta2: 'View My Work',
        hero_follow_me: 'Follow me on',

        section_journey: 'My Journey',
        section_skills: 'Skills',
        section_projects: 'Featured Projects',
        section_projects_label: 'MY WORK',
        section_services: 'Services I Provide',
        section_services_label: 'WHAT I DO',
        section_certs: 'Certificates',
        section_awards: 'Awards',
        section_testimonials: 'What People Say',
        section_videos: 'Latest Videos',
        section_tech: 'Technologies I Use',
        section_tech_label: 'Tech Stack',

        contact_label: "LET'S CONNECT",
        contact_title: 'Get In Touch',
        contact_email: 'Email',
        contact_phone: 'Phone',
        contact_location: 'Location',
        contact_follow: 'Follow me',
        contact_name_ph: 'Your Name',
        contact_email_ph: 'Your Email',
        contact_subject_ph: 'Subject',
        contact_message_ph: 'Your Message',
        contact_send: 'Send Message',
        contact_success: "✓ Message sent! I'll get back to you soon.",
        contact_error: 'Something went wrong. Please try again.',

        review_title: 'Leave a Review',
        review_name_ph: 'Your Name',
        review_role_ph: 'Your Role / Company',
        review_quote_ph: 'Share your experience…',
        review_submit: 'Submit Review',
        review_pending: 'Thank you! Your review is pending approval.',

        footer_rights: 'All rights reserved.',
        footer_note: "Let's build something great together.",

        status_available: 'Available for work',
        status_busy: 'Currently busy',
        status_offline: 'Not available right now',

        view_all_projects: 'View All Projects',
        view_all_skills: 'View All Skills',
        view_all_timeline: 'View Full Timeline',
        view_all_services: 'View All Services',
        view_all_videos: 'View All Videos',
        view_all: 'View All',
    },
} as const
