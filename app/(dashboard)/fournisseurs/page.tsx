'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Truck, Clock, Search, X, Plus, Phone, MapPin, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

type Matiere = 'mil' | 'sorgho' | 'maïs' | 'blé'
type Region = 'Dédougou' | 'Bobo-Dioulasso' | 'Kaya' | 'Ouagadougou' | "Fada N'Gourma"
type Statut = 'Actif' | 'Inactif'

interface Fournisseur {
  id: number
  nom: string
  region: Region
  matiere: Matiere
  volumeMensuelKg: number
  prixTonneFCFA: number
  telephone: string
  statut: Statut
  commandesEnCours: number
  delaiLivraisonJours: number
}

interface NouveauFournisseur {
  nom: string
  telephone: string
  region: string
  matiere: Matiere | ''
  prixTonneFCFA: string
}

const MOCK_FOURNISSEURS: Fournisseur[] = [
  { id: 1, nom: 'Amadou Traoré', region: 'Dédougou', matiere: 'mil', volumeMensuelKg: 12000, prixTonneFCFA: 180000, telephone: '+226 70 11 22 33', statut: 'Actif', commandesEnCours: 2, delaiLivraisonJours: 3 },
  { id: 2, nom: 'Mariam Coulibaly', region: 'Bobo-Dioulasso', matiere: 'sorgho', volumeMensuelKg: 8500, prixTonneFCFA: 165000, telephone: '+226 76 44 55 66', statut: 'Actif', commandesEnCours: 1, delaiLivraisonJours: 5 },
  { id: 3, nom: 'Ibrahim Sawadogo', region: 'Kaya', matiere: 'maïs', volumeMensuelKg: 15200, prixTonneFCFA: 145000, telephone: '+226 65 77 88 99', statut: 'Actif', commandesEnCours: 3, delaiLivraisonJours: 2 },
  { id: 4, nom: 'Fatimata Ouédraogo', region: 'Dédougou', matiere: 'blé', volumeMensuelKg: 6800, prixTonneFCFA: 220000, telephone: '+226 70 22 33 44', statut: 'Actif', commandesEnCours: 1, delaiLivraisonJours: 4 },
  { id: 5, nom: 'Moussa Diallo', region: 'Bobo-Dioulasso', matiere: 'mil', volumeMensuelKg: 9300, prixTonneFCFA: 175000, telephone: '+226 76 55 66 77', statut: 'Actif', commandesEnCours: 2, delaiLivraisonJours: 5 },
  { id: 6, nom: 'Aissata Konaté', region: 'Kaya', matiere: 'sorgho', volumeMensuelKg: 4200, prixTonneFCFA: 160000, telephone: '+226 65 88 99 00', statut: 'Inactif', commandesEnCours: 0, delaiLivraisonJours: 6 },
  { id: 7, nom: 'Boureima Compaoré', region: 'Ouagadougou', matiere: 'maïs', volumeMensuelKg: 11000, prixTonneFCFA: 148000, telephone: '+226 70 33 44 55', statut: 'Actif', commandesEnCours: 2, delaiLivraisonJours: 1 },
  { id: 8, nom: 'Salimata Barry', region: 'Dédougou', matiere: 'blé', volumeMensuelKg: 7500, prixTonneFCFA: 215000, telephone: '+226 76 66 77 88', statut: 'Actif', commandesEnCours: 1, delaiLivraisonJours: 4 },
  { id: 9, nom: 'Yacouba Zongo', region: "Fada N'Gourma", matiere: 'mil', volumeMensuelKg: 5600, prixTonneFCFA: 172000, telephone: '+226 65 99 00 11', statut: 'Inactif', commandesEnCours: 0, delaiLivraisonJours: 7 },
  { id: 10, nom: 'Rasmané Nikiéma', region: 'Kaya', matiere: 'sorgho', volumeMensuelKg: 13200, prixTonneFCFA: 162000, telephone: '+226 70 44 55 66', statut: 'Actif', commandesEnCours: 3, delaiLivraisonJours: 2 },
]

const TOP5_DATA = [
  { nom: 'I. Sawadogo', volume: 91.2 },
  { nom: 'R. Nikiéma', volume: 79.2 },
  { nom: 'A. Traoré', volume: 72.0 },
  { nom: 'B. Compaoré', volume: 66.0 },
  { nom: 'M. Diallo', volume: 55.8 },
]

const MATIERES: Matiere[] = ['mil', 'sorgho', 'maïs', 'blé']
const REGIONS: Region[] = ['Dédougou', 'Bobo-Dioulasso', 'Kaya', 'Ouagadougou', "Fada N'Gourma"]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.06 },
  }),
}

const MATIERE_COLOR: Record<Matiere, string> = {
  mil: '#D4AF37', sorgho: '#00BCD4', maïs: '#f97316', blé: '#a78bfa',
}

