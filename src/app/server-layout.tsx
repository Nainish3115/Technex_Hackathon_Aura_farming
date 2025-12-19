import type { Metadata } from 'next'
import ClientLayout from './layout'

export const metadata: Metadata = {
  title: 'AI Companion - Voice-Powered AI Assistant',
  description: 'Experience natural conversations with our AI companion featuring real-time voice interaction and 3D avatar.',
  keywords: 'AI companion, voice assistant, elderly care, conversational AI, 3D avatar',
}

export default function ServerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}