import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'PledgePay — Accountability without harassment',
  description:
    'Create, manage, track, and fulfill financial commitments with trust and accountability.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'PledgePay',
    description:
      'Create, manage, track, and fulfill financial commitments with trust and accountability.',
    type: 'website',
    siteName: 'PledgePay',
  },
  twitter: {
    card: 'summary',
    title: 'PledgePay',
    description:
      'Create, manage, track, and fulfill financial commitments with trust and accountability.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
