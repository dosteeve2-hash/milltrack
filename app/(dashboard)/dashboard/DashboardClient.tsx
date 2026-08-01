'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Package,
  TrendingUp,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import AlertesMaintenance from '@/components/AlertesMaintenance'
import ObjectifsProduction from '@/components/ObjectifsProduction'
import PlanningMaintenance from '@/components/PlanningMaintenance'
import TopClients from '@/components/TopClients'

interface Stats {
  lotsEnCours: number
  productionJour: number
  rendementMoyen: number
  machinesActives: number
  machinesEnPanne: number
  alertes: number
}

interface Lot {
  id: string
  matiere: string
  quantiteEntree: number
  produit: string
  quantiteSortie: number
  rendement: number
  debut: string
  statut: string
  machine: string
}

const CHART_DATA = [
  { jour: 'Lun', production: 18.2 },
  { jour: 'Mar', production: 22.5 },
  { jour: 'Mer', production: 19.8 },
  { jour: 'Jeu', production: 25.1 },
  { jour: 'Ven', production: 21.3 },
  { jour: 'Sam', production: 14.6 },
  { jour: 'Dim', production: 24.6 },
]

// ── Données analytiques mensuelles ─────────────────────────────
const MONTHLY_PRODUCTION = [
  { mois: 'Jan', farineBlanche: 42.5, farinemais: 28.3, sonBle: 12.1 },
  { mois: 'Fév', farineBlanche: 38.2, farinemais: 31.4, sonBle: 10.8 },
  { mois: 'Mar', farineBlanche: 51.7, farinemais: 26.9, sonBle: 14.3 },
  { mois: 'Avr', farineBlanche: 47.3, farinemais: 33.5, sonBle: 13.6 },
  { mois: 'Mai', farineBlanche: 55.1, farinemais: 29.8, sonBle: 15.9 },
  { mois: 'Jun', farineBlanche: 49.8, farinemais: 35.2, sonBle: 14.1 },
  { mois: 'Jul', farineBlanche: 58.4, farinemais: 31.7, sonBle: 16.8 },
]

const MONTHLY_FINANCES = [
  { mois: 'Jan', revenus: 4.25, depenses: 3.12 },
  { mois: 'Fév', revenus: 3.82, depenses: 2.98 },
  { mois: 'Mar', revenus: 5.17, depenses: 3.56 },
  { mois: 'Avr', revenus: 4.73, depenses: 3.28 },
  { mois: 'Mai', revenus: 5.51, depenses: 3.79 },
  { mois: 'Jun', revenus: 4.98, depenses: 3.44 },
  { mois: 'Jul', revenus: 5.84, depenses: 3.92 },
]

const PIE_DATA = [
  { name: 'Farine Blanche', value: 58.4, color: '#D4AF37' },
  { name: 'Farine Maïs',    value: 31.7, color: '#00BCD4' },
  { name: 'Son de Blé',     value: 16.8, color: '#4ade80' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.08 },
  }),
}

function StatutBadge({ statut }: { statut: string }) {
  const cfg =
    statut === 'En cours'
      ? { bg: 'rgba(0,188,212,0.15)', color: '#00BCD4', icon: Clock }
      : statut === 'Terminé'
      ? { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', icon: CheckCircle2 }
      : { bg: 'rgba(212,175,55,0.15)', color: '#D4AF37', icon: Clock }
  const Icon = cfg.icon
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <Icon className="w-3 h-3" />
      {statut}
    </span>
  )
}

