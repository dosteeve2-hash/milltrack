import { describe, it, expect } from 'vitest'
import { lireQuantite } from '../lib/quantite'

describe('lireQuantite — la virgule décimale française', () => {
  it('lit la virgule comme séparateur décimal', () => {
    expect(lireQuantite('12,5')).toBe(12.5)
    expect(lireQuantite('0,5')).toBe(0.5)
  })

  it('lit aussi le point, pour ne rien casser', () => {
    expect(lireQuantite('12.5')).toBe(12.5)
  })

  it('accepte les espaces de séparation des milliers, y compris insécables', () => {
    expect(lireQuantite('1 250,75')).toBe(1250.75)
    expect(lireQuantite('1 250,75')).toBe(1250.75) // insécable
    expect(lireQuantite('1 250,75')).toBe(1250.75) // insécable étroit, produit par Intl
  })

  it("là où parseFloat renvoyait un nombre FAUX sans le signaler", () => {
    // Le défaut d'origine, documenté par le contraste.
    expect(parseFloat('12,5')).toBe(12)
    expect(lireQuantite('12,5')).toBe(12.5)

    expect(parseFloat('1 250,75')).toBe(1)
    expect(lireQuantite('1 250,75')).toBe(1250.75)

    expect(parseFloat('0,5')).toBe(0)
    expect(lireQuantite('0,5')).toBe(0.5)
  })

  it('refuse ce que parseFloat acceptait à moitié', () => {
    expect(parseFloat('12abc')).toBe(12)
    expect(lireQuantite('12abc')).toBeNull()
  })

  it('refuse le vide, le zéro et le négatif', () => {
    expect(lireQuantite('')).toBeNull()
    expect(lireQuantite('   ')).toBeNull()
    expect(lireQuantite('0')).toBeNull()
    expect(lireQuantite('-5')).toBeNull()
  })

  it("refuse l'infini et le non-numérique", () => {
    expect(lireQuantite('Infinity')).toBeNull()
    expect(lireQuantite('abc')).toBeNull()
  })

  it('le montant FCFA suit la quantité réelle', () => {
    const q = lireQuantite('1 250,75')!
    expect(Math.round(q * 150)).toBe(187613)
    // Avec parseFloat, la même commande était facturée 150 FCFA.
    expect(Math.round(parseFloat('1 250,75') * 150)).toBe(150)
  })
})
