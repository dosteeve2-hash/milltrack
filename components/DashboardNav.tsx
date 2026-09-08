'use client'

import { useEffect, useState } from 'react'
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
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = { href: string; label: string; icon: LucideIcon }

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/broyages',    label: 'Broyages',    icon: Cog             },
  { href: '/lots',        label: 'Lots',        icon: Package         },
  { href: '/production',  label: 'Production',  icon: Factory         },
  { href: '/clients',     label: 'Clients',     icon: Users           },
  { href: '/machines',    label: 'Machines',    icon: Wrench          },
  { href: '/maintenance', label: 'Maintenance', icon: Settings        },
  { href: '/stocks',      label: 'Stocks',      icon: Archive         },
  { href: '/ventes',      label: 'Ventes',      icon: ShoppingCart    },
  { href: '/commandes',   label: 'Commandes',   icon: ClipboardList   },
  { href: '/rapports',    label: 'Rapports',    icon: FileBarChart2   },
]

const PANNEAU = '#0f1f3d'
const BORDURE = 'rgba(255,255,255,0.08)'
const OR = '#D4AF37'
const TEXTE = '#f0f4ff'

function Liens({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: active ? 'rgba(212,175,55,0.15)' : 'transparent',
              color: active ? OR : 'rgba(240,244,255,0.6)',
              borderLeft: active ? `2px solid ${OR}` : '2px solid transparent',
            }}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

function Entete() {
  return (
    <div className="flex items-center gap-2 px-6 mb-8">
      <Factory className="w-6 h-6" style={{ color: OR }} />
      <span className="font-bold text-lg" style={{ color: TEXTE }}>
        MillTrack
      </span>
    </div>
  )
}

function PiedDePage() {
  return (
    <div className="px-6 pt-4 border-t" style={{ borderColor: BORDURE }}>
      <p className="text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>
        FORGE Afrika · v1.0
      </p>
    </div>
  )
}

/**
 * Navigation du tableau de bord.
 *
 * Au-dessus de 768 px : la barre latérale fixe de 256 px, comme avant.
 * En dessous : un tiroir. La cible est un Android d'entrée de gamme de 360 px de
 * large (VISION.md §4) — une barre de 256 px y laissait 104 px de contenu.
 *
 * Le tiroir est animé en CSS et non avec framer-motion : sur un téléphone
 * d'entrée de gamme en 2G/3G, chaque kilo-octet de JavaScript se paie.
 */
export default function DashboardNav() {
  const pathname = usePathname()

  // On mémorise la page sur laquelle le tiroir a été ouvert, et non un simple
  // booléen : toute navigation change `pathname`, donc referme le tiroir sans
  // qu'un effet ait à le remettre à zéro. Un effet ferait ici un rendu en
  // cascade — c'est exactement ce que `react-hooks/set-state-in-effect`
  // interdit dans ce dépôt.
  const [ouvertSur, setOuvertSur] = useState<string | null>(null)
  const ouvert = ouvertSur === pathname
  const setOuvert = (v: boolean) => setOuvertSur(v ? pathname : null)

  // Fermer avec Échap — un clavier physique existe aussi sur tablette.
  useEffect(() => {
    if (!ouvert) return
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuvertSur(null)
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [ouvert])

  return (
    <>
      {/* Barre supérieure — visible uniquement sous 768 px */}
      <header
        className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-30"
        style={{ backgroundColor: PANNEAU, borderBottom: `1px solid ${BORDURE}` }}
      >
        <button
          type="button"
          onClick={() => setOuvert(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={ouvert}
          aria-controls="tiroir-navigation"
          className="p-2 -ml-2 rounded-lg"
          style={{ color: TEXTE }}
        >
          <Menu className="w-6 h-6" />
        </button>
        <Factory className="w-5 h-5" style={{ color: OR }} />
        <span className="font-bold" style={{ color: TEXTE }}>
          MillTrack
        </span>
      </header>

      {/* Barre latérale — au-dessus de 768 px */}
      <aside
        className="hidden md:flex w-64 flex-shrink-0 flex-col py-6"
        style={{ backgroundColor: PANNEAU, borderRight: `1px solid ${BORDURE}` }}
      >
        <Entete />
        <Liens pathname={pathname} />
        <PiedDePage />
      </aside>

      {/* Voile — masque la page derrière le tiroir et le ferme au toucher */}
      <div
        onClick={() => setOuvert(false)}
        aria-hidden="true"
        className="md:hidden fixed inset-0 z-40 transition-opacity duration-200"
        style={{
          backgroundColor: 'rgba(10,22,40,0.6)',
          opacity: ouvert ? 1 : 0,
          pointerEvents: ouvert ? 'auto' : 'none',
        }}
      />

      {/* Tiroir */}
      <aside
        id="tiroir-navigation"
        aria-label="Navigation principale"
        aria-hidden={!ouvert}
        className="md:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col py-6 transition-transform duration-200"
        style={{
          backgroundColor: PANNEAU,
          borderRight: `1px solid ${BORDURE}`,
          transform: ouvert ? 'translateX(0)' : 'translateX(-100%)',
          visibility: ouvert ? 'visible' : 'hidden',
        }}
      >
        <div className="flex items-center justify-between pr-4">
          <Entete />
          <button
            type="button"
            onClick={() => setOuvert(false)}
            aria-label="Fermer le menu"
            className="p-2 -mt-8 rounded-lg"
            style={{ color: 'rgba(240,244,255,0.6)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Liens pathname={pathname} onNavigate={() => setOuvert(false)} />
        <PiedDePage />
      </aside>
    </>
  )
}
