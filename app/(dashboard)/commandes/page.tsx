'use client'

import { useState } from 'react'
import { ClipboardList, Search, X, Plus, CheckCircle, TrendingUp, Clock, Package, BadgeCheck } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Commande {
  id: string
  client: string
  quantiteKg: number
  typeMouture: string
  statut: string
  dateLivraison: string
  montantFCFA: number
}

const COMMANDES_INITIALES: Commande[] = [
  { id: 'CMD-001', client: 'Boubacar Traoré', quantiteKg: 500, typeMouture: 'Farine blanche', statut: 'Prête', dateLivraison: '01/08/2026', montantFCFA: 75000 },
  { id: 'CMD-002', client: 'Mariam Ouédraogo', quantiteKg: 200, typeMouture: 'Farine de maïs', statut: 'En cours', dateLivraison: '02/08/2026', montantFCFA: 28000 },
  { id: 'CMD-003', client: 'Coopérative Ziga', quantiteKg: 1000, typeMouture: 'Farine complète', statut: 'En attente', dateLivraison: '03/08/2026', montantFCFA: 140000 },
  { id: 'CMD-004', client: 'Ibrahim Sawadogo', quantiteKg: 150, typeMouture: 'Son de blé', statut: 'Livrée', dateLivraison: '29/07/2026', montantFCFA: 12000 },
  { id: 'CMD-005', client: 'Fatoumata Kaboré', quantiteKg: 300, typeMouture: 'Farine blanche', statut: 'En cours', dateLivraison: '02/08/2026', montantFCFA: 45000 },
  { id: 'CMD-006', client: 'Siaka Compaoré', quantiteKg: 750, typeMouture: 'Farine de maïs', statut: 'En attente', dateLivraison: '04/08/2026', montantFCFA: 105000 },
  { id: 'CMD-007', client: 'Boulangerie Horizon', quantiteKg: 2000, typeMouture: 'Farine blanche', statut: 'En cours', dateLivraison: '05/08/2026', montantFCFA: 300000 },
  { id: 'CMD-008', client: 'Aminata Diallo', quantiteKg: 100, typeMouture: 'Farine complète', statut: 'Livrée', dateLivraison: '28/07/2026', montantFCFA: 15000 },
  { id: 'CMD-009', client: 'SONAGESS', quantiteKg: 5000, typeMouture: 'Farine blanche', statut: 'En attente', dateLivraison: '10/08/2026', montantFCFA: 700000 },
  { id: 'CMD-010', client: 'Moussa Tapsoba', quantiteKg: 80, typeMouture: 'Son de blé', statut: 'Annulée', dateLivraison: '27/07/2026', montantFCFA: 6400 },
  { id: 'CMD-011', client: 'Agroalim Ouaga', quantiteKg: 1500, typeMouture: 'Farine blanche', statut: 'Livrée', dateLivraison: '25/07/2026', montantFCFA: 225000 },
  { id: 'CMD-012', client: 'Roukiatou Sawadogo', quantiteKg: 250, typeMouture: 'Farine de maïs', statut: 'Prête', dateLivraison: '01/08/2026', montantFCFA: 35000 },
]

const STATUT_CFG: Record<string, { color: string; bg: string }> = {
  'En attente': { color: '#fb923c', bg: 'rgba(251,146,60,0.18)' },
  'En cours':   { color: '#60a5fa', bg: 'rgba(96,165,250,0.18)' },
  'Prête':      { color: '#4ade80', bg: 'rgba(74,222,128,0.18)' },
  'Livrée':     { color: '#00D4FF', bg: 'rgba(0,212,255,0.18)' },
  'Annulée':    { color: '#f87171', bg: 'rgba(248,113,113,0.18)' },
}

const CHART_DATA = [
  { type: 'Farine blanche', kg: 9050 },
  { type: 'Farine maïs', kg: 1200 },
  { type: 'Farine complète', kg: 1100 },
  { type: 'Son de blé', kg: 230 },
]

const TYPES = ['Tous', 'Farine blanche', 'Farine complète', 'Farine de maïs', 'Son de blé']
const STATUTS = ['Tous', 'En attente', 'En cours', 'Prête', 'Livrée', 'Annulée']

