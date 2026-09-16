'use client'

import { useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import {
  ComposedChart, Bar, Line, LineChart, BarChart,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import {
  BarChart2, TrendingUp, Users, Wheat,
  Download, Calendar, AlertCircle, Star,
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { useHydrated } from "@/lib/useHydrated"

// ── Palette ──────────────────────────────────────────────────────────────────
const NAVY   = '#0A1628'
const GOLD   = '#D4AF37'
const CYAN   = '#00D4FF'
const BG2    = '#0c1a34'
const CARD   = '#111e35'
const BORDER = 'rgba(255,255,255,0.08)'
const MUTED  = '#8899bb'
const TEXT   = '#f0f4ff'

// ── Types ─────────────────────────────────────────────────────────────────────
type Periode = 'today' | 'week' | 'month' | 'year'

// ── Données mock 12 mois (CA + kg) ───────────────────────────────────────────
const DATA_12_MOIS = [
  { mois: 'Sep',  ca: 1_240_000, kg: 4_200 },
  { mois: 'Oct',  ca: 1_580_000, kg: 5_800 },
  { mois: 'Nov',  ca: 1_320_000, kg: 4_700 },
  { mois: 'Déc',  ca: 1_750_000, kg: 6_100 },
  { mois: 'Jan',  ca: 1_420_000, kg: 5_100 },
  { mois: 'Fév',  ca: 1_680_000, kg: 5_900 },
  { mois: 'Mar',  ca: 1_920_000, kg: 6_800 },
  { mois: 'Avr',  ca: 2_100_000, kg: 7_400 },
  { mois: 'Mai',  ca: 1_870_000, kg: 6_600 },
  { mois: 'Jun',  ca: 2_240_000, kg: 7_900 },
  { mois: 'Jul',  ca: 2_050_000, kg: 7_200 },
  { mois: 'Aoû',  ca: 2_380_000, kg: 8_400 },
]

// ── kg par céréale ────────────────────────────────────────────────────────────
const DATA_CEREALES = [
  { cereale: 'Maïs',  kg: 24_800 },
  { cereale: 'Sorgho', kg: 18_600 },
  { cereale: 'Mil',   kg: 15_200 },
  { cereale: 'Riz',   kg: 12_400 },
  { cereale: 'Fonio', kg:  7_800 },
  { cereale: 'Niébé', kg:  5_400 },
]

const PIE_COLORS = ['#D4AF37', '#00D4FF', '#a78bfa', '#4ade80', '#f97316', '#f43f5e']

// ── Répartition CA par céréale (pour PieChart) ───────────────────────────────
const DATA_PIE = [
  { name: 'Maïs',  value: 7_440_000 },
  { name: 'Sorgho', value: 5_580_000 },
  { name: 'Mil',   value: 4_256_000 },
  { name: 'Riz',   value: 4_340_000 },
  { name: 'Fonio', value: 3_120_000 },
  { name: 'Niébé', value: 1_728_000 },
]

// ── Évolution clients actifs 6 mois ──────────────────────────────────────────
const DATA_CLIENTS_6M = [
  { mois: 'Mar', clients: 38 },
  { mois: 'Avr', clients: 42 },
  { mois: 'Mai', clients: 45 },
  { mois: 'Jun', clients: 51 },
  { mois: 'Jul', clients: 49 },
  { mois: 'Aoû', clients: 57 },
]

// ── Top 10 clients ────────────────────────────────────────────────────────────
const TOP_CLIENTS = [
  { nom: 'Mariam Konaté',       village: 'Ouagadougou',   kg: 3_840, depenses: 96_000,  derniere: '2026-08-01' },
  { nom: 'Oumar Diallo',        village: 'Bobo-Dioulasso', kg: 3_200, depenses: 112_000, derniere: '2026-08-02' },
  { nom: 'Aminata Ouédraogo',   village: 'Koudougou',      kg: 2_950, depenses: 73_750,  derniere: '2026-08-03' },
  { nom: 'Seydou Tapsoba',      village: 'Ouagadougou',   kg: 2_800, depenses: 98_000,  derniere: '2026-07-29' },
  { nom: 'Boureima Kaboré',     village: 'Fada N\'Gourma', kg: 2_600, depenses: 78_000,  derniere: '2026-08-03' },
  { nom: 'Idrissa Coulibaly',   village: 'Dédougou',       kg: 2_400, depenses: 72_000,  derniere: '2026-08-01' },
  { nom: 'Fatoumata Traoré',    village: 'Banfora',        kg: 2_100, depenses: 58_800,  derniere: '2026-08-03' },
  { nom: 'Rasmata Compaoré',    village: 'Pô',             kg: 1_920, depenses: 76_800,  derniere: '2026-08-02' },
  { nom: 'Aïssata Zongo',       village: 'Tenkodogo',      kg: 1_800, depenses: 57_600,  derniere: '2026-08-02' },
  { nom: 'Balkissa Ouattara',   village: 'Ouahigouya',     kg: 1_560, depenses: 62_400,  derniere: '2026-07-30' },
]

// ── KPI selon période ─────────────────────────────────────────────────────────
const KPI_DATA: Record<Periode, {
  ca: number; broyages: number; kg: number;
  clients: number; rendement: number; benefice: number
}> = {
  today: { ca: 26_410, broyages: 5,    kg: 767,    clients: 5,   rendement: 90, benefice: 21_128 },
  week:  { ca: 185_040, broyages: 31,  kg: 5_340,  clients: 28,  rendement: 88, benefice: 148_032 },
  month: { ca: 742_800, broyages: 124, kg: 21_400, clients: 57,  rendement: 87, benefice: 594_240 },
  year:  { ca: 8_550_000, broyages: 1_480, kg: 84_200, clients: 142, rendement: 85, benefice: 6_840_000 },
}

// ── Animation ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.06 },
  }),
}

