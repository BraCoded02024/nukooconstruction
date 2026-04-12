import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { getSiteUrl } from '@/lib/site-url'
import './globals.css'

const siteUrl = getSiteUrl()
const defaultDescription =
  'Nukoo Construction & Properties — construction and real estate services. Find exclusive properties and building projects in prime locations.'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif'
});
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nukoo Construction & Properties | Real Estate & Building',
    template: '%s | Nukoo Construction & Properties',
  },
  description: defaultDescription,
  keywords: [
    'Nukoo',
    'Nukoo Construction',
    'Nukooconstruction',
    'Nukoo Construction and Properties',
    'construction company',
    'real estate',
    'properties for sale',
    'building contractor',
  ],
  generator: 'v0.app',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Nukoo Construction & Properties',
    title: 'Nukoo Construction & Properties',
    description: defaultDescription,
    images: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nukoo Construction & Properties',
    description: defaultDescription,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        {children}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  )
}
