import Link from 'next/link'
import { AlertCircle, AlertTriangle, CheckCircle2, Factory } from 'lucide-react'

import { supabaseConfigure } from '@/lib/supabase/config'

const CHAMP: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#f0f4ff',
}

/** Un champ du formulaire — même rendu des deux côtés, désactivé si rien ne peut l'authentifier. */
export function Champ({
  nom,
  label,
  type,
  placeholder,
  autoComplete,
  desactive,
}: {
  nom: string
  label: string
  type: string
  placeholder: string
  autoComplete: string
  desactive: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#8899bb' }} htmlFor={nom}>
        {label}
      </label>
      <input
        id={nom}
        name={nom}
        type={type}
        required
        disabled={desactive}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all disabled:opacity-50"
        style={CHAMP}
      />
    </div>
  )
}

/**
 * L'enveloppe commune aux pages de connexion et d'inscription : logo, carte, messages,
 * pied de page. Les deux pages ne diffèrent que par leur formulaire.
 */
export default function CarteAuth({
  titre,
  soustitre,
  erreur,
  message,
  enBas,
  children,
}: {
  titre: string
  soustitre: string
  erreur?: string
  message?: string
  enBas: React.ReactNode
  children: React.ReactNode
}) {
  const configure = supabaseConfigure()

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: '#0A1628' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Factory className="w-8 h-8" style={{ color: '#D4AF37' }} />
          <span className="font-bold text-2xl" style={{ color: '#f0f4ff' }}>MillTrack</span>
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h1 className="text-xl font-bold mb-1" style={{ color: '#f0f4ff' }}>{titre}</h1>
          <p className="text-sm mb-6" style={{ color: '#8899bb' }}>{soustitre}</p>

          {!configure && (
            <div
              role="status"
              className="flex gap-2 p-3 rounded-lg mb-4 text-sm"
              style={{ backgroundColor: 'rgba(212,175,55,0.10)', color: '#e6c95a', border: '1px solid rgba(212,175,55,0.25)' }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Supabase n&apos;est pas configuré sur ce déploiement.</strong> Aucune
                connexion n&apos;est possible ici, et le tableau de bord reste fermé. Il manque{' '}
                <code>NEXT_PUBLIC_SUPABASE_URL</code> et <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
              </span>
            </div>
          )}

          {erreur && (
            <div
              role="alert"
              className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
              style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {erreur}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
              style={{ backgroundColor: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {message}
            </div>
          )}

          {children}

          <p className="text-center text-sm mt-6" style={{ color: '#8899bb' }}>{enBas}</p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(240,244,255,0.3)' }}>
          <Link href="/" className="hover:opacity-80">© 2026 MillTrack — FORGE Afrika · Burkina Faso</Link>
        </p>
      </div>
    </main>
  )
}

export function Bouton({ children, desactive }: { children: React.ReactNode; desactive: boolean }) {
  return (
    <button
      type="submit"
      disabled={desactive}
      className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
    >
      {children}
    </button>
  )
}
