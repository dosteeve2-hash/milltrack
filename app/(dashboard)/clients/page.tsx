'use client'

import { useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, TrendingUp, Package, Truck,
  Search, Plus, X, ChevronDown, ChevronUp, Phone, MapPin,
} from 'lucide-react'

type TypeClient = 'Boulangerie' | 'Restaurant' | 'Revendeur' | 'Particulier'
type StatutCommande = 'Livrée' | 'En cours' | 'En attente'

interface Commande {
  id: string
  date: string
  produit: string
  quantiteKg: number
  montantFCFA: number
  statut: StatutCommande
}

interface Client {
  id: number
  nom: string
  telephone: string
  ville: string
  type: TypeClient
  commandesCount: number
  caTotal: number
  derniereCommande: string
  historique: Commande[]
}

interface NouveauClient {
  nom: string
  telephone: string
  ville: string
  type: TypeClient | ''
  adresse: string
}

const MOCK_CLIENTS: Client[] = [
  {
    id: 1,
    nom: 'Boulangerie La Mie Dorée',
    telephone: '+226 70 12 34 56',
    ville: 'Ouagadougou',
    type: 'Boulangerie',
    commandesCount: 12,
    caTotal: 3_600_000,
    derniereCommande: '2026-07-16',
    historique: [
      { id: 'C-001', date: '2026-07-16', produit: 'Farine T55', quantiteKg: 500, montantFCFA: 350_000, statut: 'Livrée'   },
      { id: 'C-002', date: '2026-07-02', produit: 'Farine T55', quantiteKg: 600, montantFCFA: 420_000, statut: 'Livrée'   },
      { id: 'C-003', date: '2026-06-18', produit: 'Farine T65', quantiteKg: 400, montantFCFA: 300_000, statut: 'Livrée'   },
      { id: 'C-004', date: '2026-06-04', produit: 'Farine T55', quantiteKg: 500, montantFCFA: 350_000, statut: 'Livrée'   },
      { id: 'C-005', date: '2026-05-21', produit: 'Farine T55', quantiteKg: 550, montantFCFA: 385_000, statut: 'Livrée'   },
    ],
  },
  {
    id: 2,
    nom: 'Restaurant Saveur du Sahel',
    telephone: '+226 76 98 76 54',
    ville: 'Bobo-Dioulasso',
    type: 'Restaurant',
    commandesCount: 8,
    caTotal: 1_920_000,
    derniereCommande: '2026-07-15',
    historique: [
      { id: 'C-010', date: '2026-07-15', produit: 'Farine T65', quantiteKg: 200, montantFCFA: 160_000, statut: 'En cours' },
      { id: 'C-011', date: '2026-07-01', produit: 'Farine T65', quantiteKg: 150, montantFCFA: 120_000, statut: 'Livrée'   },
      { id: 'C-012', date: '2026-06-15', produit: 'Farine T55', quantiteKg: 250, montantFCFA: 175_000, statut: 'Livrée'   },
      { id: 'C-013', date: '2026-06-01', produit: 'Farine T65', quantiteKg: 200, montantFCFA: 160_000, statut: 'Livrée'   },
      { id: 'C-014', date: '2026-05-18', produit: 'Farine T55', quantiteKg: 300, montantFCFA: 210_000, statut: 'Livrée'   },
    ],
  },
  {
    id: 3,
    nom: 'Djibril Compaoré',
    telephone: '+226 65 43 21 09',
    ville: 'Koudougou',
    type: 'Revendeur',
    commandesCount: 24,
    caTotal: 7_200_000,
    derniereCommande: '2026-07-17',
    historique: [
      { id: 'C-020', date: '2026-07-17', produit: 'Farine T55', quantiteKg: 1000, montantFCFA: 700_000, statut: 'En attente' },
      { id: 'C-021', date: '2026-07-03', produit: 'Farine T55', quantiteKg: 1200, montantFCFA: 840_000, statut: 'Livrée'     },
      { id: 'C-022', date: '2026-06-19', produit: 'Farine T65', quantiteKg: 800,  montantFCFA: 640_000, statut: 'Livrée'     },
      { id: 'C-023', date: '2026-06-05', produit: 'Farine T55', quantiteKg: 1000, montantFCFA: 700_000, statut: 'Livrée'     },
      { id: 'C-024', date: '2026-05-22', produit: 'Farine T55', quantiteKg: 900,  montantFCFA: 630_000, statut: 'Livrée'     },
    ],
  },
  {
    id: 4,
    nom: 'Fatimata Sawadogo',
    telephone: '+226 70 55 44 33',
    ville: 'Ouagadougou',
    type: 'Particulier',
    commandesCount: 5,
    caTotal: 152_000,
    derniereCommande: '2026-07-10',
    historique: [
      { id: 'C-030', date: '2026-07-10', produit: 'Farine T55', quantiteKg: 50, montantFCFA: 40_000, statut: 'Livrée' },
      { id: 'C-031', date: '2026-06-20', produit: 'Farine T55', quantiteKg: 50, montantFCFA: 40_000, statut: 'Livrée' },
      { id: 'C-032', date: '2026-06-01', produit: 'Farine T55', quantiteKg: 50, montantFCFA: 40_000, statut: 'Livrée' },
      { id: 'C-033', date: '2026-05-15', produit: 'Farine T65', quantiteKg: 30, montantFCFA: 24_000, statut: 'Livrée' },
      { id: 'C-034', date: '2026-05-01', produit: 'Farine T55', quantiteKg: 50, montantFCFA: 40_000, statut: 'Livrée' },
    ],
  },
  {
    id: 5,
    nom: 'Boulangerie Moderne du Centre',
    telephone: '+226 76 11 22 44',
    ville: 'Ouagadougou',
    type: 'Boulangerie',
    commandesCount: 18,
    caTotal: 5_400_000,
    derniereCommande: '2026-07-18',
    historique: [
      { id: 'C-040', date: '2026-07-18', produit: 'Farine T55', quantiteKg: 700, montantFCFA: 490_000, statut: 'En cours' },
      { id: 'C-041', date: '2026-07-04', produit: 'Farine T55', quantiteKg: 600, montantFCFA: 420_000, statut: 'Livrée'   },
      { id: 'C-042', date: '2026-06-20', produit: 'Farine T65', quantiteKg: 500, montantFCFA: 400_000, statut: 'Livrée'   },
      { id: 'C-043', date: '2026-06-06', produit: 'Farine T55', quantiteKg: 700, montantFCFA: 490_000, statut: 'Livrée'   },
      { id: 'C-044', date: '2026-05-23', produit: 'Farine T55', quantiteKg: 600, montantFCFA: 420_000, statut: 'Livrée'   },
    ],
  },
  {
    id: 6,
    nom: 'Alimentation Générale Konaté',
    telephone: '+226 65 77 88 00',
    ville: 'Dédougou',
    type: 'Revendeur',
    commandesCount: 9,
    caTotal: 2_700_000,
    derniereCommande: '2026-07-12',
    historique: [
      { id: 'C-050', date: '2026-07-12', produit: 'Farine T55', quantiteKg: 400, montantFCFA: 280_000, statut: 'Livrée' },
      { id: 'C-051', date: '2026-06-28', produit: 'Farine T55', quantiteKg: 350, montantFCFA: 245_000, statut: 'Livrée' },
      { id: 'C-052', date: '2026-06-14', produit: 'Farine T65', quantiteKg: 300, montantFCFA: 240_000, statut: 'Livrée' },
      { id: 'C-053', date: '2026-05-31', produit: 'Farine T55', quantiteKg: 400, montantFCFA: 280_000, statut: 'Livrée' },
      { id: 'C-054', date: '2026-05-17', produit: 'Farine T55', quantiteKg: 350, montantFCFA: 245_000, statut: 'Livrée' },
    ],
  },
  {
    id: 7,
    nom: 'Hôtel Palm Beach',
    telephone: '+226 70 99 88 77',
    ville: 'Bobo-Dioulasso',
    type: 'Restaurant',
    commandesCount: 6,
    caTotal: 1_800_000,
    derniereCommande: '2026-07-08',
    historique: [
      { id: 'C-060', date: '2026-07-08', produit: 'Farine T65', quantiteKg: 300, montantFCFA: 240_000, statut: 'Livrée' },
      { id: 'C-061', date: '2026-06-24', produit: 'Farine T65', quantiteKg: 250, montantFCFA: 200_000, statut: 'Livrée' },
      { id: 'C-062', date: '2026-06-10', produit: 'Farine T55', quantiteKg: 300, montantFCFA: 210_000, statut: 'Livrée' },
      { id: 'C-063', date: '2026-05-27', produit: 'Farine T65', quantiteKg: 300, montantFCFA: 240_000, statut: 'Livrée' },
      { id: 'C-064', date: '2026-05-13', produit: 'Farine T55', quantiteKg: 350, montantFCFA: 245_000, statut: 'Livrée' },
    ],
  },
  {
    id: 8,
    nom: 'Moussa Zongo',
    telephone: '+226 76 33 22 11',
    ville: 'Banfora',
    type: 'Particulier',
    commandesCount: 4,
    caTotal: 152_000,
    derniereCommande: '2026-07-05',
    historique: [
      { id: 'C-070', date: '2026-07-05', produit: 'Farine T55', quantiteKg: 50, montantFCFA: 40_000, statut: 'Livrée' },
      { id: 'C-071', date: '2026-06-15', produit: 'Farine T55', quantiteKg: 30, montantFCFA: 24_000, statut: 'Livrée' },
      { id: 'C-072', date: '2026-05-25', produit: 'Farine T65', quantiteKg: 30, montantFCFA: 24_000, statut: 'Livrée' },
      { id: 'C-073', date: '2026-05-10', produit: 'Farine T55', quantiteKg: 50, montantFCFA: 40_000, statut: 'Livrée' },
      { id: 'C-074', date: '2026-04-25', produit: 'Farine T55', quantiteKg: 30, montantFCFA: 24_000, statut: 'Livrée' },
    ],
  },
]

