import Link from 'next/link'
import { Factory, AlertCircle, CheckCircle2 } from 'lucide-react'
import { signIn } from '@/app/actions/auth'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  const error = params.error
  const message = params.message

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0A1628' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
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
            Connexion
          </h1>
          <p className="text-sm mb-6" style={{ color: '#8899bb' }}>
            Accédez à votre espace de suivi production.
          </p>
          {/* Error / message */}
          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
              style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {decodeURIComponent(error)}
            </div>
          )}
          {message && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
              style={{ backgroundColor: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {decodeURIComponent(message)}
            </div>
          )}

          {/* Demo bloc */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{ border: '1px solid rgba(212,175,55,0.4)', backgroundColor: 'rgba(212,175,55,0.07)' }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: '#D4AF37' }}>
              🎯 Accès démo
            </p>
            <p className="text-xs" style={{ color: '#c9a832' }}>
              Email&nbsp;: <strong>demo@milltrack.app</strong>
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#c9a832' }}>
              Mot de passe&nbsp;: <strong>Demo2026!</strong>
            </p>
          </div>
          {/* Form */}
          <form action={signIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#8899bb' }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="vous@exemple.com"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
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
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
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
              Se connecter
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#8899bb' }}>
            Pas encore de compte ?{' '}
            <Link href="/auth/register" style={{ color: '#D4AF37' }} className="font-medium hover:opacity-80">
              Créer un compte
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
