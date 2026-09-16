import '@testing-library/jest-dom/vitest'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { toast } from 'sonner'
import CommandesPage from '../app/(dashboard)/commandes/page'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

/** Saisit une commande dans la modale et valide. */
function saisirCommande(client: string, quantite: string) {
  fireEvent.click(screen.getByRole('button', { name: /nouvelle commande/i }))
  fireEvent.change(screen.getByPlaceholderText(/nom du client/i), { target: { value: client } })
  fireEvent.change(screen.getByPlaceholderText(/quantité/i), { target: { value: quantite } })
  fireEvent.click(screen.getByRole('button', { name: /^créer/i }))
}

describe('Commandes — la saisie survit au rechargement', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.clearAllMocks()
  })
  afterEach(() => vi.restoreAllMocks())

  it("LE DÉFAUT D'ORIGINE : une commande créée était perdue au rechargement", () => {
    const { unmount } = render(<CommandesPage />)
    saisirCommande('Boulangerie Nord', '400')
    expect(screen.getByText('CMD-013')).toBeInTheDocument()

    // On démonte et on remonte : c'est ce que fait un rafraîchissement.
    unmount()
    render(<CommandesPage />)
    expect(screen.getByText('CMD-013')).toBeInTheDocument()
    expect(screen.getByText('Boulangerie Nord')).toBeInTheDocument()
  })

  it('le changement de statut survit aussi', () => {
    const { unmount } = render(<CommandesPage />)
    const boutons = screen.getAllByRole('button', { name: /^prête$/i })
    fireEvent.click(boutons[0])
    unmount()

    render(<CommandesPage />)
    // CMD-003 était « En attente » dans les données initiales.
    expect(window.localStorage.getItem('milltrack:commandes')).toContain('Prête')
  })

  it("n'annonce PAS « créée » quand l'enregistrement échoue", () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw Object.assign(new Error('plein'), { name: 'QuotaExceededError' })
    })
    render(<CommandesPage />)
    saisirCommande('Client Test', '100')

    expect(toast.success).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("n'a PAS été enregistrée"))
  })

  it("garde la saisie de l'opérateur quand l'enregistrement échoue", () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw Object.assign(new Error('plein'), { name: 'QuotaExceededError' })
    })
    render(<CommandesPage />)
    saisirCommande('Client Test', '100')

    // La modale reste ouverte et le champ garde sa valeur : perdre la commande ET
    // la saisie serait une double peine.
    expect(screen.getByPlaceholderText(/nom du client/i)).toHaveValue('Client Test')
  })

  it('une quantité en virgule française donne le bon montant', () => {
    render(<CommandesPage />)
    saisirCommande('Coopérative Sud', '1 250,75')
    const stocke = window.localStorage.getItem('milltrack:commandes')!
    expect(stocke).toContain('"quantiteKg":1250.75')
    expect(stocke).toContain('"montantFCFA":187613')
  })

  it('refuse une quantité invalide sans rien enregistrer', () => {
    render(<CommandesPage />)
    saisirCommande('Client', 'abc')
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('invalide'))
    expect(window.localStorage.getItem('milltrack:commandes')).toBeNull()
  })

  it('repart des données initiales si le stockage est corrompu', () => {
    window.localStorage.setItem('milltrack:commandes', '{ ceci nest pas du JSON')
    render(<CommandesPage />)
    expect(screen.getByText('CMD-001')).toBeInTheDocument()
  })

  it("ignore une donnée d'une forme inattendue plutôt que de planter", () => {
    window.localStorage.setItem('milltrack:commandes', JSON.stringify([{ id: 'X' }]))
    expect(() => render(<CommandesPage />)).not.toThrow()
    expect(screen.getByText('CMD-001')).toBeInTheDocument()
  })
})
