import { Inter as FontSans } from 'next/font/google'
import localFont from 'next/font/local'
import './global.css'

import { ThemeProvider, Toaster } from '@linkerry/ui-components/client'
import { cn } from '@linkerry/ui-components/utils'
import { LiveChatProvider } from '../libs/Tawk'
import { CookiesModal } from '../shared/components/Consents/CookiesModal'
import { siteConfig } from './webConfig'
// import { Analytics } from "@/components/analytics"

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
})

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['Ai', 'Automation', 'Tasks', 'Tasks Automation', 'No Code', 'Low-Code'],
  authors: [
    {
      name: 'Antoni Kois',
      url: 'https://github.com/anteqkois',
    },
  ],
  creator: 'anteqkois',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  // openGraph: {
  // 	type: 'website',
  // 	locale: 'en_US',
  // 	url: siteConfig.url,
  // 	title: siteConfig.name,
  // 	description: siteConfig.description,
  // 	siteName: siteConfig.name,
  // },
  // twitter: {
  // 	card: 'summary_large_image',
  // 	title: siteConfig.name,
  // 	description: siteConfig.description,
  // 	images: [`${siteConfig.url}/og.jpg`],
  // 	creator: '@shadcn',
  // },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  // manifest: `${siteConfig.url}/site.webmanifest`,
  // other: {
  // 	google: 'notranslate',
  // },
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn('min-h-screen-no-nav bg-background font-sans antialiased', fontSans.variable, fontHeading.variable)}
        suppressHydrationWarning={true}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <LiveChatProvider>
            {children}
            {/* <Analytics /> */}
            {/* <Toaster duration={5_000} viewportClassName='sm:top-0 sm:left-1/2 -translate-x-1/2'/> */}
            <Toaster duration={5_000} />
            {/* <TailwindIndicator /> */}
            <CookiesModal />
          </LiveChatProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
