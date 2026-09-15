import { describe, it, expect } from 'vitest'

import { decisionAcces, estPublic, suiteSure, APRES_CONNEXION, PAGE_CONNEXION } from '@/lib/garde-acces'

const CONFIGURE = { configure: true }
const SANS_SUPABASE = { configure: false }

// Les onze pages du tableau de bord, telles qu'elles existent sur le tronc.
const PAGES_TABLEAU = [
  '/dashboard', '/broyages', '/lots', '/production', '/clients', '/machines',
  '/maintenance', '/stocks', '/ventes', '/commandes', '/rapports',
]

describe('estPublic', () => {
  it("n'ouvre que la vitrine et les pages d'identification", () => {
    for (const c of ['/', '/auth/login', '/auth/register', '/auth/callback'])
      expect(estPublic(c), c).toBe(true)
  })

  it('ferme les onze pages du tableau de bord', () => {
    for (const c of PAGES_TABLEAU) expect(estPublic(c), c).toBe(false)
  })

  it("ne confond pas un préfixe public avec un chemin qui commence pareil", () => {
    expect(estPublic('/authentification-interne')).toBe(false)
  })

  it('traite /lots/ comme /lots, et garde / public', () => {
    expect(estPublic('/lots/')).toBe(false)
    expect(estPublic('/')).toBe(true)
  })

  it("normalise le slash final là où ça change la décision", () => {
    // Sans normalisation, '/auth/login/' n'est plus reconnu comme page
    // d'identification : un utilisateur déjà connecté y resterait au lieu d'être
    // renvoyé au tableau de bord. Le test précédent ne le voyait pas — vérifié en
    // supprimant la normalisation : il restait vert.
    expect(decisionAcces({ chemin: '/auth/login/', connecte: true, ...CONFIGURE }))
      .toEqual({ action: 'rediriger', vers: APRES_CONNEXION })
  })
})

describe('le défaut que corrige ce garde', () => {
  it("ferme les pages qu'un matcher /dashboard/:path* laissait toutes ouvertes", () => {
    // La PR #2 protège `/dashboard/:path*`. Aucune des onze pages ne commence par
    // `/dashboard/`, et le motif ne couvre même pas `/dashboard`, qui n'a pas de
    // segment suivant. Ce test échouerait si on revenait à cette liste noire.
    for (const chemin of PAGES_TABLEAU)
      expect(decisionAcces({ chemin, connecte: false, ...CONFIGURE }).action, chemin)
        .toBe('rediriger')
  })
})

describe('decisionAcces — Supabase configuré, personne connecté', () => {
  it('renvoie vers la connexion en gardant la page demandée', () => {
    expect(decisionAcces({ chemin: '/lots', connecte: false, ...CONFIGURE })).toEqual({
      action: 'rediriger',
      vers: `${PAGE_CONNEXION}?suite=%2Flots`,
    })
  })

  it("laisse passer la vitrine et les pages d'identification", () => {
    for (const chemin of ['/', '/auth/login', '/auth/register', '/auth/callback'])
      expect(decisionAcces({ chemin, connecte: false, ...CONFIGURE }), chemin)
        .toEqual({ action: 'laisser' })
  })
})

describe('decisionAcces — Supabase configuré, utilisateur connecté', () => {
  it('ouvre le tableau de bord', () => {
    for (const chemin of PAGES_TABLEAU)
      expect(decisionAcces({ chemin, connecte: true, ...CONFIGURE }), chemin)
        .toEqual({ action: 'laisser' })
  })

  it("ne laisse pas se reconnecter quelqu'un de déjà connecté", () => {
    for (const chemin of ['/auth/login', '/auth/register'])
      expect(decisionAcces({ chemin, connecte: true, ...CONFIGURE }), chemin)
        .toEqual({ action: 'rediriger', vers: APRES_CONNEXION })
  })

  it('laisse le callback faire son travail même connecté', () => {
    expect(decisionAcces({ chemin: '/auth/callback', connecte: true, ...CONFIGURE }))
      .toEqual({ action: 'laisser' })
  })
})

describe('decisionAcces — Supabase absent du déploiement', () => {
  it('ferme quand même le tableau de bord, et dit pourquoi', () => {
    expect(decisionAcces({ chemin: '/stocks', connecte: false, ...SANS_SUPABASE })).toEqual({
      action: 'rediriger',
      vers: `${PAGE_CONNEXION}?raison=non-configure`,
    })
  })

  it("laisse la page de connexion s'afficher pour porter le message", () => {
    expect(decisionAcces({ chemin: '/auth/login', connecte: false, ...SANS_SUPABASE }))
      .toEqual({ action: 'laisser' })
  })

  it("ne rouvre rien même si un cookie prétend que quelqu'un est connecté", () => {
    // Sans Supabase, rien ne peut vérifier un cookie : « connecté » n'y veut rien dire.
    expect(decisionAcces({ chemin: '/stocks', connecte: true, ...SANS_SUPABASE }))
      .toEqual({ action: 'rediriger', vers: `${PAGE_CONNEXION}?raison=non-configure` })
  })
})

describe('une page ajoutée demain', () => {
  it("est protégée sans que personne ait pensé à l'inscrire quelque part", () => {
    expect(decisionAcces({ chemin: '/nouvelle-page', connecte: false, ...CONFIGURE }))
      .toEqual({ action: 'rediriger', vers: `${PAGE_CONNEXION}?suite=%2Fnouvelle-page` })
  })
})

describe('suiteSure', () => {
  it('accepte un chemin interne', () => {
    expect(suiteSure('/stocks')).toBe('/stocks')
    expect(suiteSure('/lots/L-2026-014')).toBe('/lots/L-2026-014')
  })

  it("refuse tout ce qu'un navigateur lirait comme une autre origine", () => {
    for (const brut of ['//exemple.test', 'https://exemple.test', '/\\exemple.test', 'exemple.test'])
      expect(suiteSure(brut), brut).toBeNull()
  })

  it('refuse le vide', () => {
    expect(suiteSure(null)).toBeNull()
    expect(suiteSure('')).toBeNull()
    expect(suiteSure(undefined)).toBeNull()
  })
})
