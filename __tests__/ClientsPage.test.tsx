import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ClientsPage from '../app/(dashboard)/clients/page'

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

// ── Rendu de base ────────────────────────────────────────────────
describe('ClientsPage — rendu de base', () => {
  it('1. affiche le titre "Clients"', () => {
    render(<ClientsPage />)
    // /clients/i matchait aussi le h2 « Top 5 clients par kg traités ».
    expect(screen.getByRole('heading', { level: 1, name: 'Clients' })).toBeInTheDocument()
  })

  it('2. affiche le sous-titre "Gestion des clients du moulin"', () => {
    render(<ClientsPage />)
    expect(screen.getByText(/gestion des clients du moulin/i)).toBeInTheDocument()
  })

  it('3. affiche le bouton "Nouveau client"', () => {
    render(<ClientsPage />)
    expect(screen.getByRole('button', { name: /nouveau client/i })).toBeInTheDocument()
  })
})

// ── KPIs ─────────────────────────────────────────────────────────
describe('ClientsPage — KPIs', () => {
  it('4. affiche le label "Total clients"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('Total clients')).toBeInTheDocument()
  })

  it('5. affiche le label "Clients réguliers"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('Clients réguliers')).toBeInTheDocument()
  })

  it('6. affiche le label "Nouveaux ce mois"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('Nouveaux ce mois')).toBeInTheDocument()
  })

  it('7. affiche le label "CA clients fidèles"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('CA clients fidèles')).toBeInTheDocument()
  })

  it('8. la valeur total clients est 10', () => {
    render(<ClientsPage />)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('9. la valeur clients réguliers est 6', () => {
    render(<ClientsPage />)
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('10. la valeur nouveaux ce mois est 2', () => {
    render(<ClientsPage />)
    expect(screen.getAllByText('2').length).toBeGreaterThan(0)
  })
})

// ── Noms clients (villages burkinabè) ────────────────────────────
describe('ClientsPage — noms clients burkinabè', () => {
  it('11. affiche "Aminata Ouédraogo"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('Aminata Ouédraogo')).toBeInTheDocument()
  })

  it('12. affiche "Mariam Konaté"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('Mariam Konaté')).toBeInTheDocument()
  })

  it('13. affiche "Boureima Kaboré"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('Boureima Kaboré')).toBeInTheDocument()
  })

  it('14. affiche "Rasmata Compaoré"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('Rasmata Compaoré')).toBeInTheDocument()
  })

  it('15. affiche "Idrissa Coulibaly"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('Idrissa Coulibaly')).toBeInTheDocument()
  })

  it('16. affiche le village "Kombissiri"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('Kombissiri')).toBeInTheDocument()
  })

  it('17. affiche le village "Tenkodogo"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('Tenkodogo')).toBeInTheDocument()
  })

  it('18. affiche le village "Manga"', () => {
    render(<ClientsPage />)
    expect(screen.getByText('Manga')).toBeInTheDocument()
  })
})

// ── Céréales habituelles ─────────────────────────────────────────
describe('ClientsPage — céréales habituelles', () => {
  it('19. affiche la céréale "Maïs" dans la liste', () => {
    render(<ClientsPage />)
    expect(screen.getAllByText('Maïs').length).toBeGreaterThan(0)
  })

  it('20. affiche la céréale "Sorgho" dans la liste', () => {
    render(<ClientsPage />)
    expect(screen.getAllByText('Sorgho').length).toBeGreaterThan(0)
  })

  it('21. affiche la céréale "Fonio" dans la liste', () => {
    render(<ClientsPage />)
    expect(screen.getAllByText('Fonio').length).toBeGreaterThan(0)
  })
})

// ── Filtre statut ────────────────────────────────────────────────
describe('ClientsPage — filtre statut', () => {
  it('22. le select "Tous statuts" est présent par défaut', () => {
    render(<ClientsPage />)
    expect(screen.getByDisplayValue('Tous statuts')).toBeInTheDocument()
  })

  it('23. l\'option "Régulier" est disponible dans le filtre', () => {
    render(<ClientsPage />)
    expect(screen.getAllByRole('option', { name: 'Régulier' }).length).toBeGreaterThan(0)
  })

  it('24. l\'option "Occasionnel" est disponible dans le filtre', () => {
    render(<ClientsPage />)
    expect(screen.getAllByRole('option', { name: 'Occasionnel' }).length).toBeGreaterThan(0)
  })

  it('25. filtre "Régulier" masque Fatoumata Traoré (Occasionnelle)', () => {
    render(<ClientsPage />)
    fireEvent.change(screen.getByDisplayValue('Tous statuts'), { target: { value: 'Régulier' } })
    expect(screen.queryByText('Fatoumata Traoré')).not.toBeInTheDocument()
  })

  it('26. filtre "Régulier" garde Aminata Ouédraogo visible', () => {
    render(<ClientsPage />)
    fireEvent.change(screen.getByDisplayValue('Tous statuts'), { target: { value: 'Régulier' } })
    expect(screen.getByText('Aminata Ouédraogo')).toBeInTheDocument()
  })

  it('27. filtre "Nouveau" masque Aminata Ouédraogo (Régulière)', () => {
    render(<ClientsPage />)
    fireEvent.change(screen.getByDisplayValue('Tous statuts'), { target: { value: 'Nouveau' } })
    expect(screen.queryByText('Aminata Ouédraogo')).not.toBeInTheDocument()
  })

  it('28. filtre "Nouveau" affiche Salif Sawadogo', () => {
    render(<ClientsPage />)
    fireEvent.change(screen.getByDisplayValue('Tous statuts'), { target: { value: 'Nouveau' } })
    expect(screen.getByText('Salif Sawadogo')).toBeInTheDocument()
  })
})

