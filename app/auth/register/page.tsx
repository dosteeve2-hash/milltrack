import Link from 'next/link'
import { Factory, AlertCircle } from 'lucide-react'
import { signUp } from '@/app/actions/auth'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const error = params.error

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0A1628' }}
    >
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Factory className="w-8 h-8" style={{ color: '#D4AF37' }} />
          <span className="font-bold text-2xl" style={{ color: '#f0f4ff' }}>
            MillTrack
          </span>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h1 className="text-xl font-bold mb-1" style={{ color: '#f0f4ff' }}>
            Créer un compte
          </h1>
          <p className="text-sm mb-6" style={{ color: '#8899bb' }}>
            Rejoignez les usines qui pilotent leur production avec MillTrack.
          </p>

          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
              style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={signUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#8899bb' }}>
                Email professionnel
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="vous@votre-usine.com"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#f0f4ff',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#8899bb' }}>
                Mot de passe
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="8 caractères minimum"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#f0f4ff',
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 mt-2"
              style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
            >
              Créer mon compte
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#8899bb' }}>
            Déjà un compte ?{' '}
            <Link href="/auth/login" style={{ color: '#D4AF37' }} className="font-medium hover:opacity-80">
              Se connecter
            </Link>
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(240,244,255,0.3)' }}>
          © 2026 MillTrack — FORGE Afrika · Burkina Faso
        </p>
      </div>
    </main>
  )
}
