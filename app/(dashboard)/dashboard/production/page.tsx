'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Clock, CheckCircle2, TrendingUp, Users } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const MOCK_PRODUCTIONS = [
  { id: '1', lotRef: 'LOT-2026-001', machine: 'Moulin A', operateur: 'Boureima Sawadogo', debut: '2026-07-12 06:00', fin: '2026-07-12 14:30', duree: '8h30', entree: 5000, sortie: 3420, rendement: 68.4, statut: 'Terminé', qualite: 'Grade A' },
  { id: '2', lotRef: 'LOT-2026-002', machine: 'Presse 1', operateur: 'Adama Kaboré', debut: '2026-07-12 08:30', fin: null, duree: 'En cours', entree: 800, sortie: 312, rendement: 39.0, statut: 'En cours', qualite: '-' },
  { id: '3', lotRef: 'LOT-2026-003', machine: 'Moulin B', operateur: 'Ibrahim Traoré', debut: '2026-07-11 14:00', fin: '2026-07-11 22:00', duree: '8h00', entree: 3000, sortie: 2680, rendement: 89.3, statut: 'Terminé', qualite: 'Grade B' },
  { id: '4', lotRef: 'LOT-2026-004', machine: 'Moulin A', operateur: 'Boureima Sawadogo', debut: '2026-07-11 06:00', fin: '2026-07-11 14:00', duree: '8h00', entree: 4500, sortie: 3060, rendement: 68.0, statut: 'Terminé', qualite: 'Grade A' },
  { id: '5', lotRef: 'LOT-2026-005', machine: 'Presse 2', operateur: 'Mariam Ouédraogo', debut: '2026-07-10 10:00', fin: '2026-07-10 18:30', duree: '8h30', entree: 1200, sortie: 504, rendement: 42.0, statut: 'Terminé', qualite: 'Grade A' },
]

const RENDEMENT_DATA = [
  { machine: 'Moulin A', rendement: 68.2 },
  { machine: 'Moulin B', rendement: 89.3 },
  { machine: 'Presse 1', rendement: 39.0 },
  { machine: 'Presse 2', rendement: 42.0 },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.07 } }),
}

function StatutBadge({ statut }: { statut: string }) {
  const cfg = statut === 'En cours'
    ? { bg: 'rgba(0,188,212,0.15)', color: '#00BCD4', icon: Clock }
    : { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', icon: CheckCircle2 }
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
      <Icon className="w-3 h-3" />{statut}
    </span>
  )
}

export default function ProductionPage() {
  const [mounted, setMounted] = useState(false)
  const [filterMachine, setFilterMachine] = useState('Toutes')
  useEffect(() => setMounted(true), [])

  const machines = ['Toutes', ...Array.from(new Set(MOCK_PRODUCTIONS.map(p => p.machine)))]
  const filtered = filterMachine === 'Toutes' ? MOCK_PRODUCTIONS : MOCK_PRODUCTIONS.filter(p => p.machine === filterMachine)
  const rendementMoyen = Math.round(filtered.reduce((s, p) => s + p.rendement, 0) / filtered.length * 10) / 10
  const operateursActifs = new Set(MOCK_PRODUCTIONS.filter(p => p.statut === 'En cours').map(p => p.operateur)).size

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6" style={{ color: '#00BCD4' }} />
            Production
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8899bb' }}>Cycles de production · Rendements · Opérateurs</p>
        </div>
        <select
          value={filterMachine}
          onChange={e => setFilterMachine(e.target.value)}
          className="px-4 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.12)', color: '#f0f4ff' }}
        >
          {machines.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Cycles total', value: filtered.length, icon: Activity, color: '#D4AF37' },
          { label: 'Rendement moyen', value: `${rendementMoyen}%`, icon: TrendingUp, color: '#4ade80' },
          { label: 'Opérateurs actifs', value: operateursActifs, icon: Users, color: '#00BCD4' },
        ].map((c, i) => (
          <motion.div key={c.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            className="p-5 rounded-2xl" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: '#8899bb' }}>{c.label}</span>
              <c.icon className="w-4 h-4" style={{ color: c.color }} />
            </div>
            <div className="text-3xl font-bold">{c.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Rendement bar chart */}
        <div className="p-6 rounded-2xl" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="font-semibold mb-4">Rendement par machine (%)</h2>
          {mounted ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={RENDEMENT_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="machine" tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff' }} />
                <Bar dataKey="rendement" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        {/* Timeline cycles */}
        <div className="p-6 rounded-2xl" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="font-semibold mb-4">Timeline cycles récents</h2>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {MOCK_PRODUCTIONS.filter(p => p.statut === 'En cours').map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.2)' }}>
                <Clock className="w-4 h-4 shrink-0" style={{ color: '#00BCD4' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.lotRef} · {p.machine}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8899bb' }}>Depuis {p.debut} · {p.operateur}</p>
                </div>
                <span className="text-sm font-bold" style={{ color: '#00BCD4' }}>{p.rendement}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="font-semibold">Tous les cycles ({filtered.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Lot', 'Machine', 'Opérateur', 'Début', 'Durée', 'Entrée (kg)', 'Sortie (kg)', 'Rendement', 'Qualité', 'Statut'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#8899bb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr key={p.id} custom={i} variants={fadeUp} initial="hidden" animate="show"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#D4AF37' }}>{p.lotRef}</td>
                  <td className="px-4 py-3">{p.machine}</td>
                  <td className="px-4 py-3" style={{ color: '#8899bb' }}>{p.operateur}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8899bb' }}>{p.debut}</td>
                  <td className="px-4 py-3">{p.duree}</td>
                  <td className="px-4 py-3">{p.entree.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.sortie.toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: p.rendement >= 70 ? '#4ade80' : p.rendement >= 50 ? '#D4AF37' : '#f97316' }}>
                    {p.rendement}%
                  </td>
                  <td className="px-4 py-3" style={{ color: '#8899bb' }}>{p.qualite}</td>
                  <td className="px-4 py-3"><StatutBadge statut={p.statut} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
