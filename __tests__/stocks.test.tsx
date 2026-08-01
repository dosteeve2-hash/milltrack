import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import StocksPage from '../app/(dashboard)/stocks/page'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() }, Toaster: () => null }))

describe('StocksPage', () => {
  it('affiche le titre de la page', () => {
    render(<StocksPage />)
    expect(screen.getByRole('heading', { name: 'Stocks matières' })).toBeInTheDocument()
  })

  it('affiche les 8 matières premières', () => {
    render(<StocksPage />)
    const noms = [
      'Maïs brut', 'Blé tendre', 'Sorgho', 'Soja',
      'Son de blé (stocké)', 'Farine blanche', 'Farine de maïs', 'Farine de soja',
    ]
    noms.forEach(nom => {
      expect(screen.getByText(nom)).toBeInTheDocument()
    })
  })

  it('affiche les libellés des cartes KPI', () => {
    render(<StocksPage />)
    expect(screen.getByText('Stock total')).toBeInTheDocument()
    expect(screen.getByText('Valeur totale')).toBeInTheDocument()
    expect(screen.getByText('Alertes stock')).toBeInTheDocument()
    expect(screen.getByText('Capacité utilisée')).toBeInTheDocument()
  })

  it('affiche le badge Critique pour un stock très bas (Blé tendre 8%)', () => {
    render(<StocksPage />)
    const row = screen.getByText('Blé tendre').closest('tr') as HTMLElement
    expect(row).not.toBeNull()
    expect(within(row).getByText('Critique')).toBeInTheDocument()
  })

  it('affiche le badge Bas pour un stock faible (Maïs brut 24.8%)', () => {
    render(<StocksPage />)
    const row = screen.getByText('Maïs brut').closest('tr') as HTMLElement
    expect(row).not.toBeNull()
    expect(within(row).getByText('Bas')).toBeInTheDocument()
  })

  it('affiche le badge Normal pour un stock correct (Farine blanche 73%)', () => {
    render(<StocksPage />)
    const row = screen.getByText('Farine blanche').closest('tr') as HTMLElement
    expect(row).not.toBeNull()
    expect(within(row).getByText('Normal')).toBeInTheDocument()
  })

  it('ouvre le modal Entrée stock au clic sur le bouton', () => {
    render(<StocksPage />)
    expect(screen.queryByRole('heading', { name: 'Entrée stock' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /entrée stock/i }))
    expect(screen.getByRole('heading', { name: 'Entrée stock' })).toBeInTheDocument()
  })
})
