/**
 * Normalize Supabase snake_case rows to camelCase
 * so components don't need to know which backend is active.
 */
export function normalizeSiteSettings(row: Record<string, unknown>) {
    if (!row) return row
    return {
        id: row.id,
        siteName: row.site_name ?? row.siteName,
        tagline: row.tagline,
        email: row.email,
        phone: row.phone,
        location: row.location,
        logoUrl: row.logo_url ?? row.logoUrl,
        faviconUrl: row.favicon_url ?? row.faviconUrl,
        cvUrl: row.cv_url ?? row.cvUrl,
        startYear: row.start_year ?? row.startYear ?? 2006,
        onlineStatus: row.online_status ?? row.onlineStatus ?? 'available',
    }
}

export function normalizeHeroProfile(row: Record<string, unknown>) {
    if (!row) return row
    return {
        id: row.id,
        heroImageUrl: row.hero_image_url ?? row.heroImageUrl ?? '',
        aboutImageUrl: row.about_image_url ?? row.aboutImageUrl ?? '',
    }
}

export function normalizeSiteContent(row: Record<string, unknown>) {
    if (!row) return row
    // Merge snake_case and camelCase — whichever is present wins
    return {
        heroHeadline: row.hero_headline ?? row.heroHeadline,
        heroSubtext: row.hero_subtext ?? row.heroSubtext,
        heroCta1: row.hero_cta1 ?? row.heroCta1,
        heroCta2: row.hero_cta2 ?? row.heroCta2,
        followMeLabel: row.follow_me_label ?? row.followMeLabel,
        featuredProjectsLabel: row.featured_projects_label ?? row.featuredProjectsLabel,
        featuredProjectsTitle: row.featured_projects_title ?? row.featuredProjectsTitle,
        servicesLabel: row.services_label ?? row.servicesLabel,
        servicesTitle: row.services_title ?? row.servicesTitle,
        contactLabel: row.contact_label ?? row.contactLabel,
        contactTitle: row.contact_title ?? row.contactTitle,
        contactFormNamePh: row.contact_form_name_ph ?? row.contactFormNamePh,
        contactFormEmailPh: row.contact_form_email_ph ?? row.contactFormEmailPh,
        contactFormSubjPh: row.contact_form_subj_ph ?? row.contactFormSubjPh,
        contactFormMsgPh: row.contact_form_msg_ph ?? row.contactFormMsgPh,
        contactFormBtn: row.contact_form_btn ?? row.contactFormBtn,
        contactSuccessMsg: row.contact_success_msg ?? row.contactSuccessMsg,
        contactErrorMsg: row.contact_error_msg ?? row.contactErrorMsg,
        footerCopyright: row.footer_copyright ?? row.footerCopyright,
        reviewFormTitle: row.review_form_title ?? row.reviewFormTitle,
        reviewFormNamePh: row.review_form_name_ph ?? row.reviewFormNamePh,
        reviewFormRolePh: row.review_form_role_ph ?? row.reviewFormRolePh,
        reviewFormQuotePh: row.review_form_quote_ph ?? row.reviewFormQuotePh,
        reviewFormBtn: row.review_form_btn ?? row.reviewFormBtn,
        reviewPendingMsg: row.review_pending_msg ?? row.reviewPendingMsg,
        techStackLabel: row.tech_stack_label ?? row.techStackLabel,
        techStackTitle: row.tech_stack_title ?? row.techStackTitle,
        availabilityBadge: row.availability_badge ?? row.availabilityBadge,
        timelineTitle: row.timeline_title ?? row.timelineTitle,
        skillsTitle: row.skills_title ?? row.skillsTitle,
        videosTitle: row.videos_title ?? row.videosTitle,
        testimonialsTitle: row.testimonials_title ?? row.testimonialsTitle,
        awardsTitle: row.awards_title ?? row.awardsTitle,
        certsTitle: row.certs_title ?? row.certsTitle,
    }
}

export function normalizeProject(row: Record<string, unknown>) {
    return {
        ...row,
        coverImageUrl: row.cover_image_url ?? row.coverImageUrl ?? '',
        longDescription: row.long_description ?? row.longDescription ?? '',
        liveUrl: row.live_url ?? row.liveUrl,
        githubUrl: row.github_url ?? row.githubUrl,
    }
}

export function normalizeCertificate(row: Record<string, unknown>) {
    return {
        ...row,
        issueDate: row.issue_date ?? row.issueDate,
        certificateImageUrl: row.certificate_image_url ?? row.certificateImageUrl ?? '',
        verificationUrl: row.verification_url ?? row.verificationUrl ?? '',
    }
}

export function normalizeTestimonial(row: Record<string, unknown>) {
    return {
        ...row,
        reviewerName: row.reviewer_name ?? row.reviewerName,
        reviewerRole: row.reviewer_role ?? row.reviewerRole,
        reviewerCompany: row.reviewer_company ?? row.reviewerCompany,
        reviewerImageUrl: row.reviewer_image_url ?? row.reviewerImageUrl ?? '',
    }
}

export function normalizeVideo(row: Record<string, unknown>) {
    return {
        ...row,
        videoUrl: row.video_url ?? row.videoUrl,
        thumbnailUrl: row.thumbnail_url ?? row.thumbnailUrl ?? '',
    }
}

export function normalizeSocialLink(row: Record<string, unknown>) {
    return { ...row }
}

export function normalizeList<T extends Record<string, unknown>>(
    list: T[],
    normalizer: (r: T) => Record<string, unknown>
): Record<string, unknown>[] {
    return list.map(normalizer)
}
