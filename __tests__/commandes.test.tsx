import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CommandesPage from '../app/(dashboard)/commandes/page'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() }, Toaster: () => null }))

describe('CommandesPage', () => {
  it('affiche le titre de la page', () => {
    render(<CommandesPage />)
    expect(screen.getByRole('heading', { name: /commandes de mouture/i })).toBeInTheDocument()
  })

  it('affiche les commandes CMD-001 à CMD-010', () => {
    render(<CommandesPage />)
    for (let i = 1; i <= 10; i++) {
      const id = `CMD-${String(i).padStart(3, '0')}`
      expect(screen.getByText(id)).toBeInTheDocument()
    }
  })

  it('affiche les filtres statut et type', () => {
    render(<CommandesPage />)
    expect(screen.getByPlaceholderText(/rechercher client/i)).toBeInTheDocument()
    const statutOptions = ['Tous', 'En attente', 'En cours', 'Prête', 'Livrée', 'Annulée']
    statutOptions.forEach(s => {
      expect(screen.getAllByText(s).length).toBeGreaterThan(0)
    })
  })

  it('affiche le bouton "Prête" pour les commandes En attente', () => {
    render(<CommandesPage />)
    const row = screen.getByText('CMD-003').closest('tr')
    expect(row).not.toBeNull()
    expect(row?.querySelector('button')).not.toBeNull()
    expect(row?.textContent).toMatch(/Prête/)
  })

  it('ouvre le modal Nouvelle commande au clic sur le bouton', () => {
    render(<CommandesPage />)
    expect(screen.queryByRole('heading', { name: 'Nouvelle commande' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /nouvelle commande/i }))
    expect(screen.getByRole('heading', { name: 'Nouvelle commande' })).toBeInTheDocument()
  })
})
