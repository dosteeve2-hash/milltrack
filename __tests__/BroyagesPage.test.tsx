import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BroyagesPage from '../app/(dashboard)/broyages/page'

// ── Mocks ────────────────────────────────────────────────────
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, style }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div className={className} style={style} onClick={onClick}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  Cell: () => null,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('BroyagesPage — rendu de base', () => {
  it('1. affiche le titre "Broyages"', () => {
    render(<BroyagesPage />)
    expect(screen.getByRole('heading', { name: /broyages/i })).toBeInTheDocument()
  })

  it('2. affiche le sous-titre "Sessions de mouture"', () => {
    render(<BroyagesPage />)
    expect(screen.getByText(/sessions de mouture/i)).toBeInTheDocument()
  })

  it('3. affiche le bouton "Nouveau broyage"', () => {
    render(<BroyagesPage />)
    expect(screen.getByRole('button', { name: /nouveau broyage/i })).toBeInTheDocument()
  })

  it('4. affiche la carte KPI "Broyages aujourd\'hui"', () => {
    render(<BroyagesPage />)
    expect(screen.getByText(/broyages aujourd'hui/i)).toBeInTheDocument()
  })

  it('5. affiche la carte KPI "Kg traités (sortie)"', () => {
    render(<BroyagesPage />)
    expect(screen.getByText('Kg traités (sortie)')).toBeInTheDocument()
  })

  it('6. affiche la carte KPI "CA du jour"', () => {
    render(<BroyagesPage />)
    expect(screen.getByText(/ca du jour/i)).toBeInTheDocument()
  })

  it('7. affiche la carte KPI "Taux rendement"', () => {
    render(<BroyagesPage />)
    expect(screen.getByText(/taux rendement/i)).toBeInTheDocument()
  })

  it('8. affiche les charts BarChart et LineChart', () => {
    render(<BroyagesPage />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('9. affiche tous les 12 broyages de BR-001 à BR-012', () => {
    render(<BroyagesPage />)
    for (let i = 1; i <= 12; i++) {
      const id = `BR-${String(i).padStart(3, '0')}`
      expect(screen.getByText(id)).toBeInTheDocument()
    }
  })

  it('10. affiche le client "Aminata Ouédraogo"', () => {
    render(<BroyagesPage />)
    expect(screen.getByText('Aminata Ouédraogo')).toBeInTheDocument()
  })

  it('11. affiche le client "Seydou Tapsoba"', () => {
    render(<BroyagesPage />)
    expect(screen.getByText('Seydou Tapsoba')).toBeInTheDocument()
  })
})

describe('BroyagesPage — filtres et recherche', () => {
  it('12. affiche le select "Toutes céréales"', () => {
    render(<BroyagesPage />)
    expect(screen.getByRole('option', { name: 'Toutes céréales' })).toBeInTheDocument()
  })

  it('13. affiche le select "Tous statuts"', () => {
    render(<BroyagesPage />)
    expect(screen.getByRole('option', { name: 'Tous statuts' })).toBeInTheDocument()
  })

  it('14. la recherche "Aminata" ne laisse qu\'un seul résultat', () => {
    render(<BroyagesPage />)
    const input = screen.getByPlaceholderText(/rechercher client/i)
    fireEvent.change(input, { target: { value: 'Aminata' } })
    expect(screen.getByText('Aminata Ouédraogo')).toBeInTheDocument()
    expect(screen.queryByText('Boureima Kaboré')).not.toBeInTheDocument()
  })

  it('15. filtre par céréale "Fonio" → affiche BR-005 et BR-011 seulement', () => {
    render(<BroyagesPage />)
    const select = screen.getAllByRole('combobox')[0]
    fireEvent.change(select, { target: { value: 'Fonio' } })
    expect(screen.getByText('BR-005')).toBeInTheDocument()
    expect(screen.getByText('BR-011')).toBeInTheDocument()
    expect(screen.queryByText('BR-001')).not.toBeInTheDocument()
  })

  it('16. filtre par statut "En attente" → affiche BR-004 seulement', () => {
    render(<BroyagesPage />)
    const select = screen.getAllByRole('combobox')[1]
    fireEvent.change(select, { target: { value: 'En attente' } })
    expect(screen.getByText('BR-004')).toBeInTheDocument()
    expect(screen.queryByText('BR-001')).not.toBeInTheDocument()
  })

  it('17. filtre par statut "En cours" → affiche BR-003 seulement', () => {
    render(<BroyagesPage />)
    const select = screen.getAllByRole('combobox')[1]
    fireEvent.change(select, { target: { value: 'En cours' } })
    expect(screen.getByText('BR-003')).toBeInTheDocument()
    expect(screen.queryByText('BR-002')).not.toBeInTheDocument()
  })

  it('18. recherche vide montre "Aucun broyage trouvé"', () => {
    render(<BroyagesPage />)
    const input = screen.getByPlaceholderText(/rechercher client/i)
    fireEvent.change(input, { target: { value: 'XXXXXX' } })
    expect(screen.getByText(/aucun broyage trouvé/i)).toBeInTheDocument()
  })
})

describe('BroyagesPage — modales', () => {
  it('19. le modal "Nouveau broyage" n\'est pas visible au départ', () => {
    render(<BroyagesPage />)
    expect(screen.queryByRole('heading', { name: /nouveau broyage/i })).not.toBeInTheDocument()
  })

  it('20. le bouton "Nouveau broyage" ouvre le modal', () => {
    render(<BroyagesPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau broyage/i }))
    expect(screen.getByRole('heading', { name: /nouveau broyage/i })).toBeInTheDocument()
  })

  it('21. le bouton "Annuler" dans le modal ferme le modal', () => {
    render(<BroyagesPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau broyage/i }))
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }))
    expect(screen.queryByRole('heading', { name: /nouveau broyage/i })).not.toBeInTheDocument()
  })

  it('22. le modal nouveau contient les champs client, téléphone, quantité', () => {
    render(<BroyagesPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau broyage/i }))
    expect(screen.getByPlaceholderText(/Aminata/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/\+226/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/200/i)).toBeInTheDocument()
  })

  it('23. le modal contient la sélection de céréale', () => {
    render(<BroyagesPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau broyage/i }))
    expect(screen.getByRole('option', { name: /Sélectionner/i })).toBeInTheDocument()
  })

  it('24. cliquer sur une ligne BR-001 ouvre le modal de détail', () => {
    render(<BroyagesPage />)
    const row = screen.getByText('BR-001').closest('div[class]')
    expect(row).not.toBeNull()
    fireEvent.click(row!)
    // le modal détail affiche l'ID
    expect(screen.getAllByText('BR-001').length).toBeGreaterThan(1)
  })

  it('25. le modal détail affiche le bouton "Démarrer" pour BR-004 (En attente)', () => {
    render(<BroyagesPage />)
    const row = screen.getByText('BR-004').closest('div[class]')
    fireEvent.click(row!)
    expect(screen.getByRole('button', { name: /démarrer/i })).toBeInTheDocument()
  })
})
