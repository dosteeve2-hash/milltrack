'use server'

import { redirect } from 'next/navigation'

import { APRES_CONNEXION, PAGE_CONNEXION, suiteSure } from '@/lib/garde-acces'
import { createClient } from '@/lib/supabase/server'
import { supabaseConfigure } from '@/lib/supabase/config'

const SANS_SUPABASE = "Ce déploiement n'a pas de Supabase configuré : la connexion est impossible."

export async function signOut() {
  if (supabaseConfigure()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  redirect(PAGE_CONNEXION)
}

export async function signIn(formData: FormData) {
  // Chaque Server Action revalide pour elle-même : le middleware protège la navigation,
  // pas les appels d'action, qui arrivent en POST sur n'importe quelle route.
  if (!supabaseConfigure()) {
    redirect(`${PAGE_CONNEXION}?error=${encodeURIComponent(SANS_SUPABASE)}`)
  }

  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const suite = suiteSure(String(formData.get('suite') ?? '')) ?? APRES_CONNEXION

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    const message =
      error.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : error.message
    redirect(`${PAGE_CONNEXION}?error=${encodeURIComponent(message)}&suite=${encodeURIComponent(suite)}`)
  }

  redirect(suite)
}

export async function signUp(formData: FormData) {
  if (!supabaseConfigure()) {
    redirect(`/auth/register?error=${encodeURIComponent(SANS_SUPABASE)}`)
  }

  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    redirect(`/auth/register?error=${encodeURIComponent(error.message)}`)
  }

  redirect(
    `${PAGE_CONNEXION}?message=${encodeURIComponent('Vérifiez votre email pour confirmer votre compte.')}`
  )
}
