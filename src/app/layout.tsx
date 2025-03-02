import type { Metadata } from 'next'
import './globals.css'
import { Topbar } from '@/components/topbar'

export const metadata: Metadata = {
  title: 'Chat socket.io Next-15',
  description: 'Only chat with websocket, tranfers menssages',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Topbar />
      <body>{children}</body>
    </html>
  )
}
