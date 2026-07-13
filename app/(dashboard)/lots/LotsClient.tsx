'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Filter, Eye, Edit2 } from 'lucide-react'

interface Lot {
  id: string
  reference: string
  matierePremiere: string
  fournisseur: string
  quantiteEntree: number
  qualite: string
  produitFini: string
  quantiteSortie: number
  rendement: number
  dateDebut: string
  statut: string
}

const STATUTS = ['Tous', 'En cours', 'Terminé', 'Planifié']

function StatutBadge({ statut }: { statut: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    'En cours': { bg: 'rgba(0,188,212,0.15)', color: '#00BCD4' },
    'Terminé': { bg: 'rgba(74,222,128,0.15)', color: '#4ade80' },
    'Planifié': { bg: 'rgba(212,175,55,0.15)', color: '#D4AF37' },
  }
  const s = cfg[statut] ?? { bg: 'rgba(255,255,255,0.1)', color: '#8899bb' }
  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {statut}
    </span>
  )
}

function QualiteBadge({ qualite }: { qualite: string }) {
  const color = qualite === 'Grade A+' ? '#D4AF37' : qualite === 'Grade A' ? '#00BCD4' : '#8899bb'
  return (
    <span className="text-xs font-semibold" style={{ color }}>
      {qualite}
    </span>
  )
}

export default function LotsClient({ lots }: { lots: Lot[] }) {
  const [filtre, setFiltre] = useState('Tous')

  const filtered = filtre === 'Tous' ? lots : lots.filter((l) => l.statut === filtre)

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Lots de production</h1>
          <p className="text-sm mt-1" style={{ color: '#8899bb' }}>
            {lots.length} lots · {lots.filter((l) => l.statut === 'En cours').length} en cours
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
        >
          <Plus className="w-4 h-4" />
          Nouveau lot
        </button>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4" style={{ color: '#8899bb' }} />
        {STATUTS.map((s) => (
          <button
            key={s}
            onClick={() => setFiltre(s)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: filtre === s ? 'rgba(212,175,55,0.15)' : 'transparent',
              color: filtre === s ? '#D4AF37' : '#8899bb',
              border: filtre === s ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 70 } }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Référence', 'Matière → Produit', 'Fournisseur', 'Qualité', 'Entrée (kg)', 'Sortie (kg)', 'Rendement', 'Date', 'Statut', ''].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#8899bb' }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lot, i) => (
              <tr
                key={lot.id}
                className="transition-colors hover:bg-white/5"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-sm" style={{ color: '#D4AF37' }}>{lot.reference}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium">{lot.matierePremiere}</p>
                  <p className="text-xs" style={{ color: '#8899bb' }}>→ {lot.produitFini}</p>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: '#8899bb' }}>{lot.fournisseur}</td>
                <td className="px-4 py-3"><QualiteBadge qualite={lot.qualite} /></td>
                <td className="px-4 py-3 text-sm">{lot.quantiteEntree.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{lot.quantiteSortie > 0 ? lot.quantiteSortie.toLocaleString() : '—'}</td>
                <td className="px-4 py-3">
                  {lot.rendement > 0 ? (
                    <span className="font-bold text-sm" style={{ color: lot.rendement > 70 ? '#4ade80' : lot.rendement > 50 ? '#D4AF37' : '#f97316' }}>
                      {lot.rendement}%
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: '#8899bb' }}>{lot.dateDebut}</td>
                <td className="px-4 py-3"><StatutBadge statut={lot.statut} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: '#8899bb' }}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: '#8899bb' }}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
