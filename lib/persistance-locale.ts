'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Persistance locale des données saisies dans l'atelier.
 *
 * Pourquoi ce module existe : les commandes de mouture vivaient dans un
 * `useState`. Un rafraîchissement, un onglet fermé, un téléphone qui s'endort —
 * et tout ce que l'opérateur avait saisi disparaissait. Pire, l'application lui
 * disait « Commande CMD-011 créée » : elle affirmait un enregistrement qui
 * n'avait pas eu lieu.
 *
 * `VISION.md §4` range ce cas parmi les cas NOMINAUX, pas les cas limites :
 * réseau 2G/3G intermittent, batterie faible, stockage plein. Un outil de suivi
 * de production qui perd la saisie d'une équipe est un outil qu'on n'utilise pas
 * deux fois.
 *
 * Le stockage est `localStorage` : aucune base de données, aucun réseau, donc
 * l'application fonctionne hors ligne — c'est le point 1 de la doctrine.
 */

const PREFIXE = 'milltrack:'

export type EchecEcriture = {
  cle: string
  cause: 'quota' | 'indisponible'
}

/* ─────────────────────────── lecture ─────────────────────────── */

function lireBrut(cle: string): string | null {
  try {
    return window.localStorage.getItem(PREFIXE + cle)
  } catch {
    // Navigation privée, stockage bloqué par la politique du navigateur…
    return null
  }
}

/**
 * Le cache est indispensable, pas une optimisation : `useSyncExternalStore`
 * exige un instantané STABLE. Sans lui, chaque rendu renverrait un tableau
 * fraîchement analysé — une nouvelle référence à chaque fois — et React
 * boucherait indéfiniment en croyant l'état toujours modifié.
 */
const cache = new Map<string, { brut: string | null; valeur: unknown }>()

function instantane<T>(cle: string, initial: T, estValide: (v: unknown) => v is T): T {
  const brut = lireBrut(cle)
  const enCache = cache.get(cle)
  if (enCache && enCache.brut === brut) return enCache.valeur as T

  let valeur: T = initial
  if (brut !== null) {
    try {
      const analyse: unknown = JSON.parse(brut)
      // Une donnée d'une version antérieure, ou corrompue, ne doit pas faire
      // planter la page : on repart des valeurs initiales.
      if (estValide(analyse)) valeur = analyse
    } catch {
      valeur = initial
    }
  }
  cache.set(cle, { brut, valeur })
  return valeur
}

/* ─────────────────────────── écriture ─────────────────────────── */

/**
 * Renvoie l'échec au lieu de l'avaler. Un `catch {}` vide autour d'un
 * `setItem` est précisément ce qui fait qu'une donnée perdue s'affiche comme
 * enregistrée.
 */
export function ecrireLocal(cle: string, valeur: unknown): EchecEcriture | null {
  let brut: string
  try {
    brut = JSON.stringify(valeur)
  } catch {
    return { cle, cause: 'indisponible' }
  }
  try {
    window.localStorage.setItem(PREFIXE + cle, brut)
    cache.set(cle, { brut, valeur })
    prevenir(cle)
    return null
  } catch (e) {
    // Les navigateurs ne renseignent pas tous les mêmes champs : le nom d'erreur
    // suffit sur les récents, les codes 22 et 1014 rattrapent les mobiles anciens.
    const err = e as { name?: string; code?: number }
    const quota =
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014
    return { cle, cause: quota ? 'quota' : 'indisponible' }
  }
}

/* ─────────────────────── abonnement ─────────────────────── */

const abonnes = new Map<string, Set<() => void>>()

function prevenir(cle: string) {
  abonnes.get(cle)?.forEach((f) => f())
}

function abonner(cle: string, onChange: () => void): () => void {
  let pour = abonnes.get(cle)
  if (!pour) {
    pour = new Set()
    abonnes.set(cle, pour)
  }
  pour.add(onChange)

  // L'événement `storage` ne se déclenche que dans les AUTRES onglets — d'où le
  // registre local ci-dessus pour l'onglet courant. Ensemble, les deux gardent
  // deux onglets du même atelier d'accord entre eux.
  const surStorage = (e: StorageEvent) => {
    if (e.key === PREFIXE + cle) onChange()
  }
  window.addEventListener('storage', surStorage)

  return () => {
    pour!.delete(onChange)
    window.removeEventListener('storage', surStorage)
  }
}

/* ─────────────────────────── le hook ─────────────────────────── */

export type Persiste<T> = {
  valeur: T
  /** Écrit, et renvoie l'échec s'il y en a un — à ne jamais ignorer. */
  ecrire: (suivant: T) => EchecEcriture | null
}

/**
 * `useSyncExternalStore` plutôt que `useState` + `useEffect` : c'est la primitive
 * prévue pour lire un état extérieur à React, et elle déclare explicitement
 * l'instantané SERVEUR. Le rendu serveur renvoie donc `initial`, sans jamais
 * toucher `localStorage` — pas de divergence d'hydratation.
 */
export function useDonneesPersistees<T>(
  cle: string,
  initial: T,
  estValide: (v: unknown) => v is T
): Persiste<T> {
  const valeur = useSyncExternalStore(
    useCallback((onChange: () => void) => abonner(cle, onChange), [cle]),
    () => instantane(cle, initial, estValide),
    () => initial
  )

  const ecrire = useCallback((suivant: T) => ecrireLocal(cle, suivant), [cle])

  return { valeur, ecrire }
}
