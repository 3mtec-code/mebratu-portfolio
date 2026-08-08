import { FaLinkedinIn, FaGithub, FaTwitter, FaInstagram, FaDribbble, FaYoutube, FaTiktok } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

interface SocialIconProps {
    icon: string
    className?: string
}

export default function SocialIcon({ icon, className = 'w-4 h-4' }: SocialIconProps) {
    const cls = className
    switch (icon.toLowerCase()) {
        case 'linkedin': return <FaLinkedinIn className={cls} />
        case 'github': return <FaGithub className={cls} />
        case 'twitter': return <FaTwitter className={cls} />
        case 'instagram': return <FaInstagram className={cls} />
        case 'dribbble': return <FaDribbble className={cls} />
        case 'youtube': return <FaYoutube className={cls} />
        case 'tiktok': return <FaTiktok className={cls} />
        case 'mail':
        default: return <MdEmail className={cls} />
    }
}
