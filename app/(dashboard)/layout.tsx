'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Wrench,
  Archive,
  FileBarChart2,
  Factory,
  Users,
  ClipboardList,
  Cog,
  Settings,
  ShoppingCart,
  LogOut,
} from 'lucide-react'

import { signOut } from '@/app/actions/auth'

const navItems = [
  { href: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/broyages',    label: 'Broyages',    icon: Cog             },
  { href: '/lots',        label: 'Lots',         icon: Package         },
  { href: '/production',  label: 'Production',   icon: Factory         },
  { href: '/clients',     label: 'Clients',      icon: Users           },
  { href: '/machines',     label: 'Machines',     icon: Wrench          },
  { href: '/maintenance',  label: 'Maintenance',  icon: Settings        },
  { href: '/stocks',      label: 'Stocks',       icon: Archive         },
  { href: '/ventes',      label: 'Ventes',       icon: ShoppingCart    },
  { href: '/commandes',   label: 'Commandes',    icon: ClipboardList   },
  { href: '/rapports',    label: 'Rapports',     icon: FileBarChart2   },
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
        <div className="px-3 pt-4 border-t space-y-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
              style={{ color: 'rgba(240,244,255,0.6)' }}
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </form>
          <p className="text-xs px-3" style={{ color: 'rgba(240,244,255,0.3)' }}>
            FORGE Afrika · v1.0
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
