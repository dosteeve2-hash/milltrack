'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileBarChart2, TrendingUp, Package, DollarSign } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

// 30 jours de données mockées
const AREA_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2026-06-13')
  date.setDate(date.getDate() + i)
  const label = `${date.getDate()}/${date.getMonth() + 1}`
  const production = Math.round((15 + Math.random() * 15) * 10) / 10
  return { date: label, production }
})

const BAR_DATA = [
  { machine: 'Moulin A', rendement: 68.2, lots: 14 },
  { machine: 'Moulin B', rendement: 89.3, lots: 8 },
  { machine: 'Presse 1', rendement: 39.0, lots: 6 },
  { machine: 'Presse 2', rendement: 42.0, lots: 5 },
]

const RECAP = [
  { periode: 'Juillet 2026', lots: 12, rendement: 71.2, ca: 8940000 },
  { periode: 'Juin 2026', lots: 28, rendement: 68.8, ca: 18200000 },
  { periode: 'Mai 2026', lots: 31, rendement: 72.1, ca: 21500000 },
  { periode: 'Avril 2026', lots: 24, rendement: 65.4, ca: 15800000 },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.07 } }),
}

export default function RapportsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const totalLots = RECAP.reduce((s, r) => s + r.lots, 0)
  const rendementMoyen = Math.round(RECAP.reduce((s, r) => s + r.rendement, 0) / RECAP.length * 10) / 10
  const caTotal = RECAP.reduce((s, r) => s + r.ca, 0)

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileBarChart2 className="w-6 h-6" style={{ color: '#D4AF37' }} />
          Rapports & Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8899bb' }}>Production mensuelle · Rendements · Chiffre d&apos;affaires estimé</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Lots traités (4 mois)', value: totalLots, icon: Package, color: '#D4AF37' },
          { label: 'Rendement moyen', value: `${rendementMoyen}%`, icon: TrendingUp, color: '#4ade80' },
          { label: 'CA estimé', value: `${(caTotal / 1000000).toFixed(1)} M FCFA`, icon: DollarSign, color: '#00BCD4' },
        ].map((c, i) => (
          <motion.div key={c.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            className="p-5 rounded-2xl" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: '#8899bb' }}>{c.label}</span>
              <c.icon className="w-4 h-4" style={{ color: c.color }} />
            </div>
            <div className="text-2xl font-bold">{c.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* AreaChart 30 jours */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
          className="p-6 rounded-2xl" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="font-semibold mb-1">Production quotidienne — 30 derniers jours (tonnes)</h2>
          <p className="text-xs mb-4" style={{ color: '#8899bb' }}>13 juin → 13 juillet 2026</p>
          {mounted ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={AREA_DATA}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff' }} />
                <Area type="monotone" dataKey="production" stroke="#D4AF37" strokeWidth={2} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </motion.div>

        {/* BarChart rendements machine */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
          className="p-6 rounded-2xl" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="font-semibold mb-1">Rendement par machine (%)</h2>
          <p className="text-xs mb-4" style={{ color: '#8899bb' }}>Moyenne cumulée sur la période</p>
          {mounted ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={BAR_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="machine" tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff' }} />
                <Bar dataKey="rendement" fill="#00BCD4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </motion.div>
      </div>

      {/* Table récap mensuelle */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show"
        className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="font-semibold">Récapitulatif mensuel</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Période', 'Lots traités', 'Rendement moyen', 'CA estimé (FCFA)'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#8899bb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECAP.map((r, i) => (
              <tr key={r.periode} style={{ borderBottom: i < RECAP.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <td className="px-6 py-4 font-medium">{r.periode}</td>
                <td className="px-6 py-4">{r.lots}</td>
                <td className="px-6 py-4 font-bold" style={{ color: r.rendement >= 70 ? '#4ade80' : '#D4AF37' }}>
                  {r.rendement}%
                </td>
                <td className="px-6 py-4" style={{ color: '#00BCD4' }}>
                  {r.ca.toLocaleString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
