'use client'

import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import './globals.css'
import { SupabaseProvider } from '../components/providers/SupabaseProvider'
import { VoiceSessionProvider } from '../components/providers/VoiceSessionProvider'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Suppress hydration warnings caused by browser extensions in development
    if (process.env.NODE_ENV === 'development') {
      const originalWarn = console.warn
      console.warn = (...args) => {
        if (args[0]?.includes?.('hydration') || args[0]?.includes?.('Hydration')) {
          return
        }
        originalWarn.call(console, ...args)
      }
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning={process.env.NODE_ENV === 'development'}>
      <body className={`${inter.className} bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen`}>
        <SupabaseProvider>
          <VoiceSessionProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </VoiceSessionProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}