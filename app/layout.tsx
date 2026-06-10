import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'College Discovery Platform - Find Your Dream College',
  description: 'Discover and compare colleges across India with AI-powered predictions',
}

import Navbar from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import AuthPopup from '@/components/AuthPopup'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <AuthPopup />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
