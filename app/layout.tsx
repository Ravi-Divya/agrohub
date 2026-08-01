import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const bodyFont = Inter({
  variable: '--font-body-family',
  subsets: ['latin'],
  display: 'swap',
})

const headingFont = Space_Grotesk({
  variable: '--font-heading-family',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agrohub.onrender.com'),
  title: {
    default: 'AgroHub — AI Crop Disease & Pest Detection',
    template: '%s | AgroHub',
  },
  description:
    'Detect crop diseases, identify pests, and get treatment recommendations instantly. Upload images, videos, or use live streams — powered by AI for modern farmers.',
  keywords: [
    'crop disease detection',
    'pest identification',
    'agriculture AI',
    'smart farming',
    'plant disease',
    'agritech',
  ],
  openGraph: {
    title: 'AgroHub — AI Crop Disease & Pest Detection',
    description:
      'Upload an image, video, or live stream of your crop and get instant AI analysis with treatment recommendations.',
    type: 'website',
    locale: 'en_US',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgroHub — AI Crop Disease & Pest Detection',
    description: 'AI-powered crop intelligence for modern farmers.',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fdf9f1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