// ── Recherche ────────────────────────────────────────────────────
describe('ClientsPage — recherche', () => {
  it('29. la recherche par nom réduit la liste', () => {
    render(<ClientsPage />)
    const input = screen.getByPlaceholderText(/rechercher par nom ou village/i)
    fireEvent.change(input, { target: { value: 'Mariam' } })
    expect(screen.getByText('Mariam Konaté')).toBeInTheDocument()
    expect(screen.queryByText('Aminata Ouédraogo')).not.toBeInTheDocument()
  })

  it('30. la recherche par village filtre correctement', () => {
    render(<ClientsPage />)
    const input = screen.getByPlaceholderText(/rechercher par nom ou village/i)
    fireEvent.change(input, { target: { value: 'Kombissiri' } })
    expect(screen.getByText('Aminata Ouédraogo')).toBeInTheDocument()
    expect(screen.queryByText('Boureima Kaboré')).not.toBeInTheDocument()
  })

  it('31. une recherche sans résultat affiche "Aucun client trouvé"', () => {
    render(<ClientsPage />)
    const input = screen.getByPlaceholderText(/rechercher par nom ou village/i)
    fireEvent.change(input, { target: { value: 'xyzimpossible' } })
    expect(screen.getByText(/aucun client trouvé/i)).toBeInTheDocument()
  })
})

// ── Modal nouveau client ─────────────────────────────────────────
describe('ClientsPage — modal nouveau client', () => {
  it('32. le modal s\'ouvre au clic sur "Nouveau client"', () => {
    render(<ClientsPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau client/i }))
    expect(screen.getByText('Nom complet')).toBeInTheDocument()
  })

  it('33. le modal contient le champ "Téléphone"', () => {
    render(<ClientsPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau client/i }))
    expect(screen.getByText('Téléphone')).toBeInTheDocument()
  })

  it('34. le modal contient le champ "Village"', () => {
    render(<ClientsPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau client/i }))
    // « Village » est aussi un en-tête de colonne du tableau : on cible le
    // champ par son étiquette, ce qui vérifie au passage leur association.
    expect(screen.getByLabelText('Village')).toBeInTheDocument()
  })

  it('35. le modal contient le bouton "Enregistrer"', () => {
    render(<ClientsPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau client/i }))
    expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument()
  })

  it('36. le modal se ferme en cliquant sur "Annuler"', () => {
    render(<ClientsPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau client/i }))
    expect(screen.getByText('Nom complet')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }))
    expect(screen.queryByText('Nom complet')).not.toBeInTheDocument()
  })
})

// ── Détail client (ligne expandée) ──────────────────────────────
describe('ClientsPage — détail client expandé', () => {
  it('37. cliquer sur une ligne révèle "Total dépensé"', () => {
    render(<ClientsPage />)
    fireEvent.click(screen.getByText('Aminata Ouédraogo'))
    expect(screen.getByText('Total dépensé')).toBeInTheDocument()
  })

  it('38. cliquer sur une ligne révèle "Céréale habituelle"', () => {
    render(<ClientsPage />)
    fireEvent.click(screen.getByText('Aminata Ouédraogo'))
    expect(screen.getAllByText('Céréale habituelle').length).toBeGreaterThan(0)
  })
})

// ── BarChart Top 5 ───────────────────────────────────────────────
describe('ClientsPage — BarChart Top 5 clients', () => {
  it('39. le titre "Top 5 clients par kg traités" est présent', () => {
    render(<ClientsPage />)
    expect(screen.getByText(/top 5 clients par kg traités/i)).toBeInTheDocument()
  })

  it('40. le BarChart est rendu dans la page', () => {
    render(<ClientsPage />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })
})
