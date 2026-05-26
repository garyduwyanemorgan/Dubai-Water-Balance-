import type { Metadata, Viewport } from 'next'
import { Newsreader, Inter } from 'next/font/google'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Reading the Subsurface',
  description:
    'A 10-question interactive journey through the UAE water inversion. Phone-first, public-data-only, hydrogeologically translated.',
  openGraph: {
    title: 'Reading the Subsurface',
    description: 'What do you actually know about where Dubai\'s water comes from — and where it goes?',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${inter.variable} font-inter antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
