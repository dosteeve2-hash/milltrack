'use client'

import { useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { Cog, TrendingUp, Scale, Activity, Search, Plus, X, Phone } from 'lucide-react'

type Cereale = 'Maïs' | 'Sorgho' | 'Mil' | 'Riz' | 'Fonio' | 'Niébé'
type StatutBroyage = 'Terminé' | 'En cours' | 'En attente'

interface Broyage {
  id: string
  client: string
  telephone: string
  cereale: Cereale
  quantiteEntree: number
  quantiteSortie: number
  prixKg: number
  total: number
  date: string
  heureDebut: string
  heureFin: string
  duree: string
  statut: StatutBroyage
  notes: string
}

const MOCK_BROYAGES: Broyage[] = [
  { id: 'BR-001', client: 'Aminata Ouédraogo',  telephone: '+226 70 12 34 56', cereale: 'Maïs',  quantiteEntree: 200, quantiteSortie: 182, prixKg: 25, total: 4550,  date: '2026-08-03', heureDebut: '07:00', heureFin: '08:30', duree: '1h30',     statut: 'Terminé',    notes: '' },
  { id: 'BR-002', client: 'Boureima Kaboré',    telephone: '+226 76 98 76 54', cereale: 'Sorgho', quantiteEntree: 150, quantiteSortie: 134, prixKg: 30, total: 4020,  date: '2026-08-03', heureDebut: '08:45', heureFin: '09:45', duree: '1h00',     statut: 'Terminé',    notes: 'Mouture fine' },
  { id: 'BR-003', client: 'Fatoumata Traoré',   telephone: '+226 65 43 21 09', cereale: 'Mil',    quantiteEntree: 100, quantiteSortie: 0,   prixKg: 28, total: 0,      date: '2026-08-03', heureDebut: '10:00', heureFin: '',      duree: 'En cours', statut: 'En cours',   notes: '' },
  { id: 'BR-004', client: 'Salif Sawadogo',     telephone: '+226 70 55 44 33', cereale: 'Maïs',  quantiteEntree: 300, quantiteSortie: 0,   prixKg: 25, total: 0,      date: '2026-08-03', heureDebut: '',      heureFin: '',      duree: '-',        statut: 'En attente', notes: 'Prévu 11h' },
  { id: 'BR-005', client: 'Rasmata Compaoré',   telephone: '+226 76 11 22 44', cereale: 'Fonio',  quantiteEntree: 80,  quantiteSortie: 71,  prixKg: 40, total: 2840,  date: '2026-08-02', heureDebut: '07:30', heureFin: '08:15', duree: '0h45',     statut: 'Terminé',    notes: '' },
  { id: 'BR-006', client: 'Oumar Diallo',       telephone: '+226 65 77 88 00', cereale: 'Riz',    quantiteEntree: 250, quantiteSortie: 236, prixKg: 35, total: 8260,  date: '2026-08-02', heureDebut: '09:00', heureFin: '10:30', duree: '1h30',     statut: 'Terminé',    notes: '' },
  { id: 'BR-007', client: 'Aïssata Zongo',      telephone: '+226 70 99 88 77', cereale: 'Niébé',  quantiteEntree: 120, quantiteSortie: 108, prixKg: 32, total: 3456,  date: '2026-08-02', heureDebut: '11:00', heureFin: '12:00', duree: '1h00',     statut: 'Terminé',    notes: 'Client habituel' },
  { id: 'BR-008', client: 'Idrissa Coulibaly',  telephone: '+226 76 33 22 11', cereale: 'Sorgho', quantiteEntree: 180, quantiteSortie: 162, prixKg: 30, total: 4860,  date: '2026-08-01', heureDebut: '07:00', heureFin: '08:30', duree: '1h30',     statut: 'Terminé',    notes: '' },
  { id: 'BR-009', client: 'Mariam Konaté',      telephone: '+226 70 44 55 66', cereale: 'Maïs',  quantiteEntree: 400, quantiteSortie: 364, prixKg: 25, total: 9100,  date: '2026-08-01', heureDebut: '09:00', heureFin: '11:00', duree: '2h00',     statut: 'Terminé',    notes: '' },
  { id: 'BR-010', client: 'Adama Sorgho',       telephone: '+226 65 12 34 78', cereale: 'Mil',    quantiteEntree: 90,  quantiteSortie: 80,  prixKg: 28, total: 2240,  date: '2026-07-31', heureDebut: '07:30', heureFin: '08:30', duree: '1h00',     statut: 'Terminé',    notes: '' },
  { id: 'BR-011', client: 'Balkissa Ouattara',  telephone: '+226 76 22 33 44', cereale: 'Fonio',  quantiteEntree: 60,  quantiteSortie: 53,  prixKg: 40, total: 2120,  date: '2026-07-30', heureDebut: '14:00', heureFin: '14:45', duree: '0h45',     statut: 'Terminé',    notes: '' },
  { id: 'BR-012', client: 'Seydou Tapsoba',     telephone: '+226 70 88 99 00', cereale: 'Riz',    quantiteEntree: 200, quantiteSortie: 188, prixKg: 35, total: 6580,  date: '2026-07-29', heureDebut: '08:00', heureFin: '09:30', duree: '1h30',     statut: 'Terminé',    notes: 'Remise 10 %' },
]

const CEREALES: Cereale[] = ['Maïs', 'Sorgho', 'Mil', 'Riz', 'Fonio', 'Niébé']

const CEREALE_COLORS: Record<Cereale, string> = {
  'Maïs':  '#D4AF37',
  'Sorgho':'#00D4FF',
  'Mil':   '#a78bfa',
  'Riz':   '#4ade80',
  'Fonio': '#f97316',
  'Niébé': '#f43f5e',
}

const STATUT_STYLE: Record<StatutBroyage, { bg: string; color: string }> = {
  'Terminé':    { bg: 'rgba(74,222,128,0.12)',  color: '#4ade80' },
  'En cours':   { bg: 'rgba(0,212,255,0.12)',   color: '#00D4FF' },
  'En attente': { bg: 'rgba(212,175,55,0.12)',  color: '#D4AF37' },
}

const barData = CEREALES.map(c => ({
  cereale: c,
  kg: MOCK_BROYAGES.filter(b => b.cereale === c).reduce((s, b) => s + b.quantiteEntree, 0),
}))

const lineData = [
  { jour: 'J-29', ca: 12000 }, { jour: 'J-28', ca: 18500 }, { jour: 'J-27', ca: 8200  },
  { jour: 'J-26', ca: 22000 }, { jour: 'J-25', ca: 15000 }, { jour: 'J-24', ca: 9500  },
  { jour: 'J-23', ca: 25000 }, { jour: 'J-22', ca: 11000 }, { jour: 'J-21', ca: 19800 },
  { jour: 'J-20', ca: 14200 }, { jour: 'J-19', ca: 21000 }, { jour: 'J-18', ca: 16500 },
  { jour: 'J-17', ca: 23000 }, { jour: 'J-16', ca: 12800 }, { jour: 'J-15', ca: 18000 },
  { jour: 'J-14', ca: 9000  }, { jour: 'J-13', ca: 25500 }, { jour: 'J-12', ca: 13200 },
  { jour: 'J-11', ca: 20000 }, { jour: 'J-10', ca: 15800 }, { jour: 'J-9',  ca: 22500 },
  { jour: 'J-8',  ca: 11500 }, { jour: 'J-7',  ca: 19000 }, { jour: 'J-6',  ca: 8700  },
  { jour: 'J-5',  ca: 23800 }, { jour: 'J-4',  ca: 14500 }, { jour: 'J-3',  ca: 6580  },
  { jour: 'J-2',  ca: 8360  }, { jour: 'J-1',  ca: 13960 }, { jour: 'Auj.', ca: 8570  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.06 },
  }),
}

