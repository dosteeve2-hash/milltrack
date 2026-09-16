/**
 * Lecture d'une quantité saisie par un opérateur francophone.
 *
 * `parseFloat` lit le point décimal anglais et s'arrête au premier caractère
 * qu'il ne comprend pas. Sur un produit francophone c'est un piège silencieux —
 * il ne renvoie pas d'erreur, il renvoie un nombre FAUX :
 *
 *     parseFloat('12,5')      →  12      au lieu de 12,5
 *     parseFloat('1 250,75')  →  1       au lieu de 1250,75
 *     parseFloat('0,5')       →  0       au lieu de 0,5
 *
 * Une commande de 1 250,75 kg devient une commande de 1 kg, et son montant passe
 * de 187 613 à 150 FCFA. Rien ne le signale.
 *
 * Le champ est aujourd'hui un `<input type="number">`, et ce que le navigateur
 * fait d'une virgule dépend de lui et de la locale du système. Plutôt que de
 * parier sur ce comportement, on accepte les deux écritures : la question ne se
 * pose plus.
 *
 * C'est la même leçon que celle déjà tirée sur ValueChain Connect — la virgule
 * décimale n'est pas un cas limite sur un produit francophone, c'est le cas
 * nominal.
 */
export function lireQuantite(saisie: string): number | null {
  const nettoye = saisie
    .trim()
    // Espaces de séparation des milliers, y compris l'insécable étroit (U+202F)
    // que produit `Intl.NumberFormat('fr-FR')`, et l'insécable (U+00A0).
    .replace(/[\s  ]/g, '')
    .replace(',', '.')

  if (nettoye === '') return null

  // `Number` refuse ce que `parseFloat` accepterait à moitié : '12abc' vaut NaN
  // au lieu de 12.
  const n = Number(nettoye)
  if (!Number.isFinite(n) || n <= 0) return null
  return n
}
