import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() }, Toaster: () => null }))

import StocksPage from '../app/(dashboard)/stocks/page'
import CommandesPage from '../app/(dashboard)/commandes/page'
import LotsPage from '../app/(dashboard)/lots/page'

/**
 * Un tableau de 8 à 10 colonnes ne tient pas dans 360 px. S'il n'a pas son
 * propre conteneur défilant, c'est la page entière qui part en défilement
 * horizontal — et sur un téléphone, la barre latérale et les titres partent
 * avec elle. Ces trois tableaux étaient dans ce cas.
 */
const cas: Array<[string, React.ComponentType]> = [
  ['Stocks', StocksPage],
  ['Commandes', CommandesPage],
  ['Lots', LotsPage],
]

describe('Tableaux larges — défilement horizontal confiné', () => {
  cas.forEach(([nom, Page]) => {
    it(`${nom} : le tableau est dans un conteneur à défilement horizontal`, () => {
      const { container } = render(<Page />)
      const table = container.querySelector('table')
      expect(table).not.toBeNull()
      const parent = table!.parentElement as HTMLElement
      expect(parent.style.overflowX).toBe('auto')
    })

    it(`${nom} : le tableau garde une largeur minimale plutôt que d'écraser ses colonnes`, () => {
      const { container } = render(<Page />)
      const table = container.querySelector('table') as HTMLTableElement
      expect(parseInt(table.style.minWidth, 10)).toBeGreaterThanOrEqual(800)
    })
  })
})
