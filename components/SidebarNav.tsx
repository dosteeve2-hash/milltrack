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
  LogOut,
  MapPin,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { signOut } from '@/app/actions/auth'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lots', label: 'Lots', icon: Package },
  { href: '/dashboard/production', label: 'Production', icon: Activity },
  { href: '/machines', label: 'Machines', icon: Wrench },
  { href: '/dashboard/stocks', label: 'Stocks', icon: Archive },
  { href: '/dashboard/rapports', label: 'Rapports', icon: FileBarChart2 },
]

export default function SidebarNav({ user }: { user: User }) {
  const pathname = usePathname()
  const isDemo = user.email === 'demo@milltrack.app'

  return (
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

      {/* Demo badge */}
      {isDemo && (
        <div
          className="mx-3 mb-4 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5"
          style={{ backgroundColor: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}
        >
          <MapPin className="w-3 h-3" />
          Mode démo actif
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
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

      {/* Footer: user + logout */}
      <div className="px-3 pt-4 border-t space-y-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="px-3">
          <p className="text-xs font-medium truncate" style={{ color: '#f0f4ff' }}>
            {user.email}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(240,244,255,0.3)' }}>
            FORGE Afrika · v1.0
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all hover:opacity-80"
            style={{ color: 'rgba(240,244,255,0.5)' }}
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  )
}
