import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'

// `usePathname` est la seule dépendance externe du composant : le tiroir se
// referme parce que le chemin change, pas parce qu'un effet le remet à zéro.
const { pathnameCourant } = vi.hoisted(() => ({ pathnameCourant: { valeur: '/dashboard' } }))
vi.mock('next/navigation', () => ({ usePathname: () => pathnameCourant.valeur }))
vi.mock('next/link', () => ({
  // e.preventDefault() : jsdom ne sait pas naviguer et le signale bruyamment a
  // chaque clic sur un lien. Next.js intercepte de toute facon la navigation.
  default: ({ children, href, onClick, ...props }: React.ComponentProps<'a'>) => (
    <a
      href={href}
      onClick={e => { e.preventDefault(); onClick?.(e) }}
      {...props}
    >
      {children}
    </a>
  ),
}))

import DashboardNav, { NAV_ITEMS } from '../components/DashboardNav'

const tiroir = () => document.getElementById('tiroir-navigation') as HTMLElement

describe('DashboardNav — navigation du tableau de bord sur téléphone', () => {
  beforeEach(() => { pathnameCourant.valeur = '/dashboard' })

  it('1. expose les 11 destinations du tableau de bord', () => {
    expect(NAV_ITEMS).toHaveLength(11)
    expect(NAV_ITEMS.map(i => i.href)).toEqual([
      '/dashboard', '/broyages', '/lots', '/production', '/clients', '/machines',
      '/maintenance', '/stocks', '/ventes', '/commandes', '/rapports',
    ])
  })

  it('2. aucun lien ne pointe vers une destination vide', () => {
    NAV_ITEMS.forEach(({ href, label }) => {
      expect(href.startsWith('/')).toBe(true)
      expect(label.trim().length).toBeGreaterThan(0)
    })
  })

  it('3. affiche un bouton d\'ouverture du menu', () => {
    render(<DashboardNav />)
    expect(screen.getByRole('button', { name: 'Ouvrir le menu' })).toBeInTheDocument()
  })

  it('4. le tiroir est fermé au premier rendu', () => {
    render(<DashboardNav />)
    expect(tiroir()).toHaveAttribute('aria-hidden', 'true')
    expect(tiroir().style.transform).toBe('translateX(-100%)')
  })

  it('5. le bouton annonce l\'état fermé aux lecteurs d\'écran', () => {
    render(<DashboardNav />)
    expect(screen.getByRole('button', { name: 'Ouvrir le menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('6. toucher le bouton ouvre le tiroir', () => {
    render(<DashboardNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    expect(tiroir()).toHaveAttribute('aria-hidden', 'false')
    expect(tiroir().style.transform).toBe('translateX(0)')
    expect(screen.getByRole('button', { name: 'Ouvrir le menu' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('7. le bouton de fermeture referme le tiroir', () => {
    render(<DashboardNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    fireEvent.click(screen.getByRole('button', { name: 'Fermer le menu' }))
    expect(tiroir()).toHaveAttribute('aria-hidden', 'true')
  })

  it('8. la touche Échap referme le tiroir', () => {
    render(<DashboardNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(tiroir()).toHaveAttribute('aria-hidden', 'true')
  })

  it('9. toucher un lien referme le tiroir — sinon il resterait par-dessus la page demandée', () => {
    render(<DashboardNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    fireEvent.click(within(tiroir()).getByRole('link', { name: 'Stocks' }))
    expect(tiroir()).toHaveAttribute('aria-hidden', 'true')
  })

  it('10. ouvert, le tiroir donne accès aux 11 destinations dans l\'ordre', () => {
    render(<DashboardNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    const liens = within(tiroir()).getAllByRole('link')
    expect(liens.map(l => l.getAttribute('href'))).toEqual(NAV_ITEMS.map(i => i.href))
  })

  it('11. la page courante est marquée aria-current dans la barre latérale', () => {
    pathnameCourant.valeur = '/stocks'
    render(<DashboardNav />)
    const courants = screen.getAllByRole('link', { current: 'page' })
    // Tiroir fermé : ses liens sont hors de l'arbre d'accessibilité
    // (aria-hidden), donc un seul lien courant est exposé, celui de la barre
    // latérale. C'est le comportement voulu — un lecteur d'écran ne doit pas
    // annoncer deux fois la même destination.
    expect(courants).toHaveLength(1)
    expect(courants[0]).toHaveTextContent('Stocks')
  })

  it('12. tiroir ouvert, les deux navigations marquent la même page courante', () => {
    pathnameCourant.valeur = '/rapports'
    render(<DashboardNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    const libelles = screen.getAllByRole('link', { current: 'page' }).map(l => l.textContent)
    expect(libelles).toEqual(['Rapports', 'Rapports']) // barre latérale + tiroir
  })

  it('13. tiroir fermé, ses liens ne sont pas atteignables au lecteur d\'écran', () => {
    render(<DashboardNav />)
    expect(screen.getAllByRole('link')).toHaveLength(NAV_ITEMS.length) // la barre latérale seule
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    expect(screen.getAllByRole('link')).toHaveLength(NAV_ITEMS.length * 2)
  })

  it('14. le voile ne capte pas les touchers tant que le tiroir est fermé', () => {
    const { container } = render(<DashboardNav />)
    const voile = container.querySelector('[aria-hidden="true"].fixed.inset-0') as HTMLElement
    expect(voile.style.pointerEvents).toBe('none')
    expect(voile.style.opacity).toBe('0')
  })

  it('15. toucher le voile referme le tiroir', () => {
    const { container } = render(<DashboardNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    const voile = container.querySelector('[aria-hidden="true"].fixed.inset-0') as HTMLElement
    expect(voile.style.pointerEvents).toBe('auto')
    fireEvent.click(voile)
    expect(tiroir()).toHaveAttribute('aria-hidden', 'true')
  })

  it('16. la barre latérale de bureau est masquée sous 768 px et le tiroir au-dessus', () => {
    const { container } = render(<DashboardNav />)
    const laterale = container.querySelector('aside.hidden') as HTMLElement
    expect(laterale.className).toContain('md:flex')
    expect(laterale.className).toContain('w-64')
    // Le tiroir et la barre supérieure, eux, disparaissent au-dessus de 768 px.
    expect(tiroir().className).toContain('md:hidden')
    expect(container.querySelector('header')!.className).toContain('md:hidden')
  })
})