export default function FournisseursPage() {
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [filterMatiere, setFilterMatiere] = useState<Matiere | 'all'>('all')
  const [filterRegion, setFilterRegion] = useState<Region | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<NouveauFournisseur>({ nom: '', telephone: '', region: '', matiere: '', prixTonneFCFA: '' })

  useEffect(() => setMounted(true), [])

  const filtered = MOCK_FOURNISSEURS.filter(f => {
    const matchSearch = f.nom.toLowerCase().includes(search.toLowerCase())
    const matchMatiere = filterMatiere === 'all' || f.matiere === filterMatiere
    const matchRegion = filterRegion === 'all' || f.region === filterRegion
    return matchSearch && matchMatiere && matchRegion
  })

  const actifs = MOCK_FOURNISSEURS.filter(f => f.statut === 'Actif').length
  const commandesTotal = MOCK_FOURNISSEURS.reduce((s, f) => s + f.commandesEnCours, 0)
  const volumeTotal = Math.round(MOCK_FOURNISSEURS.reduce((s, f) => s + f.volumeMensuelKg, 0) / 1000)
  const delaiMoyen = Math.round(MOCK_FOURNISSEURS.reduce((s, f) => s + f.delaiLivraisonJours, 0) / MOCK_FOURNISSEURS.length)

  const STATS = [
    { label: 'Fournisseurs actifs', value: actifs, icon: Users, color: '#D4AF37' },
    { label: 'Commandes en cours', value: commandesTotal, icon: Truck, color: '#00BCD4' },
    { label: 'Volume total (t/mois)', value: `${volumeTotal} t`, icon: TrendingUp, color: '#4ade80' },
    { label: 'Délai moyen livraison', value: `${delaiMoyen} j`, icon: Clock, color: '#f97316' },
  ]

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" style={{ color: '#D4AF37' }} />
            Fournisseurs
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8899bb' }}>
            Matières premières · Régions Burkina · Suivi volumes & prix
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
        >
          <Plus className="w-4 h-4" />
          Ajouter un fournisseur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s, i) => (
          <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            className="p-5 rounded-2xl" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: '#8899bb' }}>{s.label}</span>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* BarChart top 5 */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
        className="p-6 rounded-2xl mb-8" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#8899bb' }}>
          Top 5 fournisseurs — volume livré sur 6 mois (tonnes)
        </h2>
        {mounted && (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TOP5_DATA} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="nom" tick={{ fill: '#8899bb', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8899bb', fontSize: 12 }} axisLine={false} tickLine={false} unit=" t" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a2a45', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#f0f4ff' }}
                itemStyle={{ color: '#D4AF37' }}
                formatter={(v) => [typeof v === 'number' ? `${v} t` : '', 'Volume']}
              />
              <Bar dataKey="volume" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8899bb' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un fournisseur..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f4ff' }}
          />
        </div>
        <select
          value={filterMatiere}
          onChange={e => setFilterMatiere(e.target.value as Matiere | 'all')}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f4ff' }}
        >
          <option value="all">Toutes matières</option>
          {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={filterRegion}
          onChange={e => setFilterRegion(e.target.value as Region | 'all')}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f4ff' }}
        >
          <option value="all">Toutes régions</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Fournisseur', 'Région', 'Matière', 'Vol. mensuel', 'Prix/tonne', 'Statut', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#8899bb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <motion.tr key={f.id} custom={i} variants={fadeUp} initial="hidden" animate="show"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium">{f.nom}</div>
                  <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: '#8899bb' }}>
                    <Phone className="w-3 h-3" />{f.telephone}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8899bb' }}>
                    <MapPin className="w-3 h-3" />{f.region}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                    style={{ backgroundColor: `${MATIERE_COLOR[f.matiere]}18`, color: MATIERE_COLOR[f.matiere] }}>
                    {f.matiere}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{(f.volumeMensuelKg / 1000).toFixed(1)} t</td>
                <td className="px-4 py-3">{f.prixTonneFCFA.toLocaleString()} FCFA</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: f.statut === 'Actif' ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)',
                      color: f.statut === 'Actif' ? '#4ade80' : '#8899bb',
                    }}>
                    {f.statut}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a href={`tel:${f.telephone}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90 inline-flex items-center gap-1.5"
                    style={{ backgroundColor: 'rgba(0,188,212,0.12)', color: '#00BCD4', border: '1px solid rgba(0,188,212,0.2)' }}>
                    <Phone className="w-3 h-3" />Contacter
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: '#8899bb' }}>
            Aucun fournisseur trouvé.
          </div>
        )}
      </div>

      {/* Modal Ajouter */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setShowModal(false)} />
            <motion.div className="relative w-full max-w-md rounded-2xl p-6 z-10"
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)' }}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } }}
              exit={{ scale: 0.94, opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold">Ajouter un fournisseur</h2>
                <button onClick={() => setShowModal(false)} style={{ color: '#8899bb' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Nom complet', key: 'nom' as const, placeholder: 'Ex: Amadou Traoré' },
                  { label: 'Téléphone', key: 'telephone' as const, placeholder: '+226 70 00 00 00' },
                  { label: 'Région', key: 'region' as const, placeholder: 'Ex: Dédougou' },
                  { label: 'Prix/tonne (FCFA)', key: 'prixTonneFCFA' as const, placeholder: '180000' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-medium block mb-1" style={{ color: '#8899bb' }}>{field.label}</label>
                    <input
                      value={form[field.key]}
                      onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', color: '#f0f4ff' }}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: '#8899bb' }}>Matière fournie</label>
                  <select
                    value={form.matiere}
                    onChange={e => setForm(prev => ({ ...prev, matiere: e.target.value as Matiere | '' }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', color: '#f0f4ff' }}
                  >
                    <option value="">Sélectionner…</option>
                    {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#8899bb' }}>
                  Annuler
                </button>
                <button
                  onClick={() => { setShowModal(false); setForm({ nom: '', telephone: '', region: '', matiere: '', prixTonneFCFA: '' }) }}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}>
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
