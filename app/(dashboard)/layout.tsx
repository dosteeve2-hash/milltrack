import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SidebarNav from '@/components/SidebarNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A1628' }}>
      <SidebarNav user={user} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
