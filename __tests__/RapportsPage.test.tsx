import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { toast } from 'sonner'
import RapportsPage from '../app/(dashboard)/rapports/page'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children, onClick, className, style,
    }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
      <div className={className} style={style} onClick={onClick}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  LineChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  PieChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ComposedChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="composed-chart">{children}</div>,
}))

beforeEach(() => {
  vi.clearAllMocks()
})

// ── Rendu de base ────────────────────────────────────────────────
describe('RapportsPage — rendu de base', () => {
  it('1. affiche le titre "Rapports & Analytics"', () => {
    render(<RapportsPage />)
    expect(screen.getByText(/rapports & analytics/i)).toBeInTheDocument()
  })

  it('2. affiche le sous-titre "Tableau de bord analytique"', () => {
    render(<RapportsPage />)
    expect(screen.getByText(/tableau de bord analytique/i)).toBeInTheDocument()
  })

  it('3. affiche le bouton "Exporter CSV"', () => {
    render(<RapportsPage />)
    expect(screen.getByRole('button', { name: /exporter csv/i })).toBeInTheDocument()
  })
})

// ── Sélecteur de période ─────────────────────────────────────────
describe('RapportsPage — sélecteur période', () => {
  it('4. affiche le bouton "Aujourd\'hui"', () => {
    render(<RapportsPage />)
    expect(screen.getByRole('button', { name: /aujourd'hui/i })).toBeInTheDocument()
  })

  it('5. affiche le bouton "Cette semaine"', () => {
    render(<RapportsPage />)
    expect(screen.getByRole('button', { name: /cette semaine/i })).toBeInTheDocument()
  })

  it('6. affiche le bouton "Ce mois"', () => {
    render(<RapportsPage />)
    expect(screen.getByRole('button', { name: /ce mois/i })).toBeInTheDocument()
  })

  it('7. affiche le bouton "Cette année"', () => {
    render(<RapportsPage />)
    expect(screen.getByRole('button', { name: /cette année/i })).toBeInTheDocument()
  })
})

// ── Labels KPIs ──────────────────────────────────────────────────
describe('RapportsPage — labels KPIs (×6)', () => {
  it('8. affiche le label "CA total (FCFA)"', () => {
    render(<RapportsPage />)
    expect(screen.getByText('CA total (FCFA)')).toBeInTheDocument()
  })

  it('9. affiche le label "Total broyages"', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Total broyages')).toBeInTheDocument()
  })

  it('10. affiche le label "Kg traités"', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Kg traités')).toBeInTheDocument()
  })

  it('11. affiche le label "Clients servis"', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Clients servis')).toBeInTheDocument()
  })

  it('12. affiche le label "Rendement moyen"', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Rendement moyen')).toBeInTheDocument()
  })

  it('13. affiche le label "Bénéfice estimé (FCFA)"', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Bénéfice estimé (FCFA)')).toBeInTheDocument()
  })
})

// ── Valeurs KPI — période mois (défaut) ──────────────────────────
describe('RapportsPage — valeurs KPI mois par défaut', () => {
  it('14. broyages mois = 124', () => {
    render(<RapportsPage />)
    expect(screen.getByText('124')).toBeInTheDocument()
  })

  it('15. clients mois = 57', () => {
    render(<RapportsPage />)
    expect(screen.getByText('57')).toBeInTheDocument()
  })

  it('16. rendement mois = "87 %"', () => {
    render(<RapportsPage />)
    expect(screen.getByText('87 %')).toBeInTheDocument()
  })
})