export default function DashboardClient({ stats, lotsActifs }: { stats: Stats; lotsActifs: Lot[] }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const statCards = [
    { label: 'Lots en cours', value: stats.lotsEnCours, unit: '', icon: Package, color: '#D4AF37' },
    { label: 'Production du jour', value: stats.productionJour, unit: 't', icon: TrendingUp, color: '#00BCD4' },
    { label: 'Rendement moyen', value: `${stats.rendementMoyen}%`, unit: '', icon: Cpu, color: '#4ade80' },
    { label: 'Alertes actives', value: stats.alertes, unit: '', icon: AlertTriangle, color: '#f97316' },
  ]

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#8899bb' }}>
          Lundi 13 juillet 2026 · {stats.machinesActives} machines actives · {stats.machinesEnPanne} en panne
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="p-5 rounded-2xl"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: '#8899bb' }}>{card.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-3xl font-bold">
              {card.value}
              {card.unit && <span className="text-base ml-1 font-normal" style={{ color: '#8899bb' }}>{card.unit}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Objectifs de production ─────────────────────────────── */}
      <ObjectifsProduction />

      <div className="grid lg:grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
        {/* AreaChart */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="p-6 rounded-2xl"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h2 className="font-semibold mb-4">Production 7 derniers jours (tonnes)</h2>
          {mounted ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="jour" tick={{ fill: '#8899bb', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8899bb', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff' }}
                />
                <Area type="monotone" dataKey="production" stroke="#D4AF37" strokeWidth={2} fill="url(#prodGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </motion.div>

        {/* Lots actifs */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="p-6 rounded-2xl"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h2 className="font-semibold mb-4">Lots actifs</h2>
          <div className="space-y-3">
            {lotsActifs.map((lot) => (
              <div
                key={lot.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
              >
                <div>
                  <p className="text-sm font-medium">{lot.matiere} → {lot.produit}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8899bb' }}>
                    {lot.machine} · {lot.quantiteEntree} kg entrée
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>{lot.rendement}%</p>
                  <StatutBadge statut={lot.statut} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Section analytique ─────────────────────────────────── */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-lg font-bold mb-5" style={{ color: '#f0f4ff' }}>
          Tableau de bord analytique
        </h2>

        {/* Alertes maintenance — au-dessus des graphiques */}
        <AlertesMaintenance />

        {/* Planning maintenance + Top clients */}
        <div className="grid lg:grid-cols-2 gap-6" style={{ marginBottom: '1.5rem' }}>
          <PlanningMaintenance />
          <TopClients />
        </div>

        {/* Graphiques — 3 colonnes */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LineChart — Production mensuelle */}
          <div
            className="p-6 rounded-2xl lg:col-span-2"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="font-semibold mb-1" style={{ color: '#f0f4ff' }}>Production mensuelle (tonnes)</p>
            <p className="text-xs mb-4" style={{ color: '#8899bb' }}>Janv – Juil 2026</p>
            {mounted ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={MONTHLY_PRODUCTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="mois" tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} unit="t" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff', fontSize: 12 }}
                    formatter={(v) => [`${v} t`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#8899bb', paddingTop: 8 }} />
                  <Line type="monotone" dataKey="farineBlanche" name="Farine Blanche" stroke="#D4AF37" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="farinemais"    name="Farine Maïs"    stroke="#00BCD4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="sonBle"        name="Son de Blé"      stroke="#4ade80" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </div>

          {/* PieChart — Répartition produits moulus */}
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="font-semibold mb-1" style={{ color: '#f0f4ff' }}>Répartition produits</p>
            <p className="text-xs mb-4" style={{ color: '#8899bb' }}>Juillet 2026</p>
            {mounted ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PIE_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff', fontSize: 12 }}
                    formatter={(v) => [`${v} t`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#8899bb' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
          </div>

          {/* BarChart — Revenus vs Dépenses */}
          <div
            className="p-6 rounded-2xl lg:col-span-3"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="font-semibold mb-1" style={{ color: '#f0f4ff' }}>Revenus vs Dépenses</p>
            <p className="text-xs mb-4" style={{ color: '#8899bb' }}>En millions FCFA · Janv – Juil 2026</p>
            {mounted ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={MONTHLY_FINANCES} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="mois" tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} unit="M" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff', fontSize: 12 }}
                    formatter={(v) => [`${v} M FCFA`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#8899bb', paddingTop: 8 }} />
                  <Bar dataKey="revenus"  name="Revenus"  fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="depenses" name="Dépenses" fill="#00BCD4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>

        </div>
      </motion.div>

    </div>
  )
}
