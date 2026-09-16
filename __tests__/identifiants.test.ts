import { describe, it, expect } from 'vitest'
import { prochainIdentifiant } from '../lib/identifiants'

describe('prochainIdentifiant', () => {
  it('suit le plus grand numéro existant', () => {
    expect(prochainIdentifiant(['CMD-001', 'CMD-002', 'CMD-012'])).toBe('CMD-013')
  })

  it('ne se laisse pas tromper par un trou dans la numérotation', () => {
    // Le défaut de `length + 1` : trois éléments donneraient CMD-004,
    // qui existe déjà.
    const avecTrou = ['CMD-001', 'CMD-004', 'CMD-009']
    expect(avecTrou.length + 1).toBe(4) // l'ancienne formule
    expect(prochainIdentifiant(avecTrou)).toBe('CMD-010')
  })

  it("ne réattribue jamais un identifiant déjà pris", () => {
    let ids = ['CMD-001', 'CMD-002', 'CMD-003']
    for (let i = 0; i < 20; i++) {
      const suivant = prochainIdentifiant(ids)
      expect(ids).not.toContain(suivant)
      ids = [...ids, suivant]
    }
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('reste correct après une suppression — le cas qui cassait', () => {
    const apresSuppression = ['CMD-001', 'CMD-003'] // CMD-002 retirée
    expect(apresSuppression.length + 1).toBe(3) // l'ancienne formule : collision
    expect(prochainIdentifiant(apresSuppression)).toBe('CMD-004')
  })

  it('part de 1 sur une liste vide', () => {
    expect(prochainIdentifiant([])).toBe('CMD-001')
  })

  it('ignore les identifiants qui ne suivent pas le format', () => {
    expect(prochainIdentifiant(['CMD-002', 'brouillon', 'LOT-999'])).toBe('CMD-003')
  })

  it('accepte un autre préfixe', () => {
    expect(prochainIdentifiant(['LOT-007'], 'LOT')).toBe('LOT-008')
  })
})
