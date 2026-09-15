import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ecrireLocal } from '../lib/persistance-locale'

describe('ecrireLocal — l’échec est rendu, jamais avalé', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })
  afterEach(() => vi.restoreAllMocks())

  it('écrit et renvoie null quand tout va bien', () => {
    expect(ecrireLocal('essai', [1, 2, 3])).toBeNull()
    expect(window.localStorage.getItem('milltrack:essai')).toBe('[1,2,3]')
  })

  it('préfixe les clés, pour ne pas écraser celles d’une autre application', () => {
    ecrireLocal('commandes', [])
    expect(window.localStorage.getItem('commandes')).toBeNull()
    expect(window.localStorage.getItem('milltrack:commandes')).toBe('[]')
  })

  // Les navigateurs ne signalent pas tous le quota de la même façon : c’est
  // exactement pour cela que trois signatures sont reconnues.
  it.each([
    ['le nom moderne', Object.assign(new Error('plein'), { name: 'QuotaExceededError' })],
    ['le nom Firefox', Object.assign(new Error('plein'), { name: 'NS_ERROR_DOM_QUOTA_REACHED' })],
    ['le code 22', Object.assign(new Error('plein'), { name: 'Autre', code: 22 })],
    ['le code 1014', Object.assign(new Error('plein'), { name: 'Autre', code: 1014 })],
  ])('reconnaît le quota par %s', (_, erreur) => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw erreur })
    expect(ecrireLocal('commandes', [])).toEqual({ cle: 'commandes', cause: 'quota' })
  })

  it('classe en « indisponible » un refus qui n’est pas un quota (navigation privée)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw Object.assign(new Error('refusé'), { name: 'SecurityError' })
    })
    expect(ecrireLocal('commandes', [])).toEqual({ cle: 'commandes', cause: 'indisponible' })
  })

  it('classe en échec une valeur que JSON refuse, au lieu de laisser remonter l’exception', () => {
    const cyclique: Record<string, unknown> = {}
    cyclique.soi = cyclique
    expect(ecrireLocal('commandes', cyclique)).toEqual({ cle: 'commandes', cause: 'indisponible' })
  })

  it('ne lève JAMAIS — l’appelant décide quoi dire à l’opérateur', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('boum') })
    expect(() => ecrireLocal('commandes', [])).not.toThrow()
  })
})
