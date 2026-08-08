import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import SessionProvider from '@/components/providers/SessionProvider'
import { I18nProvider } from '@/lib/i18n/context'
import AIAssistant from '@/components/AIAssistant'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Mebratu Muhabaw — Software Engineer & UI/UX Designer',
    template: '%s | Mebratu Muhabaw',
  },
  description:
    'Professional portfolio of Mebratu Muhabaw — Software Engineer and UI/UX Designer specializing in web & mobile development.',
  keywords: ['Mebratu Muhabaw', 'Software Engineer', 'UI/UX Designer', 'Web Developer', 'Portfolio'],
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className={`antialiased ${inter.className}`}>
        <SessionProvider>
          <I18nProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              {children}
              <AIAssistant />
            </ThemeProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
