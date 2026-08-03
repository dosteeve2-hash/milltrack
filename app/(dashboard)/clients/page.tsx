'use client'

import { useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  Users, TrendingUp, Star, UserPlus,
  Search, Plus, X, Phone, MapPin, ChevronDown, ChevronUp,
} from 'lucide-react'

type Cereale = 'Maïs' | 'Sorgho' | 'Mil' | 'Riz' | 'Fonio' | 'Niébé'
type StatutClient = 'Régulier' | 'Occasionnel' | 'Nouveau'

interface Client {
  id: number
  nom: string
  telephone: string
  village: string
  cerealeHabituelle: Cereale
  nombreBroyages: number
  totalKgTraites: number
  totalDepense: number
  derniereVisite: string
  statut: StatutClient
}

interface NouveauClientForm {
  nom: string; telephone: string; village: string
  cerealeHabituelle: Cereale | ''; statut: StatutClient | ''
}

const MOCK_CLIENTS: Client[] = [
  { id: 1,  nom: 'Aminata Ouédraogo',  telephone: '+226 70 12 34 56', village: 'Kombissiri',    cerealeHabituelle: 'Maïs',  nombreBroyages: 18, totalKgTraites: 3200,  totalDepense: 80000,  derniereVisite: '2026-08-03', statut: 'Régulier'    },
  { id: 2,  nom: 'Boureima Kaboré',    telephone: '+226 76 98 76 54', village: 'Sapouy',         cerealeHabituelle: 'Sorgho',nombreBroyages: 9,  totalKgTraites: 1350,  totalDepense: 40500,  derniereVisite: '2026-08-03', statut: 'Régulier'    },
  { id: 3,  nom: 'Fatoumata Traoré',   telephone: '+226 65 43 21 09', village: 'Léo',            cerealeHabituelle: 'Mil',   nombreBroyages: 4,  totalKgTraites: 400,   totalDepense: 11200,  derniereVisite: '2026-08-03', statut: 'Occasionnel' },
  { id: 4,  nom: 'Salif Sawadogo',     telephone: '+226 70 55 44 33', village: 'Ouagadougou',    cerealeHabituelle: 'Maïs',  nombreBroyages: 1,  totalKgTraites: 0,     totalDepense: 0,      derniereVisite: '2026-08-03', statut: 'Nouveau'     },
  { id: 5,  nom: 'Rasmata Compaoré',   telephone: '+226 76 11 22 44', village: 'Manga',          cerealeHabituelle: 'Fonio', nombreBroyages: 12, totalKgTraites: 960,   totalDepense: 38400,  derniereVisite: '2026-08-02', statut: 'Régulier'    },
  { id: 6,  nom: 'Oumar Diallo',       telephone: '+226 65 77 88 00', village: 'Pô',             cerealeHabituelle: 'Riz',   nombreBroyages: 7,  totalKgTraites: 1750,  totalDepense: 61250,  derniereVisite: '2026-08-02', statut: 'Régulier'    },
  { id: 7,  nom: 'Aïssata Zongo',      telephone: '+226 70 99 88 77', village: 'Garango',        cerealeHabituelle: 'Niébé', nombreBroyages: 5,  totalKgTraites: 600,   totalDepense: 19200,  derniereVisite: '2026-08-02', statut: 'Occasionnel' },
  { id: 8,  nom: 'Idrissa Coulibaly',  telephone: '+226 76 33 22 11', village: 'Koupéla',        cerealeHabituelle: 'Sorgho',nombreBroyages: 14, totalKgTraites: 2520,  totalDepense: 75600,  derniereVisite: '2026-08-01', statut: 'Régulier'    },
  { id: 9,  nom: 'Mariam Konaté',      telephone: '+226 70 44 55 66', village: 'Tenkodogo',      cerealeHabituelle: 'Maïs',  nombreBroyages: 22, totalKgTraites: 8800,  totalDepense: 220000, derniereVisite: '2026-08-01', statut: 'Régulier'    },
  { id: 10, nom: 'Adama Sorgho',       telephone: '+226 65 12 34 78', village: 'Bittou',         cerealeHabituelle: 'Mil',   nombreBroyages: 3,  totalKgTraites: 270,   totalDepense: 7560,   derniereVisite: '2026-07-31', statut: 'Nouveau'     },
]

