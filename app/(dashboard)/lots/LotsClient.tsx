'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Eye, X, Package, TrendingUp, Factory, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useHydrated } from "@/lib/useHydrated"

interface Lot {
  id: string; reference: string; matierePremiere: string; fournisseur: string
  quantiteEntree: number; qualite: string; produitFini: string
  quantiteSortie: number; rendement: number; dateDebut: string
  dateFin: string | null; statut: string; machine: string; cout: number
}

const STATUTS = ['Tous', 'En cours', 'Termine', 'Planifie']

const STATUT_CFG: Record<string, { bg: string; color: string }> = {
  'En cours': { bg: 'rgba(0,188,212,0.15)', color: '#00BCD4' },
  'Termine':  { bg: 'rgba(74,222,128,0.15)', color: '#4ade80' },
  'Planifie': { bg: 'rgba(212,175,55,0.15)', color: '#D4AF37' },
}

const QUALITE_COLOR: Record<string, string> = {
  'Grade A+': '#D4AF37', 'Grade A': '#00BCD4', 'Grade B': '#a78bfa',
}

function StatutBadge({ statut }: { statut: string }) {
  const s = STATUT_CFG[statut] ?? { bg: 'rgba(255,255,255,0.1)', color: '#8899bb' }
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, backgroundColor: s.bg, color: s.color }}>{statut}</span>
}

const fmtFCFA = (n: number) => n > 0 ? n.toLocaleString('fr-FR') + ' FCFA' : '—'
const fmtKg   = (n: number) => n > 0 ? n.toLocaleString('fr-FR') + ' kg' : '—'

