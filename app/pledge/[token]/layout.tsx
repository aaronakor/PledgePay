import type { Metadata } from 'next'

async function getPledge(token: string) {
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${origin}/api/pledges/public/${token}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  const pledge = await getPledge(token)

  if (!pledge) {
    return {
      title: 'PledgePay',
      description: 'View and accept a pledge on PledgePay',
    }
  }

  const amount = (pledge.amount / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const title = `Pledge from ${pledge.lender.fullName}`
  const description = `₦${amount} for ${pledge.purpose}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'PledgePay',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default function PledgeTokenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
