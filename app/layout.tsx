import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Brújula Piscis - Guidance & Intuition | Coach de Decisiones para Piscis',
  description: 'Tu coach de decisiones diseñado especialmente para Piscis. Claridad + accion, no prediccion absoluta. Mentor espiritual con Kabbalah, Tarot, Astrologia y mas.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  keywords: ['piscis', 'horoscopo', 'decisiones', 'tarot', 'astrologia', 'kabbalah', 'mentor espiritual', 'coaching'],
  authors: [{ name: 'Brujula Piscis' }],
  openGraph: {
    title: 'Brujula Piscis - Guidance & Intuition',
    description: 'Tu coach de decisiones disenado especialmente para Piscis. Claridad + accion.',
    images: [{ url: '/logo.jpg', width: 1024, height: 1024, alt: 'Brujula Piscis Logo' }],
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brujula Piscis - Guidance & Intuition',
    description: 'Tu coach de decisiones disenado especialmente para Piscis.',
    images: ['/logo.jpg'],
  },
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1a2744',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