export default function LotsClient({ lots }: { lots: Lot[] }) {
  const [filtre,   setFiltre]   = useState('Tous')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<Lot | null>(null)
  const mounted = useHydrated()

  const filtered = lots.filter(l => {
    const matchF = filtre === 'Tous' || l.statut === filtre
    const matchS = l.reference.toLowerCase().includes(search.toLowerCase()) ||
                   l.matierePremiere.toLowerCase().includes(search.toLowerCase()) ||
                   l.fournisseur.toLowerCase().includes(search.toLowerCase())
    return matchF && matchS
  })

  const enCours = lots.filter(l => l.statut === 'En cours').length
  const termines = lots.filter(l => l.statut === 'Termine').length
  const prodTotale = lots.filter(l => l.statut === 'Termine').reduce((a, l) => a + l.quantiteSortie, 0)
  const rendMoyen = (() => {
    const valid = lots.filter(l => l.rendement > 0)
    return valid.length ? (valid.reduce((a, l) => a + l.rendement, 0) / valid.length).toFixed(1) : '—'
  })()

  const chartData = lots.filter(l => l.rendement > 0).map(l => ({
    name: l.matierePremiere.length > 10 ? l.matierePremiere.slice(0, 10) + '…' : l.matierePremiere,
    rendement: l.rendement,
    color: l.rendement >= 70 ? '#4ade80' : l.rendement >= 50 ? '#D4AF37' : '#f97316',
  }))

  return (
    <div style={{ padding: '2rem', color: '#f0f4ff' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package style={{ width: 22, height: 22, color: '#D4AF37' }} /> Lots de production
          </h1>
          <p style={{ color: '#8899bb', fontSize: '0.8rem', margin: 0 }}>{lots.length} lots · {enCours} en cours · {termines} terminés</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.6rem 1.1rem', borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', backgroundColor: '#D4AF37', color: '#0A1628', border: 'none', cursor: 'pointer' }}>
          <Plus style={{ width: 15, height: 15 }} /> Nouveau lot
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Lots en cours',    value: String(enCours),            color: '#00BCD4', icon: Factory      },
          { label: 'Lots termines',    value: String(termines),           color: '#4ade80', icon: CheckCircle  },
          { label: 'Prod. totale',     value: fmtKg(prodTotale),          color: '#D4AF37', icon: Package      },
          { label: 'Rendement moyen',  value: rendMoyen === '—' ? '—' : rendMoyen + '%', color: '#a78bfa', icon: TrendingUp },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#8899bb', fontSize: '0.7rem' }}>{k.label}</span>
              <k.icon style={{ width: 14, height: 14, color: k.color }} />
            </div>
            <p style={{ color: k.color, fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{k.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart + Filtres */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.25rem' }}>
          <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 1rem' }}>Rendement par lot (%)</p>
          {mounted && (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8899bb' }} angle={-30} textAnchor="end" axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#8899bb' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: 'white' }} formatter={(v) => [v + '%', 'Rendement']} />
                <Bar dataKey="rendement" radius={[4, 4, 0, 0]}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Filtres */}
        <div style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.25rem' }}>
          <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 1rem' }}>Filtres</p>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#8899bb' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ref, matiere, fournisseur…"
              style={{ width: '100%', paddingLeft: 28, paddingRight: 10, paddingTop: 7, paddingBottom: 7, backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {STATUTS.map(s => {
              const cfg = STATUT_CFG[s]
              const isActive = filtre === s
              return (
                <button key={s} onClick={() => setFiltre(s)} style={{
                  padding: '0.4rem 0.75rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer', border: '1px solid',
                  background: isActive ? (cfg ? cfg.bg : 'rgba(255,255,255,0.08)') : 'transparent',
                  borderColor: isActive ? (cfg ? cfg.color : 'rgba(255,255,255,0.15)') : 'rgba(255,255,255,0.08)',
                  color: isActive ? (cfg ? cfg.color : '#f0f4ff') : '#8899bb',
                }}>{s === 'Tous' ? 'Tous les lots' : s}</button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <motion.div style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 70 } }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Reference', 'Matiere → Produit', 'Machine', 'Qualite', 'Entree', 'Sortie', 'Rendement', 'Debut', 'Statut', ''].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.68rem', color: '#8899bb', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lot, i) => (
              <tr key={lot.id}
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#D4AF37', fontWeight: 700 }}>{lot.reference}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f0f4ff', margin: '0 0 2px' }}>{lot.matierePremiere}</p>
                  <p style={{ fontSize: '0.7rem', color: '#5a6a85', margin: 0 }}>→ {lot.produitFini}</p>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#8899bb', fontSize: '0.78rem' }}>{lot.machine}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: QUALITE_COLOR[lot.qualite] ?? '#8899bb' }}>{lot.qualite}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#f0f4ff', fontSize: '0.8rem' }}>{fmtKg(lot.quantiteEntree)}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#f0f4ff', fontSize: '0.8rem' }}>{fmtKg(lot.quantiteSortie)}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {lot.rendement > 0 ? (
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: lot.rendement >= 70 ? '#4ade80' : lot.rendement >= 50 ? '#D4AF37' : '#f97316' }}>
                      {lot.rendement}%
                    </span>
                  ) : <span style={{ color: '#5a6a85' }}>—</span>}
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#8899bb', fontSize: '0.78rem' }}>{lot.dateDebut}</td>
                <td style={{ padding: '0.75rem 1rem' }}><StatutBadge statut={lot.statut} /></td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <button onClick={() => setSelected(lot)} style={{ padding: '4px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', color: '#8899bb' }}>
                    <Eye style={{ width: 14, height: 14 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#8899bb', fontSize: '0.85rem' }}>Aucun lot trouvé</div>
        )}
      </motion.div>

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}
          onClick={() => setSelected(null)}>
          <div style={{ background: '#0f1f3d', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '2rem', width: 460, maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ color: '#f0f4ff', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 4px' }}>{selected.reference}</h2>
                <p style={{ color: '#5a6a85', fontSize: '0.75rem', margin: 0 }}>{selected.machine}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#8899bb' }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            {[
              ['Matiere premiere', selected.matierePremiere + ' (' + selected.qualite + ')'],
              ['Produit fini',     selected.produitFini],
              ['Fournisseur',      selected.fournisseur],
              ['Entree',           fmtKg(selected.quantiteEntree)],
              ['Sortie',           fmtKg(selected.quantiteSortie)],
              ['Rendement',        selected.rendement > 0 ? selected.rendement + '%' : '—'],
              ['Cout matiere',     fmtFCFA(selected.cout)],
              ['Debut',            selected.dateDebut],
              ['Fin',              selected.dateFin ?? 'En cours'],
              ['Statut',           selected.statut],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#8899bb', fontSize: '0.78rem' }}>{label}</span>
                <span style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.78rem' }}>{value}</span>
              </div>
            ))}
            {selected.statut === 'En cours' && (
              <button style={{ width: '100%', marginTop: '1.25rem', padding: '0.65rem', background: '#4ade80', color: '#0A1628', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                <CheckCircle style={{ display: 'inline', width: 14, height: 14, marginRight: 6 }} /> Marquer termine
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
