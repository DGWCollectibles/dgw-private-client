import type { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { LuxuryAmbient } from '@/components/LuxuryAmbient'
import './globals.css'

export const metadata: Metadata = {
  title: 'DGW Private Client | Luxury Collectibles',
  description: 'Curated luxury collectibles and exceptional pieces for distinguished collectors. Pokémon, sports cards, watches, jewelry, and designer fashion.',
  keywords: 'luxury collectibles, Pokemon cards, sports memorabilia, watches, jewelry, designer fashion, private client',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <LuxuryAmbient />
        <Navigation />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