// ── Changement de période ────────────────────────────────────────
describe('RapportsPage — changement de période', () => {
  it('17. clic "Aujourd\'hui" → rendement = "90 %"', () => {
    render(<RapportsPage />)
    fireEvent.click(screen.getByRole('button', { name: /aujourd'hui/i }))
    expect(screen.getByText('90 %')).toBeInTheDocument()
  })

  it('18. clic "Cette semaine" → rendement = "88 %"', () => {
    render(<RapportsPage />)
    fireEvent.click(screen.getByRole('button', { name: /cette semaine/i }))
    expect(screen.getByText('88 %')).toBeInTheDocument()
  })

  it('19. clic "Cette année" → rendement = "85 %"', () => {
    render(<RapportsPage />)
    fireEvent.click(screen.getByRole('button', { name: /cette année/i }))
    expect(screen.getByText('85 %')).toBeInTheDocument()
  })

  it('20. clic "Aujourd\'hui" → broyages = 5', () => {
    render(<RapportsPage />)
    fireEvent.click(screen.getByRole('button', { name: /aujourd'hui/i }))
    expect(screen.getAllByText('5').length).toBeGreaterThan(0)
  })

  it('21. clic "Cette semaine" → broyages = 31', () => {
    render(<RapportsPage />)
    fireEvent.click(screen.getByRole('button', { name: /cette semaine/i }))
    expect(screen.getByText('31')).toBeInTheDocument()
  })

  it('22. clic "Cette année" → clients = 142', () => {
    render(<RapportsPage />)
    fireEvent.click(screen.getByRole('button', { name: /cette année/i }))
    expect(screen.getByText('142')).toBeInTheDocument()
  })
})

// ── Graphiques ───────────────────────────────────────────────────
describe('RapportsPage — graphiques (ComposedChart / BarChart / PieChart / LineChart)', () => {
  it('23. le ComposedChart (CA + kg 12 mois) est rendu', () => {
    render(<RapportsPage />)
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument()
  })

  it('24. le BarChart (kg par céréale) est rendu', () => {
    render(<RapportsPage />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('25. le PieChart (part CA par céréale) est rendu', () => {
    render(<RapportsPage />)
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('26. le LineChart (évolution clients 6 mois) est rendu', () => {
    render(<RapportsPage />)
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })
})

// ── Tableau Top 10 clients ───────────────────────────────────────
describe('RapportsPage — tableau Top 10 clients', () => {
  it('27. le titre "Top 10 clients" est présent', () => {
    render(<RapportsPage />)
    expect(screen.getByText(/top 10 clients/i)).toBeInTheDocument()
  })

  it('28. "Mariam Konaté" figure dans le tableau', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Mariam Konaté')).toBeInTheDocument()
  })

  it('29. "Oumar Diallo" figure dans le tableau', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Oumar Diallo')).toBeInTheDocument()
  })

  it('30. "Bobo-Dioulasso" figure dans le tableau', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Bobo-Dioulasso')).toBeInTheDocument()
  })

  it('31. "Aminata Ouédraogo" figure dans le tableau', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Aminata Ouédraogo')).toBeInTheDocument()
  })

  it('32. "Balkissa Ouattara" (10e client) figure dans le tableau', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Balkissa Ouattara')).toBeInTheDocument()
  })
})

// ── Indicateurs de performance ───────────────────────────────────
describe('RapportsPage — indicateurs de performance', () => {
  it('33. affiche "Meilleur jour de la semaine"', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Meilleur jour de la semaine')).toBeInTheDocument()
  })

  it('34. la valeur "Lundi" est affichée', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Lundi')).toBeInTheDocument()
  })

  it('35. affiche "Heure de pointe"', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Heure de pointe')).toBeInTheDocument()
  })

  it('36. la plage horaire "07:00" est affichée', () => {
    render(<RapportsPage />)
    expect(screen.getByText(/07:00/)).toBeInTheDocument()
  })

  it('37. affiche "Céréale star"', () => {
    render(<RapportsPage />)
    expect(screen.getByText('Céréale star')).toBeInTheDocument()
  })

  it('38. la céréale star est "Maïs"', () => {
    render(<RapportsPage />)
    expect(screen.getAllByText('Maïs').length).toBeGreaterThan(0)
  })
})

// ── Export CSV et alertes ────────────────────────────────────────
describe('RapportsPage — export CSV et alertes métier', () => {
  it('39. clic "Exporter CSV" appelle toast.success', () => {
    render(<RapportsPage />)
    fireEvent.click(screen.getByRole('button', { name: /exporter csv/i }))
    expect(vi.mocked(toast).success).toHaveBeenCalledWith(
      'Export en cours...',
      expect.anything()
    )
  })

  it('40. l\'alerte "CA en hausse ce mois" est visible', () => {
    render(<RapportsPage />)
    expect(screen.getByText(/CA en hausse ce mois/i)).toBeInTheDocument()
  })

  it('41. l\'alerte "Nouveaux clients ce mois" est visible', () => {
    render(<RapportsPage />)
    expect(screen.getByText(/nouveaux clients ce mois/i)).toBeInTheDocument()
  })

  it('42. aucune alerte de rendement pour "Ce mois" (rendement 87% > 80%)', () => {
    render(<RapportsPage />)
    // periode par défaut = month → rendement 87% → pas d'alerte
    expect(screen.queryByText(/en dessous du seuil/i)).not.toBeInTheDocument()
  })
})
