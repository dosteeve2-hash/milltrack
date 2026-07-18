'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Package, Activity, Wrench, FileBarChart2, CheckCircle2, ArrowRight, MapPin } from 'lucide-react'

const STEPS = [
  {
    id: 1, icon: Package, color: '#D4AF37',
    title: 'Créer un lot',
    desc: 'Enregistrez chaque entrée de matière première avec sa référence, son fournisseur et son poids.',
    action: 'Aller aux lots', href: '/lots',
    tip: 'Un lot = une traçabilité complète de la matière première au produit fini.',
  },
  {
    id: 2, icon: Activity, color: '#00BCD4',
    title: 'Lancer la production',
    desc: 'Associez un lot à une machine. MillTrack calcule le rendement en temps réel.',
    action: 'Voir la production', href: '/dashboard/production',
    tip: 'Le rendement = (sortie / entrée) × 100. Objectif : >70% pour la farine.',
  },
  {
    id: 3, icon: Wrench, color: '#4ade80',
    title: 'Surveiller les machines',
    desc: 'Suivez l\'état de chaque machine, planifiez la maintenance préventive et tracez les pannes.',
    action: 'Voir les machines', href: '/machines',
    tip: 'Une machine bien entretenue = moins d\'arrêts non planifiés.',
  },
  {
    id: 4, icon: FileBarChart2, color: '#a78bfa',
    title: 'Analyser les rapports',
    desc: 'Consultez vos rendements mensuels, votre CA estimé et comparez vos performances machines.',
    action: 'Ouvrir les rapports', href: '/dashboard/rapports',
    tip: 'Exportez vos rapports pour vos partenaires et institutions financières.',
  },
]

export default function OnboardingClient({ isDemo, userEmail }: { isDemo: boolean; userEmail: string }) {
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const current = STEPS[step]
  const progress = ((step + (completed.has(step) ? 1 : 0)) / STEPS.length) * 100

  const markDone = () => {
    setCompleted(prev => new Set([...prev, step]))
    if (step < STEPS.length - 1) setStep(step + 1)
  }

  return (
    <div className="p-8 max-w-3xl" style={{ color: '#f0f4ff' }}>
      {/* Demo banner */}
      {isDemo && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm"
          style={{ backgroundColor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
          <MapPin className="w-4 h-4 shrink-0" />
          <span>Vous explorez MillTrack en <strong>mode démo</strong> ({userEmail}). Les données sont fictives.</span>
        </motion.div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Bienvenue sur MillTrack 🎯</h1>
        <p className="text-sm" style={{ color: '#8899bb' }}>Suivez ce guide en 4 étapes pour piloter votre première production.</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs mb-2" style={{ color: '#8899bb' }}>
          <span>Progression</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }}
            style={{ backgroundColor: '#D4AF37' }} transition={{ type: 'spring' as const, stiffness: 60 }} />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex gap-3 mb-8">
        {STEPS.map((s, i) => {
          const done = completed.has(i)
          const active = i === step
          return (
            <button key={s.id} onClick={() => setStep(i)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: active ? 'rgba(212,175,55,0.15)' : done ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                color: active ? '#D4AF37' : done ? '#4ade80' : 'rgba(240,244,255,0.4)',
                border: active ? '1px solid rgba(212,175,55,0.3)' : done ? '1px solid rgba(74,222,128,0.2)' : '1px solid transparent',
              }}>
              {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <s.icon className="w-3.5 h-3.5" />}
              Étape {s.id}
            </button>
          )
        })}
      </div>

      {/* Step card */}
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ type: 'spring' as const, stiffness: 80, damping: 18 }}
          className="p-8 rounded-2xl mb-6"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${current.color}18` }}>
              <current.icon className="w-7 h-7" style={{ color: current.color }} />
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: '#8899bb' }}>Étape {current.id} / {STEPS.length}</p>
              <h2 className="text-xl font-bold">{current.title}</h2>
            </div>
          </div>
          <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(240,244,255,0.75)' }}>{current.desc}</p>
          <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs" style={{ color: '#8899bb' }}>💡 {current.tip}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={current.href}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: current.color, color: '#0A1628' }}>
              {current.action} <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={markDone}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ backgroundColor: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
              <CheckCircle2 className="w-4 h-4" />
              {completed.has(step) ? 'Fait ✓' : 'Marquer comme fait'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {completed.size === STEPS.length && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl text-center"
          style={{ backgroundColor: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#4ade80' }} />
          <h3 className="font-bold text-lg mb-1">Onboarding terminé !</h3>
          <p className="text-sm mb-4" style={{ color: '#8899bb' }}>Vous maîtrisez les bases de MillTrack. Bonne production !</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}>
            Aller au dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