const S = {
  page: { backgroundColor: '#060f1e', minHeight: '100vh', padding: '1.5rem', color: 'white' } as React.CSSProperties,
  card: { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem' } as React.CSSProperties,
  th: { color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', padding: '0.75rem 1rem', textAlign: 'left' as const },
  td: { padding: '0.65rem 1rem', fontSize: '0.85rem' } as React.CSSProperties,
  input: { backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.5rem', color: 'white', padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%', outline: 'none' } as React.CSSProperties,
}

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>(COMMANDES_INITIALES)
  const [search, setSearch] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [filtreType, setFiltreType] = useState('Tous')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ client: '', quantiteKg: '', typeMouture: 'Farine blanche', dateLivraison: '' })

  const filtered = commandes.filter(c => {
    const matchSearch = c.client.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search)
    const matchStatut = filtreStatut === 'Tous' || c.statut === filtreStatut
    const matchType = filtreType === 'Tous' || c.typeMouture === filtreType
    return matchSearch && matchStatut && matchType
  })

  const enCours = commandes.filter(c => c.statut === 'En cours' || c.statut === 'En attente').length
  const livrees = commandes.filter(c => c.statut === 'Livrée').length
  const valeurTotale = commandes.filter(c => c.statut !== 'Annulée').reduce((s, c) => s + c.montantFCFA, 0)
  const qtyTotale = commandes.filter(c => c.statut !== 'Annulée').reduce((s, c) => s + c.quantiteKg, 0)

  function marquerPrete(id: string) {
    setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: 'Prête' } : c))
    toast.success(`Commande ${id} marquée comme prête`)
  }

  function ajouterCommande() {
    if (!form.client || !form.quantiteKg) { toast.error('Remplis tous les champs'); return }
    const newId = `CMD-${String(commandes.length + 1).padStart(3, '0')}`
    const montant = Math.round(parseFloat(form.quantiteKg) * 150)
    setCommandes(prev => [...prev, {
      id: newId, client: form.client, quantiteKg: parseFloat(form.quantiteKg),
      typeMouture: form.typeMouture, statut: 'En attente',
      dateLivraison: form.dateLivraison || new Date(Date.now() + 86400000 * 3).toLocaleDateString('fr-FR'),
      montantFCFA: montant,
    }])
    toast.success(`Commande ${newId} créée`)
    setShowModal(false)
    setForm({ client: '', quantiteKg: '', typeMouture: 'Farine blanche', dateLivraison: '' })
  }

  return (
    <div style={S.page}>
      <Toaster richColors position="top-right" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList style={{ color: '#D4AF37', width: 24, height: 24 }} /> Commandes de mouture
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#8899bb', marginTop: 4 }}>{filtered.length} commande{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#D4AF37', color: '#0A1628', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Plus style={{ width: 15, height: 15 }} /> Nouvelle commande
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'En cours / Attente', value: String(enCours), icon: Clock, color: '#fb923c' },
          { label: 'Livrées', value: String(livrees), icon: BadgeCheck, color: '#4ade80' },
          { label: 'Valeur active', value: `${(valeurTotale / 1000).toFixed(0)} k FCFA`, icon: TrendingUp, color: '#D4AF37' },
          { label: 'Volume actif', value: `${qtyTotale.toLocaleString()} kg`, icon: Package, color: '#00D4FF' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ ...S.card, padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.68rem', color: '#8899bb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
              <Icon style={{ width: 17, height: 17, color }} />
            </div>
            <p style={{ fontSize: '1.4rem', fontWeight: 700, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ ...S.card, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Volume commandé par type (kg)</p>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={CHART_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="type" tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${(v / 1000).toFixed(0)}t`} />
            <Tooltip contentStyle={{ backgroundColor: '#0c1a34', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: 'white', fontSize: 12 }} formatter={(v: any) => [`${v.toLocaleString()} kg`, 'Volume']} />
            <Bar dataKey="kg" fill="#D4AF37" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#8899bb' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher client ou N°..." style={{ ...S.input, paddingLeft: '2rem' }} />
        </div>
        <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)} style={{ ...S.input, width: 'auto', cursor: 'pointer' }}>
          {STATUTS.map(s => <option key={s} style={{ backgroundColor: '#0A1628' }}>{s}</option>)}
        </select>
        <select value={filtreType} onChange={e => setFiltreType(e.target.value)} style={{ ...S.input, width: 'auto', cursor: 'pointer' }}>
          {TYPES.map(t => <option key={t} style={{ backgroundColor: '#0A1628' }}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ ...S.card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(212,175,55,0.08)' }}>
              {['N°', 'Client', 'Qty (kg)', 'Type', 'Statut', 'Livraison', 'Montant', 'Action'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const st = STATUT_CFG[c.statut] ?? { color: '#8899bb', bg: 'rgba(255,255,255,0.08)' }
              return (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ ...S.td, fontFamily: 'monospace', color: '#8899bb' }}>{c.id}</td>
                  <td style={{ ...S.td, color: 'white', fontWeight: 500 }}>{c.client}</td>
                  <td style={{ ...S.td, color: '#cbd5e1' }}>{c.quantiteKg.toLocaleString()}</td>
                  <td style={{ ...S.td, color: '#cbd5e1' }}>{c.typeMouture}</td>
                  <td style={S.td}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 20, backgroundColor: st.bg, color: st.color }}>{c.statut}</span>
                  </td>
                  <td style={{ ...S.td, color: '#8899bb', fontSize: '0.75rem' }}>{c.dateLivraison}</td>
                  <td style={{ ...S.td, color: '#D4AF37', fontWeight: 600 }}>{c.montantFCFA.toLocaleString()} F</td>
                  <td style={S.td}>
                    {(c.statut === 'En cours' || c.statut === 'En attente') && (
                      <button onClick={() => marquerPrete(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 6, backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ade80', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        <CheckCircle style={{ width: 11, height: 11 }} /> Prête
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal nouvelle commande */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#0c1a34', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '1rem', padding: '1.5rem', width: 380 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Nouvelle commande</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: 18, height: 18, color: '#8899bb' }} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input placeholder="Nom du client" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} style={S.input} />
              <input type="number" placeholder="Quantité (kg)" value={form.quantiteKg} onChange={e => setForm(f => ({ ...f, quantiteKg: e.target.value }))} style={S.input} />
              <select value={form.typeMouture} onChange={e => setForm(f => ({ ...f, typeMouture: e.target.value }))} style={{ ...S.input, cursor: 'pointer' }}>
                {TYPES.slice(1).map(t => <option key={t} style={{ backgroundColor: '#0A1628' }}>{t}</option>)}
              </select>
              <input type="date" value={form.dateLivraison} onChange={e => setForm(f => ({ ...f, dateLivraison: e.target.value }))} style={S.input} />
            </div>
            <button onClick={ajouterCommande} style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', borderRadius: '0.5rem', backgroundColor: '#D4AF37', color: '#0A1628', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
              Créer la commande
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
