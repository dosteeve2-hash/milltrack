'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Activity,
  Wrench,
  Archive,
  FileBarChart2,
  Factory,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lots', label: 'Lots', icon: Package },
  { href: '/production', label: 'Production', icon: Activity },
  { href: '/machines', label: 'Machines', icon: Wrench },
  { href: '/stocks', label: 'Stocks', icon: Archive },
  { href: '/rapports', label: 'Rapports', icon: FileBarChart2 },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A1628' }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col py-6"
        style={{
          backgroundColor: '#0f1f3d',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 mb-8">
          <Factory className="w-6 h-6" style={{ color: '#D4AF37' }} />
          <span className="font-bold text-lg" style={{ color: '#f0f4ff' }}>
            MillTrack
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: active ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color: active ? '#D4AF37' : 'rgba(240,244,255,0.6)',
                  borderLeft: active ? '2px solid #D4AF37' : '2px solid transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>
            FORGE Afrika · v1.0
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
