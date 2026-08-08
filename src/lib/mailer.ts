import nodemailer from 'nodemailer'

interface ContactPayload {
    toEmail: string
    fromName: string
    fromEmail: string
    subject: string
    message: string
    siteName: string
}

interface ReviewPayload {
    toEmail: string
    reviewerName: string
    reviewerRole: string
    quote: string
    rating: number
    siteName: string
    adminUrl: string
}

function createTransporter() {
    // Gmail App Password (EMAIL_USER + EMAIL_PASS in .env.local)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS.replace(/\s/g, ''), // strip spaces from app password
            },
        })
    }
    // Custom SMTP fallback
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT ?? 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })
    }
    return null
}

export async function sendContactEmail(p: ContactPayload): Promise<{ ok: boolean; error?: string }> {
    const transporter = createTransporter()
    if (!transporter) {
        console.warn('[Mailer] No email config — set EMAIL_USER + EMAIL_PASS in .env.local')
        return { ok: false, error: 'Email service not configured' }
    }

    try {
        await transporter.sendMail({
            from: `"${p.siteName} Contact Form" <${process.env.EMAIL_USER}>`,
            to: p.toEmail,
            replyTo: `"${p.fromName}" <${p.fromEmail}>`,
            subject: `[Portfolio] ${p.subject}`,
            html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:24px;border-radius:12px 12px 0 0">
            <h2 style="color:white;margin:0;font-size:20px">📬 New Message from Portfolio</h2>
          </div>
          <div style="background:#f8fafc;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:80px">From</td>
                  <td style="padding:8px 0;font-weight:600;color:#1e293b">${p.fromName} &lt;${p.fromEmail}&gt;</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Subject</td>
                  <td style="padding:8px 0;font-weight:600;color:#1e293b">${p.subject}</td></tr>
            </table>
            <div style="margin-top:20px;padding:16px;background:white;border-radius:8px;border:1px solid #e2e8f0">
              <p style="color:#374151;line-height:1.6;white-space:pre-wrap;margin:0">${p.message}</p>
            </div>
            <p style="margin-top:16px;color:#94a3b8;font-size:12px">
              Sent via ${p.siteName} contact form at ${new Date().toUTCString()}
            </p>
          </div>
        </div>`,
            text: `From: ${p.fromName} <${p.fromEmail}>\nSubject: ${p.subject}\n\n${p.message}`,
        })
        return { ok: true }
    } catch (err: any) {
        console.error('[Mailer] sendContactEmail failed:', err.message)
        return { ok: false, error: err.message }
    }
}

export async function sendReviewNotification(p: ReviewPayload): Promise<void> {
    const transporter = createTransporter()
    if (!transporter) return

    const stars = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating)
    try {
        await transporter.sendMail({
            from: `"${p.siteName}" <${process.env.EMAIL_USER}>`,
            to: p.toEmail,
            subject: `[Portfolio] New review from ${p.reviewerName} (${stars})`,
            html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h2 style="color:#4f46e5">⭐ New Review Pending Approval</h2>
          <p><strong>${p.reviewerName}</strong> — ${p.reviewerRole}</p>
          <p style="font-size:22px;color:#f59e0b;margin:8px 0">${stars}</p>
          <blockquote style="border-left:4px solid #4f46e5;margin:16px 0;padding:12px 16px;background:#f8fafc;border-radius:0 8px 8px 0;font-style:italic;color:#374151">
            "${p.quote}"
          </blockquote>
          <a href="${p.adminUrl}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:white;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">
            Review in Admin Panel →
          </a>
        </div>`,
        })
    } catch (err: any) {
        console.error('[Mailer] sendReviewNotification failed:', err.message)
    }
}
