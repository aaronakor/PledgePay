import { BottomNav } from '@/components/layout/BottomNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface pb-20">
      <main className="max-w-[480px] mx-auto px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  )
}
