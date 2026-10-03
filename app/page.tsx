'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Factory,
  BarChart3,
  Package,
  Wrench,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { hoverScale } from '@/lib/animations'

const features = [
  {
    icon: Package,
    title: 'Suivi des lots',
    desc: 'Tracez chaque lot matière première → produit fini avec référence, fournisseur et qualité.',
  },
  {
    icon: BarChart3,
    title: 'Suivi de production',
    desc: 'Suivez les lignes de production et consultez les données de production dans MillTrack.',
  },
  {
    icon: Wrench,
    title: 'Machines & maintenance',
    desc: "Planning de maintenance préventive. Historique pannes et heures d'utilisation.",
  },
  {
    icon: TrendingUp,
    title: 'Rendements analytics',
    desc: 'Consultez les rendements par lot, machine et période.',
  },
]

const stats = [
  { value: 'MVP', label: 'Pilote recherché' },
  { value: 'Lots', label: 'Suivi de production' },
  { value: 'Machines', label: 'Maintenance' },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 18 } },
}

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0A1628', color: '#f0f4ff' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <Factory className="w-6 h-6" style={{ color: '#D4AF37' }} />
          <span className="font-bold text-lg tracking-tight">MillTrack</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
          >
            Connexion
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-24 pb-16 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ backgroundColor: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
            <span>⚙️</span>
            <span>MillTrack — Suivi production usines</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Suivez chaque lot.{' '}
            <span style={{ color: '#D4AF37' }}>Pilotez</span>{' '}
            chaque transformation.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl max-w-2xl mx-auto mb-10 opacity-70">
            Plateforme SaaS B2B pour minoteries et huileries du Burkina Faso.
            Suivi de production, maintenance machines et analyses de rendement.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90"
              style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
            >
              Demander une démo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-80"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#f0f4ff' }}
            >
              En savoir plus
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-8 pb-20">
        <motion.div
          className="grid grid-cols-3 gap-6 rounded-2xl p-8"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: '#D4AF37' }}>{s.value}</div>
              <div className="text-sm opacity-60">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-8 pb-24">
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              {...hoverScale}
              className="p-6 rounded-2xl flex gap-4 cursor-default"
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,188,212,0.15)' }}>
                <f.icon className="w-6 h-6" style={{ color: '#00BCD4' }} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA bottom */}
      <section className="max-w-3xl mx-auto px-8 pb-24 text-center">
        <motion.div
          className="rounded-2xl p-12"
          style={{ background: 'linear-gradient(135deg, #111e35 0%, #0f1f3d 100%)', border: '1px solid rgba(212,175,55,0.2)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 60 } }}
          viewport={{ once: true }}
        >
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: '#D4AF37' }} />
          <h2 className="text-3xl font-bold mb-4">Prêt à moderniser votre usine ?</h2>
          <p className="opacity-60 mb-8">Conçu pour les PME africaines.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
          >
            Accéder au dashboard <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm opacity-40" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        © 2026 MillTrack — FORGE Afrika · Burkina Faso
      </footer>
    </main>
  )
}
