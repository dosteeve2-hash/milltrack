import { NextRequest, NextResponse } from 'next/server'

import { APRES_CONNEXION, PAGE_CONNEXION, suiteSure } from '@/lib/garde-acces'
import { createClient } from '@/lib/supabase/server'
import { supabaseConfigure } from '@/lib/supabase/config'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Validé, pas repris tel quel : `next` vient de l'URL, et une redirection construite
  // sur une valeur non vérifiée est une redirection ouverte qui attend son tour.
  const suite = suiteSure(searchParams.get('next')) ?? APRES_CONNEXION

  if (code && supabaseConfigure()) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(suite, origin))
  }

  const message = supabaseConfigure()
    ? 'Erreur lors de la confirmation. Réessayez.'
    : "Ce déploiement n'a pas de Supabase configuré : la confirmation est impossible."
  return NextResponse.redirect(
    new URL(`${PAGE_CONNEXION}?error=${encodeURIComponent(message)}`, origin)
  )
}