const inputStyle = { backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', color: '#f0f4ff' }
const labelStyle: CSSProperties = { color: '#8899bb' }

const TODAY = '2026-08-03'
const broyagesToday   = MOCK_BROYAGES.filter(b => b.date === TODAY)
const terminesToday   = broyagesToday.filter(b => b.statut === 'Terminé')
const kgTraitesToday  = terminesToday.reduce((s, b) => s + b.quantiteSortie, 0)
const caToday         = terminesToday.reduce((s, b) => s + b.total, 0)
const rendementToday  = terminesToday.length > 0
  ? Math.round(terminesToday.reduce((s, b) => s + b.quantiteSortie / b.quantiteEntree, 0) / terminesToday.length * 100)
  : 0

interface NouveauBroyageForm {
  client: string; telephone: string; cereale: Cereale | ''
  quantiteEntree: string; prixKg: string; notes: string
}

export default function BroyagesPage() {
  const [search,         setSearch]         = useState('')
  const [filterCereale,  setFilterCereale]  = useState<Cereale | 'all'>('all')
  const [filterStatut,   setFilterStatut]   = useState<StatutBroyage | 'all'>('all')
  const [selectedBroyage,setSelectedBroyage]= useState<Broyage | null>(null)
  const [showNewModal,   setShowNewModal]   = useState(false)
  const [form, setForm] = useState<NouveauBroyageForm>(
    { client: '', telephone: '', cereale: '', quantiteEntree: '', prixKg: '', notes: '' }
  )

  const filtered = MOCK_BROYAGES.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = b.client.toLowerCase().includes(q) ||
                        b.id.toLowerCase().includes(q) ||
                        b.cereale.toLowerCase().includes(q)
    const matchC = filterCereale === 'all' || b.cereale === filterCereale
    const matchS = filterStatut  === 'all' || b.statut  === filterStatut
    return matchSearch && matchC && matchS
  })

  function handleSubmit() {
    setShowNewModal(false)
    setForm({ client: '', telephone: '', cereale: '', quantiteEntree: '', prixKg: '', notes: '' })
  }

  const kpis = [
    { label: "Broyages aujourd'hui",  value: String(broyagesToday.length),                     icon: Cog,       color: '#D4AF37' },
    { label: 'Kg traités (sortie)',    value: `${kgTraitesToday.toLocaleString('fr-FR')} kg`,   icon: Scale,     color: '#00D4FF' },
    { label: 'CA du jour (FCFA)',      value: caToday.toLocaleString('fr-FR'),                  icon: TrendingUp, color: '#4ade80' },
    { label: 'Taux rendement',         value: `${rendementToday} %`,                            icon: Activity,  color: '#a78bfa' },
  ]

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Cog className="w-6 h-6" style={{ color: '#D4AF37' }} />
            Broyages
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8899bb' }}>
            Sessions de mouture · Suivi en temps réel
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
        >
          <Plus className="w-4 h-4" />
          Nouveau broyage
        </button>
      </div>

      {/* ── KPI cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k, i) => (
          <motion.div key={k.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            className="p-5 rounded-2xl"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: '#8899bb' }}>{k.label}</span>
              <k.icon className="w-4 h-4" style={{ color: k.color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="p-5 rounded-2xl" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#8899bb' }}>Kg traités par céréale</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="cereale" tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#f0f4ff' }} itemStyle={{ color: '#D4AF37' }} />
              <Bar dataKey="kg" radius={[4, 4, 0, 0]}>
                {barData.map(entry => (
                  <Cell key={entry.cereale} fill={CEREALE_COLORS[entry.cereale as Cereale]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-2xl" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#8899bb' }}>CA journalier — 30 jours (FCFA)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="jour" tick={{ fill: '#8899bb', fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#f0f4ff' }} itemStyle={{ color: '#00D4FF' }}
                formatter={(v) => [typeof v === 'number' ? `${v.toLocaleString('fr-FR')} F` : String(v), 'CA']} />
              <Line type="monotone" dataKey="ca" stroke="#00D4FF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Filtres ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8899bb' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher client, ID, céréale…"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f4ff' }} />
        </div>
        <select value={filterCereale} onChange={e => setFilterCereale(e.target.value as Cereale | 'all')}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f4ff' }}>
          <option value="all">Toutes céréales</option>
          {CEREALES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value as StatutBroyage | 'all')}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f4ff' }}>
          <option value="all">Tous statuts</option>
          <option value="Terminé">Terminé</option>
          <option value="En cours">En cours</option>
          <option value="En attente">En attente</option>
        </select>
      </div>

      {/* ── En-têtes colonnes ─────────────────────────────── */}
      <div className="grid grid-cols-8 px-4 pb-2 text-xs" style={{ color: 'rgba(136,153,187,0.5)' }}>
        <div>ID</div><div className="col-span-2">Client</div><div>Céréale</div>
        <div>Entrée kg</div><div>Sortie kg</div><div>Total F</div><div className="text-right">Statut</div>
      </div>

      {/* ── Table ─────────────────────────────────────────── */}
      <div className="space-y-2">
        {filtered.map((b, i) => (
          <motion.div key={b.id} custom={i} variants={fadeUp} initial="hidden" animate="show"
            className="grid grid-cols-8 items-center px-4 py-3.5 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={() => setSelectedBroyage(b)}
          >
            <div className="text-xs font-mono" style={{ color: '#8899bb' }}>{b.id}</div>
            <div className="col-span-2">
              <div className="font-medium text-sm">{b.client}</div>
              <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: '#8899bb' }}>
                <Phone className="w-3 h-3" />{b.telephone}
              </div>
            </div>
            <div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${CEREALE_COLORS[b.cereale]}18`, color: CEREALE_COLORS[b.cereale] }}>
                {b.cereale}
              </span>
            </div>
            <div className="text-sm">{b.quantiteEntree.toLocaleString('fr-FR')} kg</div>
            <div className="text-sm">{b.quantiteSortie > 0 ? `${b.quantiteSortie.toLocaleString('fr-FR')} kg` : '—'}</div>
            <div className="text-sm font-bold" style={{ color: '#D4AF37' }}>
              {b.total > 0 ? `${b.total.toLocaleString('fr-FR')} F` : '—'}
            </div>
            <div className="flex justify-end">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: STATUT_STYLE[b.statut].bg, color: STATUT_STYLE[b.statut].color }}>
                {b.statut}
              </span>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm" style={{ color: '#8899bb' }}>Aucun broyage trouvé.</div>
        )}
      </div>

      {/* ── Modal Détail ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedBroyage && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              onClick={() => setSelectedBroyage(null)} />
            <motion.div className="relative w-full max-w-lg rounded-2xl p-6 z-10"
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)' }}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } }}
              exit={{ scale: 0.94, opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Cog className="w-4 h-4" style={{ color: '#D4AF37' }} />{selectedBroyage.id}
                </h2>
                <button onClick={() => setSelectedBroyage(null)} style={{ color: '#8899bb' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                {([
                  ['Client', selectedBroyage.client],
                  ['Téléphone', selectedBroyage.telephone],
                  ['Céréale', selectedBroyage.cereale],
                  ['Date', selectedBroyage.date],
                  ['Heure début', selectedBroyage.heureDebut || '—'],
                  ['Heure fin', selectedBroyage.heureFin || '—'],
                  ['Durée', selectedBroyage.duree],
                  ['Entrée', `${selectedBroyage.quantiteEntree} kg`],
                  ['Sortie', selectedBroyage.quantiteSortie > 0 ? `${selectedBroyage.quantiteSortie} kg` : '—'],
                  ['Prix/kg', `${selectedBroyage.prixKg} FCFA`],
                  ['Total', selectedBroyage.total > 0 ? `${selectedBroyage.total.toLocaleString('fr-FR')} FCFA` : '—'],
                  ['Rendement', selectedBroyage.quantiteSortie > 0
                    ? `${Math.round(selectedBroyage.quantiteSortie / selectedBroyage.quantiteEntree * 100)} %` : '—'],
                ] as [string, string][]).map(([l, v]) => (
                  <div key={l}>
                    <span className="text-xs block" style={{ color: '#8899bb' }}>{l}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>

              {selectedBroyage.notes && (
                <div className="p-3 rounded-lg mb-4"
                  style={{ backgroundColor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <span className="text-xs" style={{ color: '#D4AF37' }}>Notes : {selectedBroyage.notes}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ backgroundColor: STATUT_STYLE[selectedBroyage.statut].bg, color: STATUT_STYLE[selectedBroyage.statut].color }}>
                  {selectedBroyage.statut}
                </span>
                {selectedBroyage.statut !== 'Terminé' && (
                  <button onClick={() => setSelectedBroyage(null)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}>
                    {selectedBroyage.statut === 'En attente' ? 'Démarrer' : 'Terminer'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal Nouveau broyage ─────────────────────────── */}
      <AnimatePresence>
        {showNewModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              onClick={() => setShowNewModal(false)} />
            <motion.div className="relative w-full max-w-md rounded-2xl p-6 z-10"
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)' }}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } }}
              exit={{ scale: 0.94, opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4" style={{ color: '#D4AF37' }} />Nouveau broyage
                </h2>
                <button onClick={() => setShowNewModal(false)} style={{ color: '#8899bb' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {([
                  { label: 'Nom du client',        key: 'client',         placeholder: 'Ex : Aminata Ouédraogo', type: 'text'   },
                  { label: 'Téléphone',             key: 'telephone',      placeholder: '+226 70 00 00 00',        type: 'tel'    },
                  { label: 'Quantité entrée (kg)',  key: 'quantiteEntree', placeholder: 'Ex : 200',                type: 'number' },
                  { label: 'Prix au kg (FCFA)',     key: 'prixKg',         placeholder: 'Ex : 25',                 type: 'number' },
                  { label: 'Notes',                 key: 'notes',          placeholder: 'Optionnel…',              type: 'text'   },
                ] as const).map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-medium block mb-1" style={labelStyle}>{field.label}</label>
                    <input type={field.type} value={form[field.key]}
                      onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium block mb-1" style={labelStyle}>Céréale</label>
                  <select value={form.cereale}
                    onChange={e => setForm(p => ({ ...p, cereale: e.target.value as Cereale | '' }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle}>
                    <option value="">Sélectionner…</option>
                    {CEREALES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#8899bb' }}>Annuler</button>
                <button onClick={handleSubmit}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}>Enregistrer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-8" />
    </div>
  )
}
