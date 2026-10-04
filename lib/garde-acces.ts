// La décision du garde d'accès, isolée de Next.js pour être testable telle quelle.
//
// Le principe : TOUT est protégé sauf ce qui est explicitement public. L'inverse —
// énumérer les pages du tableau de bord — est précisément ce que fait la PR #2, avec
// `matcher: ['/dashboard/:path*']`. Sur le tronc d'aujourd'hui ce motif ne couvre
// AUCUNE page : les onze pages s'appellent /lots, /machines, /stocks, /production…,
// et `/dashboard/:path*` ne couvre même pas `/dashboard` lui-même, qui n'a pas de
// segment suivant. Un garde vert qui ne garde rien. Ici, une page ajoutée demain est
// protégée sans que personne ait à y penser.

/** Chemins publics exacts. */
const PUBLICS_EXACTS = new Set(['/'])

/** Préfixes publics : tout ce qui commence par là, séparateur compris. */
const PUBLICS_PREFIXES = ['/auth/']

/** Les pages où l'on s'identifie : publiques, mais inutiles une fois connecté. */
const PAGES_AUTH = new Set(['/auth/login', '/auth/register'])

export const APRES_CONNEXION = '/dashboard'
export const PAGE_CONNEXION = '/auth/login'

export type Decision =
  | { action: 'laisser' }
  | { action: 'rediriger'; vers: string }

/** '/lots/' et '/lots' sont la même page ; '/' reste '/'. */
function normaliser(chemin: string): string {
  if (chemin.length > 1 && chemin.endsWith('/')) return chemin.slice(0, -1)
  return chemin
}

export function estPublic(chemin: string): boolean {
  const c = normaliser(chemin)
  return PUBLICS_EXACTS.has(c) || PUBLICS_PREFIXES.some((p) => c.startsWith(p))
}

export function estPageAuth(chemin: string): boolean {
  return PAGES_AUTH.has(normaliser(chemin))
}

/**
 * Là où l'on renvoie l'utilisateur après connexion. Seuls les chemins internes sont
 * acceptés : '//exemple.test' et 'https://exemple.test' sont des URL absolues pour un
 * navigateur ; les laisser passer ferait de la page de connexion une redirection ouverte.
 */
export function suiteSure(brut: string | null | undefined): string | null {
  if (!brut) return null
  if (!brut.startsWith('/') || brut.startsWith('//') || brut.startsWith('/\\')) return null
  return brut
}

export function decisionAcces(contexte: {
  chemin: string
  connecte: boolean
  configure: boolean
}): Decision {
  const { chemin, connecte, configure } = contexte

  // Supabase absent : personne ne peut se connecter. On ferme quand même — un garde qui
  // s'ouvre dès qu'il ne sait pas n'est pas un garde — mais on le dit, pour que la page
  // de connexion explique la situation au lieu de la subir.
  if (!configure) {
    if (estPublic(chemin)) return { action: 'laisser' }
    return { action: 'rediriger', vers: `${PAGE_CONNEXION}?raison=non-configure` }
  }

  if (connecte) {
    if (estPageAuth(chemin)) return { action: 'rediriger', vers: APRES_CONNEXION }
    return { action: 'laisser' }
  }

  if (estPublic(chemin)) return { action: 'laisser' }
  return { action: 'rediriger', vers: `${PAGE_CONNEXION}?suite=${encodeURIComponent(chemin)}` }
}
