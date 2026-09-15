import Link from 'next/link'

import { signIn } from '@/app/actions/auth'
import CarteAuth, { Bouton, Champ } from '@/app/auth/CarteAuth'
import { suiteSure } from '@/lib/garde-acces'
import { supabaseConfigure } from '@/lib/supabase/config'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; suite?: string; raison?: string }>
}) {
  const params = await searchParams
  const configure = supabaseConfigure()
  // Revalidé ici alors que le middleware l'a déjà fait : cette page est atteignable
  // directement, avec le paramètre qu'on veut.
  const suite = suiteSure(params.suite)

  return (
    <CarteAuth
      titre="Connexion"
      soustitre="Accédez à votre espace de suivi production."
      erreur={params.error}
      message={params.message}
      enBas={
        <>
          Pas encore de compte ?{' '}
          <Link href="/auth/register" style={{ color: '#D4AF37' }} className="font-medium hover:opacity-80">
            Créer un compte
          </Link>
        </>
      }
    >
      <form action={signIn} className="space-y-4">
        {suite && <input type="hidden" name="suite" value={suite} />}
        <Champ nom="email" label="Email" type="email" placeholder="vous@exemple.com" autoComplete="email" desactive={!configure} />
        <Champ nom="password" label="Mot de passe" type="password" placeholder="••••••••" autoComplete="current-password" desactive={!configure} />
        <Bouton desactive={!configure}>Se connecter</Bouton>
      </form>
    </CarteAuth>
  )
}