const CEREALES: Cereale[] = ['Maïs', 'Sorgho', 'Mil', 'Riz', 'Fonio', 'Niébé']
const STATUTS: StatutClient[] = ['Régulier', 'Occasionnel', 'Nouveau']

const STATUT_COLOR: Record<StatutClient, string> = {
  'Régulier':   '#4ade80',
  'Occasionnel':'#00D4FF',
  'Nouveau':    '#D4AF37',
}

const CEREALE_COLORS: Record<Cereale, string> = {
  'Maïs': '#D4AF37', 'Sorgho': '#00D4FF', 'Mil': '#a78bfa',
  'Riz': '#4ade80',  'Fonio': '#f97316',  'Niébé': '#f43f5e',
}

const top5BarData = [...MOCK_CLIENTS]
  .sort((a, b) => b.totalKgTraites - a.totalKgTraites)
  .slice(0, 5)
  .map(c => ({ nom: c.nom.split(' ')[0], kg: c.totalKgTraites, cereale: c.cerealeHabituelle }))

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.06 },
  }),
}

const inputStyle = { backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', color: '#f0f4ff' }
const labelStyle: CSSProperties = { color: '#8899bb' }

const totalClients   = MOCK_CLIENTS.length
const reguliers      = MOCK_CLIENTS.filter(c => c.statut === 'Régulier').length
const nouveauxMois   = MOCK_CLIENTS.filter(c => c.statut === 'Nouveau').length
const caFideles      = MOCK_CLIENTS.filter(c => c.statut === 'Régulier')
                         .reduce((s, c) => s + c.totalDepense, 0)

export default function ClientsPage() {
  const [search,       setSearch]       = useState('')
  const [filterStatut, setFilterStatut] = useState<StatutClient | 'all'>('all')
  const [expandedId,   setExpandedId]   = useState<number | null>(null)
  const [showModal,    setShowModal]    = useState(false)
  const [form, setForm] = useState<NouveauClientForm>(
    { nom: '', telephone: '', village: '', cerealeHabituelle: '', statut: '' }
  )

  const filtered = MOCK_CLIENTS.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = c.nom.toLowerCase().includes(q) || c.village.toLowerCase().includes(q)
    const matchStatut = filterStatut === 'all' || c.statut === filterStatut
    return matchSearch && matchStatut
  })

  function handleSubmit() {
    setShowModal(false)
    setForm({ nom: '', telephone: '', village: '', cerealeHabituelle: '', statut: '' })
  }

  const kpis = [
    { label: 'Total clients',       value: String(totalClients),                    icon: Users,    color: '#D4AF37' },
    { label: 'Clients réguliers',   value: String(reguliers),                       icon: Star,     color: '#4ade80' },
    { label: 'Nouveaux ce mois',    value: String(nouveauxMois),                    icon: UserPlus, color: '#00D4FF' },
    { label: 'CA clients fidèles',  value: caFideles.toLocaleString('fr-FR') + ' F', icon: TrendingUp, color: '#a78bfa' },
  ]

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" style={{ color: '#D4AF37' }} />
            Clients
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8899bb' }}>
            Gestion des clients du moulin
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}>
          <Plus className="w-4 h-4" />Nouveau client
        </button>
      </div>

      {/* ── KPI cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k, i) => (
          <motion.div key={k.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            className="p-5 rounded-2xl"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: '#8899bb' }}>{k.label}</span>
              <k.icon className="w-4 h-4" style={{ color: k.color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Bar chart top 5 ───────────────────────────────── */}
      <div className="p-5 rounded-2xl mb-8" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#8899bb' }}>Top 5 clients par kg traités</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={top5BarData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="nom" tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              labelStyle={{ color: '#f0f4ff' }} itemStyle={{ color: '#D4AF37' }} />
            <Bar dataKey="kg" radius={[4, 4, 0, 0]}>
              {top5BarData.map((entry, idx) => (
                <Cell key={idx} fill={CEREALE_COLORS[entry.cereale as Cereale]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Filtres ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8899bb' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou village…"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f4ff' }} />
        </div>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value as StatutClient | 'all')}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f4ff' }}>
          <option value="all">Tous statuts</option>
          {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* ── En-têtes colonnes ─────────────────────────────── */}
      <div className="grid grid-cols-7 px-4 pb-2 text-xs" style={{ color: 'rgba(136,153,187,0.5)' }}>
        <div className="col-span-2">Nom / Téléphone</div><div>Village</div>
        <div>Céréale hab.</div><div className="text-center">Broyages</div>
        <div>Kg traités</div><div className="text-right">Dernière visite</div>
      </div>

      {/* ── Table clients ──────────────────────────────────── */}
      <div className="space-y-2">
        {filtered.map((c, i) => {
          const isExpanded = expandedId === c.id
          return (
            <motion.div key={c.id} custom={i} variants={fadeUp} initial="hidden" animate="show"
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="grid grid-cols-7 items-center px-4 py-3.5 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedId(prev => prev === c.id ? null : c.id)}>
                <div className="col-span-2">
                  <div className="font-medium text-sm">{c.nom}</div>
                  <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: '#8899bb' }}>
                    <Phone className="w-3 h-3" />{c.telephone}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8899bb' }}>
                  <MapPin className="w-3.5 h-3.5" />{c.village}
                </div>
                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${CEREALE_COLORS[c.cerealeHabituelle]}18`, color: CEREALE_COLORS[c.cerealeHabituelle] }}>
                    {c.cerealeHabituelle}
                  </span>
                </div>
                <div className="text-sm font-medium text-center">{c.nombreBroyages}</div>
                <div className="text-sm font-bold" style={{ color: '#D4AF37' }}>
                  {c.totalKgTraites.toLocaleString('fr-FR')} kg
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs" style={{ color: '#8899bb' }}>{c.derniereVisite}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" style={{ color: '#8899bb' }} />
                              : <ChevronDown className="w-4 h-4" style={{ color: '#8899bb' }} />}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1, transition: { type: 'spring' as const, stiffness: 200, damping: 26 } }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs block" style={{ color: '#8899bb' }}>Total dépensé</span>
                          <span className="font-bold" style={{ color: '#D4AF37' }}>
                            {c.totalDepense.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                        <div>
                          <span className="text-xs block" style={{ color: '#8899bb' }}>Statut</span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${STATUT_COLOR[c.statut]}18`, color: STATUT_COLOR[c.statut] }}>
                            {c.statut}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs block" style={{ color: '#8899bb' }}>Céréale habituelle</span>
                          <span className="font-medium text-sm">{c.cerealeHabituelle}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm" style={{ color: '#8899bb' }}>Aucun client trouvé.</div>
        )}
      </div>

      {/* ── Modal Nouveau client ───────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              onClick={() => setShowModal(false)} />
            <motion.div className="relative w-full max-w-md rounded-2xl p-6 z-10"
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)' }}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } }}
              exit={{ scale: 0.94, opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: '#D4AF37' }} />Nouveau client
                </h2>
                <button onClick={() => setShowModal(false)} style={{ color: '#8899bb' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {([
                  { label: 'Nom complet',  key: 'nom',       placeholder: 'Ex : Aminata Ouédraogo', type: 'text' },
                  { label: 'Téléphone',    key: 'telephone', placeholder: '+226 70 00 00 00',        type: 'tel'  },
                  { label: 'Village',      key: 'village',   placeholder: 'Ex : Kombissiri',         type: 'text' },
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
                  <label className="text-xs font-medium block mb-1" style={labelStyle}>Céréale habituelle</label>
                  <select value={form.cerealeHabituelle}
                    onChange={e => setForm(p => ({ ...p, cerealeHabituelle: e.target.value as Cereale | '' }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle}>
                    <option value="">Sélectionner…</option>
                    {CEREALES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={labelStyle}>Statut</label>
                  <select value={form.statut}
                    onChange={e => setForm(p => ({ ...p, statut: e.target.value as StatutClient | '' }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle}>
                    <option value="">Sélectionner…</option>
                    {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowModal(false)}
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
