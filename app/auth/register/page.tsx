import Link from 'next/link'

import { signUp } from '@/app/actions/auth'
import CarteAuth, { Bouton, Champ } from '@/app/auth/CarteAuth'
import { supabaseConfigure } from '@/lib/supabase/config'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  const configure = supabaseConfigure()

  return (
    <CarteAuth
      titre="Créer un compte"
      soustitre="Suivez votre production, vos lots et vos stocks."
      erreur={params.error}
      message={params.message}
      enBas={
        <>
          Vous avez déjà un compte ?{' '}
          <Link href="/auth/login" style={{ color: '#D4AF37' }} className="font-medium hover:opacity-80">
            Se connecter
          </Link>
        </>
      }
    >
      <form action={signUp} className="space-y-4">
        <Champ nom="email" label="Email" type="email" placeholder="vous@exemple.com" autoComplete="email" desactive={!configure} />
        <Champ nom="password" label="Mot de passe" type="password" placeholder="8 caractères minimum" autoComplete="new-password" desactive={!configure} />
        <Bouton desactive={!configure}>Créer mon compte</Bouton>
      </form>
    </CarteAuth>
  )
}
