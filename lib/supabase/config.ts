// Une seule source de vérité pour « Supabase est-il configuré sur ce déploiement ? ».
//
// Avant ce fichier, client.ts et server.ts écrivaient `process.env.X!`. L'assertion
// ment : si la variable manque, `createBrowserClient(undefined, undefined)` lève, et
// c'est toute l'application qui tombe en 500 — pas seulement la connexion. Une usine
// qui redéploie sans avoir reporté ses variables perd son tableau de bord entier.
//
// Ici on détecte l'absence au lieu de l'asserter, et le garde d'accès s'en sert pour
// distinguer « personne n'est connecté » de « il n'y a rien pour connecter qui que ce
// soit » : sans cette distinction, l'app affiche « connectez-vous » sur un déploiement
// où se connecter est impossible.

export const URL_ABSENTE = 'http://supabase-non-configure.invalid'
export const CLE_ABSENTE = 'cle-absente'

// `||` et non `??` : une variable définie mais vide est la façon la plus courante de
// désactiver une variable chez un hébergeur, et `??` la laisserait passer telle quelle.
export function urlSupabase(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || URL_ABSENTE
}

export function cleSupabase(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || CLE_ABSENTE
}

export function supabaseConfigure(): boolean {
  return urlSupabase() !== URL_ABSENTE && cleSupabase() !== CLE_ABSENTE
}
