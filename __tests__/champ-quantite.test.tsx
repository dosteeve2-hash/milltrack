import '@testing-library/jest-dom/vitest'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

/**
 * Pourquoi le champ quantité n'est plus un `<input type="number">`.
 *
 * Un champ numérique n'accepte que la notation anglaise. Une saisie française —
 * virgule décimale, espaces de milliers — est REJETÉE par le champ lui-même :
 * `value` devient la chaîne vide. L'opérateur tape « 1 250,75 », le champ retient
 * « rien », et l'application répond « quantité invalide » sur une saisie
 * parfaitement correcte en français.
 *
 * `type="text"` + `inputMode="decimal"` laisse passer la saisie et garde le pavé
 * numérique sur mobile ; c'est `lireQuantite` qui l'interprète.
 */
describe('le champ quantité doit laisser passer une saisie française', () => {
  it('type="number" DÉTRUIT une saisie française', () => {
    render(<input type="number" data-testid="c" defaultValue="" />)
    const el = screen.getByTestId('c') as HTMLInputElement

    fireEvent.change(el, { target: { value: '1 250,75' } })
    expect(el.value).toBe('') // la saisie est perdue

    fireEvent.change(el, { target: { value: '12,5' } })
    expect(el.value).toBe('') // perdue aussi
  })

  it('type="text" + inputMode="decimal" la conserve', () => {
    render(<input type="text" inputMode="decimal" data-testid="c" defaultValue="" />)
    const el = screen.getByTestId('c') as HTMLInputElement

    fireEvent.change(el, { target: { value: '1 250,75' } })
    expect(el.value).toBe('1 250,75')

    fireEvent.change(el, { target: { value: '12,5' } })
    expect(el.value).toBe('12,5')
  })
})