const TYPES: TypeClient[] = ['Boulangerie', 'Restaurant', 'Revendeur', 'Particulier']

const TYPE_COLOR: Record<TypeClient, string> = {
  Boulangerie: '#D4AF37',
  Restaurant:  '#00BCD4',
  Revendeur:   '#a78bfa',
  Particulier: '#f97316',
}

const STATUT_STYLE: Record<StatutCommande, { backgroundColor: string; color: string }> = {
  'Livrée':     { backgroundColor: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  'En cours':   { backgroundColor: 'rgba(0,188,212,0.12)',  color: '#00BCD4' },
  'En attente': { backgroundColor: 'rgba(212,175,55,0.12)', color: '#D4AF37' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.06 },
  }),
}

const inputCls = 'w-full px-3 py-2 rounded-lg text-sm outline-none'
const inputStyle = { backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', color: '#f0f4ff' }
const labelStyle: CSSProperties = { color: '#8899bb' }

// ── Stats calculées ───────────────────────────────────────────────────────────
const totalCA = MOCK_CLIENTS.reduce((s, c) => s + c.caTotal, 0)
const commandesEnCours = MOCK_CLIENTS
  .flatMap(c => c.historique)
  .filter(cmd => cmd.statut === 'En cours' || cmd.statut === 'En attente').length
const livraisonsSemaine = MOCK_CLIENTS
  .flatMap(c => c.historique)
  .filter(cmd => {
    const diff = (new Date('2026-07-18').getTime() - new Date(cmd.date).getTime()) / 86_400_000
    return diff >= 0 && diff <= 7
  }).length

export default function ClientsPage() {
  const [search,      setSearch]      = useState('')
  const [filterType,  setFilterType]  = useState<TypeClient | 'all'>('all')
  const [expandedId,  setExpandedId]  = useState<number | null>(null)
  const [showModal,   setShowModal]   = useState(false)
  const [form,        setForm]        = useState<NouveauClient>({ nom: '', telephone: '', ville: '', type: '', adresse: '' })

  const filtered = MOCK_CLIENTS.filter(c => {
    const matchSearch = c.nom.toLowerCase().includes(search.toLowerCase()) ||
                        c.ville.toLowerCase().includes(search.toLowerCase())
    const matchType   = filterType === 'all' || c.type === filterType
    return matchSearch && matchType
  })

  function toggleExpand(id: number) {
    setExpandedId(prev => (prev === id ? null : id))
  }

  function handleSubmit() {
    setShowModal(false)
    setForm({ nom: '', telephone: '', ville: '', type: '', adresse: '' })
  }

  const stats = [
    { label: 'Total clients',      value: String(MOCK_CLIENTS.length),                icon: Users,      color: '#D4AF37' },
    { label: 'CA total (FCFA)',    value: totalCA.toLocaleString('fr-FR'),             icon: TrendingUp, color: '#4ade80' },
    { label: 'Commandes en cours', value: String(commandesEnCours),                    icon: Package,    color: '#00BCD4' },
    { label: 'Livraisons semaine', value: String(livraisonsSemaine),                   icon: Truck,      color: '#f97316' },
  ]

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" style={{ color: '#D4AF37' }} />
            Clients
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8899bb' }}>
            Boulangeries · Restaurants · Revendeurs · Particuliers
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
        >
          <Plus className="w-4 h-4" />
          Nouveau client
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="p-5 rounded-2xl"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: '#8899bb' }}>{s.label}</span>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Recherche + Filtre ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8899bb' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou ville…"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f4ff' }}
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value as TypeClient | 'all')}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f4ff' }}
        >
          <option value="all">Tous types</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* ── Légende colonnes ───────────────────────────────────── */}
      <div className="grid grid-cols-7 px-4 pb-2 text-xs" style={{ color: 'rgba(136,153,187,0.5)' }}>
        <div className="col-span-2">Nom / Téléphone</div>
        <div>Ville</div>
        <div>Type</div>
        <div className="text-center">Cmds</div>
        <div>CA total</div>
        <div className="text-right">Dernière cmd</div>
      </div>

      {/* ── Liste clients ──────────────────────────────────────── */}
      <div className="space-y-2">
        {filtered.map((client, i) => {
          const isExpanded = expandedId === client.id
          return (
            <motion.div
              key={client.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Row principale */}
              <div
                className="grid grid-cols-7 items-center px-4 py-3.5 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleExpand(client.id)}
              >
                <div className="col-span-2">
                  <div className="font-medium text-sm">{client.nom}</div>
                  <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: '#8899bb' }}>
                    <Phone className="w-3 h-3" />{client.telephone}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8899bb' }}>
                  <MapPin className="w-3.5 h-3.5" />{client.ville}
                </div>
                <div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${TYPE_COLOR[client.type]}18`, color: TYPE_COLOR[client.type] }}
                  >
                    {client.type}
                  </span>
                </div>
                <div className="text-sm font-medium text-center">{client.commandesCount}</div>
                <div className="text-sm font-bold" style={{ color: '#D4AF37' }}>
                  {client.caTotal.toLocaleString('fr-FR')} F
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs" style={{ color: '#8899bb' }}>{client.derniereCommande}</span>
                  {isExpanded
                    ? <ChevronUp   className="w-4 h-4" style={{ color: '#8899bb' }} />
                    : <ChevronDown className="w-4 h-4" style={{ color: '#8899bb' }} />
                  }
                </div>
              </div>

              {/* Historique expandable */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1, transition: { type: 'spring' as const, stiffness: 200, damping: 26 } }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <p className="text-xs font-medium mb-3" style={{ color: '#8899bb' }}>5 dernières commandes</p>
                      <div className="space-y-2">
                        {client.historique.slice(0, 5).map(cmd => (
                          <div
                            key={cmd.id}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs"
                            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            <span style={{ color: '#8899bb' }}>{cmd.date}</span>
                            <span className="font-medium">{cmd.produit}</span>
                            <span style={{ color: '#8899bb' }}>{cmd.quantiteKg.toLocaleString('fr-FR')} kg</span>
                            <span className="font-bold" style={{ color: '#D4AF37' }}>{cmd.montantFCFA.toLocaleString('fr-FR')} F</span>
                            <span className="px-2 py-0.5 rounded-full font-medium" style={STATUT_STYLE[cmd.statut]}>
                              {cmd.statut}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm" style={{ color: '#8899bb' }}>
            Aucun client trouvé.
          </div>
        )}
      </div>

      {/* ── Modal Nouveau client ───────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="relative w-full max-w-md rounded-2xl p-6 z-10"
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)' }}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } }}
              exit={{ scale: 0.94, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  Nouveau client
                </h2>
                <button onClick={() => setShowModal(false)} style={{ color: '#8899bb' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {(
                  [
                    { label: 'Nom / Raison sociale', key: 'nom',       placeholder: 'Ex : Boulangerie du Marché', type: 'text' },
                    { label: 'Téléphone',             key: 'telephone', placeholder: '+226 70 00 00 00',           type: 'tel'  },
                    { label: 'Ville',                 key: 'ville',     placeholder: 'Ex : Ouagadougou',           type: 'text' },
                    { label: 'Adresse complète',      key: 'adresse',   placeholder: 'Secteur 10, Rue 15…',        type: 'text' },
                  ] as const
                ).map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-medium block mb-1" style={labelStyle}>{field.label}</label>
                    <input
                      type={field.type}
                      value={form[field.key]}
                      onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium block mb-1" style={labelStyle}>Type de client</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(prev => ({ ...prev, type: e.target.value as TypeClient | '' }))}
                    className={inputCls}
                    style={inputStyle}
                  >
                    <option value="">Sélectionner…</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#8899bb' }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
                >
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-8" />
    </div>
  )
}
