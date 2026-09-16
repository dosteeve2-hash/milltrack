/**
 * Génère l'identifiant de commande suivant.
 *
 * L'implémentation précédente était `CMD-${commandes.length + 1}`. Tant que rien
 * n'est jamais retiré de la liste, elle tombe juste par accident. Elle cesse de
 * l'être dès qu'une commande est supprimée ou filtrée à l'enregistrement : la
 * longueur retombe sur un numéro déjà attribué, et deux commandes différentes
 * portent le même identifiant.
 *
 * Maintenant que les commandes SURVIVENT à la session, cette fragilité ne peut
 * plus rester : on dérive du plus grand numéro existant, pas du compte.
 */
export function prochainIdentifiant(existants: readonly string[], prefixe = 'CMD'): string {
  let max = 0
  for (const id of existants) {
    const m = new RegExp(`^${prefixe}-(\\d+)$`).exec(id)
    if (m) {
      const n = Number(m[1])
      if (Number.isFinite(n) && n > max) max = n
    }
  }
  return `${prefixe}-${String(max + 1).padStart(3, '0')}`
}