// ── Composant PieChart label ──────────────────────────────────────────────────
/**
 * Recharts ne garantit aucun de ces champs : son type de rendu les déclare
 * tous optionnels. Les typer comme obligatoires (masqué jusqu'ici par un
 * `any` à l'appel) aurait produit des coordonnées NaN si l'un manquait.
 */
interface PieLabelProps {
  cx?: number; cy?: number; midAngle?: number; innerRadius?: number
  outerRadius?: number; percent?: number; name?: string
}
const RADIAN = Math.PI / 180
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: PieLabelProps) {
  if (
    cx === undefined || cy === undefined || midAngle === undefined ||
    innerRadius === undefined || outerRadius === undefined || percent === undefined
  ) return null
  if (percent < 0.06) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill={TEXT} textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 10, fontWeight: 600 }}>
      {`${name}\n${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ── Tooltip styles ────────────────────────────────────────────────────────────
const tooltipStyle: CSSProperties = {
  backgroundColor: NAVY, border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 8,
}
const tooltipLabel: CSSProperties = { color: TEXT }

// ─────────────────────────────────────────────────────────────────────────────
export default function RapportsPage() {
  const [periode, setPeriode] = useState<Periode>('month')
  const mounted = useHydrated()


  const kpi = KPI_DATA[periode]
  const rendementAlert = kpi.rendement < 80

  const periodeLabels: Record<Periode, string> = {
    today: "Aujourd'hui", week: 'Cette semaine', month: 'Ce mois', year: 'Cette année',
  }

  function handleExport() {
    toast.success('Export en cours...', {
      description: 'Le fichier CSV sera téléchargé dans quelques secondes.',
      icon: <Download className="w-4 h-4" />,
    })
  }

  const kpis = [
    { label: 'CA total (FCFA)',       value: kpi.ca.toLocaleString('fr-FR'),       icon: TrendingUp, color: GOLD  },
    { label: 'Total broyages',        value: kpi.broyages.toLocaleString('fr-FR'), icon: BarChart2,  color: CYAN  },
    { label: 'Kg traités',            value: `${kpi.kg.toLocaleString('fr-FR')} kg`, icon: Wheat,    color: '#4ade80' },
    { label: 'Clients servis',        value: String(kpi.clients),                  icon: Users,      color: '#a78bfa' },
    { label: 'Rendement moyen',       value: `${kpi.rendement} %`,                 icon: Star,       color: rendementAlert ? '#f43f5e' : GOLD },
    { label: 'Bénéfice estimé (FCFA)', value: kpi.benefice.toLocaleString('fr-FR'), icon: TrendingUp, color: '#4ade80' },
  ]

  return (
    <div style={{ padding: '2rem', color: TEXT, minHeight: '100vh', backgroundColor: NAVY }}>
      <Toaster position="bottom-right" richColors />

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart2 style={{ width: 22, height: 22, color: GOLD }} />
            Rapports & Analytics
          </h1>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
            Tableau de bord analytique · Moulin céréales
          </p>
        </div>

        <button
          onClick={handleExport}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
            backgroundColor: GOLD, color: NAVY, fontWeight: 700, fontSize: 13,
          }}
        >
          <Download style={{ width: 15, height: 15 }} />
          Exporter CSV
        </button>
      </div>

      {/* ── Alerte rendement ─────────────────────────────────── */}
      {rendementAlert && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 16 } }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 18px', borderRadius: 12, marginBottom: '1.5rem',
            backgroundColor: 'rgba(212,175,55,0.1)', border: `1px solid rgba(212,175,55,0.35)`,
          }}
        >
          <AlertCircle style={{ width: 18, height: 18, color: GOLD, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>
            ⚠️ Rendement moyen {kpi.rendement}% — en dessous du seuil de 80%. Vérifiez l&apos;état des meules.
          </span>
        </motion.div>
      )}

      {/* ── Sélecteur période ─────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
          <Calendar style={{ width: 14, height: 14, color: MUTED }} />
          <span style={{ fontSize: 12, color: MUTED }}>Période :</span>
        </div>
        {(['today', 'week', 'month', 'year'] as Periode[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriode(p)}
            style={{
              padding: '6px 14px', borderRadius: 8, border: `1px solid ${periode === p ? GOLD : BORDER}`,
              backgroundColor: periode === p ? 'rgba(212,175,55,0.15)' : BG2,
              color: periode === p ? GOLD : MUTED,
              fontWeight: periode === p ? 700 : 400,
              fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {periodeLabels[p]}
          </button>
        ))}
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: '2rem' }}>
        {kpis.map((k, i) => (
          <motion.div
            key={k.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            style={{
              padding: '1.25rem', borderRadius: 16, border: `1px solid ${BORDER}`,
              backgroundColor: CARD,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: MUTED }}>{k.label}</span>
              <k.icon style={{ width: 15, height: 15, color: k.color }} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color, lineHeight: 1.2 }}>{k.value}</div>
          </motion.div>
        ))}
      </div>

      {/* ── ComposedChart : CA + kg 12 mois ──────────────────── */}
      {mounted && (
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show"
          style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}
        >
          <h2 style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: '1rem' }}>
            📈 CA mensuel (FCFA) + Volume traité (kg) — 12 mois
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={DATA_12_MOIS} margin={{ top: 8, right: 24, bottom: 0, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="mois" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="ca" orientation="left"
                tick={{ fill: GOLD, fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1_000_000).toFixed(1)}M`}
              />
              <YAxis
                yAxisId="kg" orientation="right"
                tick={{ fill: CYAN, fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v.toLocaleString('fr-FR')}`}
              />
              <Tooltip
                contentStyle={tooltipStyle} labelStyle={tooltipLabel}
                formatter={(v, name) => {
                  if (name === 'CA') return [`${(Number(v)).toLocaleString('fr-FR')} F`, 'CA']
                  return [`${(Number(v)).toLocaleString('fr-FR')} kg`, 'Volume']
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: MUTED }} />
              <Bar yAxisId="ca" dataKey="ca" name="CA" fill={GOLD} radius={[4, 4, 0, 0]} opacity={0.85} />
              <Line yAxisId="kg" dataKey="kg" name="Volume kg" stroke={CYAN} strokeWidth={2.5} dot={{ fill: CYAN, r: 3 }} type="monotone" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* ── BarChart céréales + PieChart CA ──────────────────── */}
      {mounted && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: '1.5rem' }}>

          {/* BarChart kg par céréale */}
          <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show"
            style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '1.5rem' }}
          >
            <h2 style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: '1rem' }}>
              🌾 Kg traités par céréale
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DATA_CEREALES} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="cereale" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={tooltipStyle} labelStyle={tooltipLabel}
                  formatter={v => [`${Number(v).toLocaleString('fr-FR')} kg`, 'Volume']}
                />
                <Bar dataKey="kg" radius={[4, 4, 0, 0]}>
                  {DATA_CEREALES.map((_, idx) => (
                    <Cell key={idx} fill={GOLD} opacity={1 - idx * 0.1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* PieChart part CA */}
          <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show"
            style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '1.5rem' }}
          >
            <h2 style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: '1rem' }}>
              🥧 Part CA par céréale
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={DATA_PIE} cx="50%" cy="50%"
                  outerRadius={88} dataKey="value"
                  labelLine={false}
                  label={(props: PieLabelProps) => <PieLabel {...props} />}
                >
                  {DATA_PIE.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle} labelStyle={tooltipLabel}
                  formatter={v => [`${Number(v).toLocaleString('fr-FR')} F`, 'CA']}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* ── LineChart clients actifs 6 mois ──────────────────── */}
      {mounted && (
        <motion.div custom={9} variants={fadeUp} initial="hidden" animate="show"
          style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}
        >
          <h2 style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: '1rem' }}>
            👥 Évolution clients actifs — 6 mois
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={DATA_CLIENTS_6M} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="mois" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} domain={[30, 65]} />
              <Tooltip
                contentStyle={tooltipStyle} labelStyle={tooltipLabel}
                formatter={v => [String(v), 'Clients actifs']}
              />
              <Line
                type="monotone" dataKey="clients" stroke={CYAN}
                strokeWidth={2.5} dot={{ fill: CYAN, r: 4 }} activeDot={{ r: 6, fill: CYAN }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* ── Top 10 clients ────────────────────────────────────── */}
      <motion.div custom={10} variants={fadeUp} initial="hidden" animate="show"
        style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}
      >
        <h2 style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: '1rem' }}>
          🏆 Top 10 clients
        </h2>

        {/* En-têtes */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.2fr 1fr',
          padding: '0 1rem 8px', fontSize: 11, color: 'rgba(136,153,187,0.5)',
          borderBottom: `1px solid ${BORDER}`, marginBottom: 6,
        }}>
          <span>Client</span>
          <span>Village</span>
          <span>Kg total</span>
          <span>Dépenses FCFA</span>
          <span>Dernière visite</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {TOP_CLIENTS.map((c, i) => (
            <motion.div
              key={c.nom} custom={i} variants={fadeUp} initial="hidden" animate="show"
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.2fr 1fr',
                alignItems: 'center', padding: '10px 1rem', borderRadius: 12,
                backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                fontSize: 13,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i < 3 && (
                  <Star style={{ width: 13, height: 13, color: i === 0 ? GOLD : i === 1 ? '#a0a0a0' : '#cd7f32' }} />
                )}
                <span style={{ fontWeight: 600 }}>{c.nom}</span>
              </div>
              <span style={{ color: MUTED }}>{c.village}</span>
              <span style={{ color: CYAN, fontWeight: 700 }}>{c.kg.toLocaleString('fr-FR')} kg</span>
              <span style={{ color: GOLD, fontWeight: 700 }}>{c.depenses.toLocaleString('fr-FR')} F</span>
              <span style={{ color: MUTED, fontSize: 11 }}>{c.derniere}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Indicateurs de performance ────────────────────────── */}
      <motion.div custom={11} variants={fadeUp} initial="hidden" animate="show"
        style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}
      >
        <h2 style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: '1rem' }}>
          ⚡ Indicateurs de performance
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {[
            {
              label: 'Meilleur jour de la semaine',
              value: 'Lundi',
              detail: 'CA moyen 42 000 FCFA',
              icon: Star,
              color: GOLD,
            },
            {
              label: 'Heure de pointe',
              value: '07:00 – 09:00',
              detail: '68% des broyages journaliers',
              icon: TrendingUp,
              color: CYAN,
            },
            {
              label: 'Céréale star',
              value: 'Maïs',
              detail: '29% du volume total',
              icon: Wheat,
              color: '#4ade80',
            },
          ].map(item => (
            <div
              key={item.label}
              style={{
                padding: '1rem', borderRadius: 12,
                backgroundColor: `rgba(255,255,255,0.03)`, border: `1px solid ${BORDER}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <item.icon style={{ width: 16, height: 16, color: item.color }} />
                <span style={{ fontSize: 11, color: MUTED }}>{item.label}</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section alertes métier ───────────────────────────── */}
      <motion.div custom={12} variants={fadeUp} initial="hidden" animate="show"
        style={{ marginBottom: '2rem' }}
      >
        <h2 style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: '0.75rem' }}>
          🚨 Alertes métier
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {rendementAlert && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px',
              borderRadius: 12, backgroundColor: 'rgba(212,175,55,0.08)',
              border: `1px solid rgba(212,175,55,0.3)`,
            }}>
              <AlertCircle style={{ width: 16, height: 16, color: GOLD, marginTop: 1, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: GOLD }}>Rendement en dessous du seuil</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                  Rendement moyen {kpi.rendement}% &lt; 80% — Inspection des meules recommandée.
                </div>
              </div>
            </div>
          )}

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px',
            borderRadius: 12, backgroundColor: 'rgba(0,212,255,0.06)',
            border: `1px solid rgba(0,212,255,0.2)`,
          }}>
            <TrendingUp style={{ width: 16, height: 16, color: CYAN, marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: CYAN }}>CA en hausse ce mois</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                +16% vs mois précédent · Saison des récoltes favorable.
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px',
            borderRadius: 12, backgroundColor: 'rgba(74,222,128,0.06)',
            border: `1px solid rgba(74,222,128,0.2)`,
          }}>
            <Users style={{ width: 16, height: 16, color: '#4ade80', marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#4ade80' }}>Nouveaux clients ce mois</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                8 nouveaux clients enregistrés — +20% vs mois précédent.
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ height: 32 }} />
    </div>
  )
}
