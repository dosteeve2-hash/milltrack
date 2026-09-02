'use client'

import { useState } from 'react'
import { PackageOpen, TrendingUp, AlertTriangle, Activity, X, Plus, Minus, Layers } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Matiere {
  id: number
  nom: string
  categorie: string
  quantite: number
  capaciteMax: number
  valeurFCFA: number
  derniereMaj: string
}

const MATIERES_INITIALES: Matiere[] = [
  { id: 1, nom: 'Maïs brut', categorie: 'Matière première', quantite: 12.4, capaciteMax: 50, valeurFCFA: 310000, derniereMaj: '01/08/2026' },
  { id: 2, nom: 'Blé tendre', categorie: 'Matière première', quantite: 3.2, capaciteMax: 40, valeurFCFA: 256000, derniereMaj: '31/07/2026' },
  { id: 3, nom: 'Sorgho', categorie: 'Matière première', quantite: 8.7, capaciteMax: 30, valeurFCFA: 174000, derniereMaj: '01/08/2026' },
  { id: 4, nom: 'Soja', categorie: 'Matière première', quantite: 1.5, capaciteMax: 20, valeurFCFA: 225000, derniereMaj: '30/07/2026' },
  { id: 5, nom: 'Farine T45', categorie: 'Produit fini', quantite: 8.3, capaciteMax: 25, valeurFCFA: 498000, derniereMaj: '01/08/2026' },
  { id: 6, nom: 'Farine T55', categorie: 'Produit fini', quantite: 18.3, capaciteMax: 30, valeurFCFA: 1098000, derniereMaj: '01/08/2026' },
  { id: 7, nom: 'Farine T65', categorie: 'Produit fini', quantite: 6.1, capaciteMax: 20, valeurFCFA: 366000, derniereMaj: '31/07/2026' },
  { id: 8, nom: 'Semoule', categorie: 'Produit fini', quantite: 4.8, capaciteMax: 15, valeurFCFA: 336000, derniereMaj: '01/08/2026' },
  { id: 9, nom: 'Farine de maïs', categorie: 'Produit fini', quantite: 9.6, capaciteMax: 20, valeurFCFA: 480000, derniereMaj: '01/08/2026' },
  { id: 10, nom: 'Son de blé', categorie: 'Sous-produit', quantite: 4.1, capaciteMax: 15, valeurFCFA: 82000, derniereMaj: '01/08/2026' },
]

function getStatut(pct: number) {
  if (pct < 20) return { label: 'Critique', color: '#f87171', bg: 'rgba(248,113,113,0.18)', barColor: '#f87171' }
  if (pct < 40) return { label: 'Faible', color: '#fb923c', bg: 'rgba(251,146,60,0.18)', barColor: '#fb923c' }
  if (pct > 90) return { label: 'Plein', color: '#4ade80', bg: 'rgba(74,222,128,0.18)', barColor: '#4ade80' }
  return { label: 'Normal', color: '#00D4FF', bg: 'rgba(0,212,255,0.18)', barColor: '#D4AF37' }
}

const CATEGORIES = ['Tous', 'Matière première', 'Produit fini', 'Sous-produit']

const S = {
  page: { backgroundColor: '#060f1e', minHeight: '100vh', padding: '1.5rem', color: 'white' } as React.CSSProperties,
  card: { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem' } as React.CSSProperties,
  th: { color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', padding: '0.75rem 1rem', textAlign: 'left' as const },
  td: { padding: '0.65rem 1rem', fontSize: '0.85rem' } as React.CSSProperties,
  input: { backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.5rem', color: 'white', padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%', outline: 'none' } as React.CSSProperties,
}

export default function StocksPage() {
  const [matieres, setMatieres] = useState<Matiere[]>(MATIERES_INITIALES)
  const [filtreCateg, setFiltreCateg] = useState('Tous')
  const [showEntree, setShowEntree] = useState(false)
  const [showSortie, setShowSortie] = useState(false)
  const [form, setForm] = useState({ matiereId: '1', quantite: '', fournisseur: '', destination: 'production' })

  const filtered = filtreCateg === 'Tous' ? matieres : matieres.filter(m => m.categorie === filtreCateg)

  const total = matieres.reduce((s, m) => s + m.quantite, 0)
  const valeur = matieres.reduce((s, m) => s + m.valeurFCFA, 0)
  const alertes = matieres.filter(m => (m.quantite / m.capaciteMax) * 100 < 40).length
  const capacite = Math.round((total / matieres.reduce((s, m) => s + m.capaciteMax, 0)) * 100)

  const chartData = matieres.map(m => ({
    nom: m.nom.length > 10 ? m.nom.slice(0, 10) + '…' : m.nom,
    pct: Math.round((m.quantite / m.capaciteMax) * 100),
  }))

  function handleEntree() {
    const qty = parseFloat(form.quantite)
    if (!qty || qty <= 0) { toast.error('Quantité invalide'); return }
    setMatieres(prev => prev.map(m => m.id === parseInt(form.matiereId)
      ? { ...m, quantite: Math.min(m.quantite + qty, m.capaciteMax), derniereMaj: new Date().toLocaleDateString('fr-FR') }
      : m))
    toast.success(`Entrée de ${qty}t enregistrée`)
    setShowEntree(false)
    setForm(f => ({ ...f, quantite: '', fournisseur: '' }))
  }

  function handleSortie() {
    const qty = parseFloat(form.quantite)
    const matiere = matieres.find(m => m.id === parseInt(form.matiereId))
    if (!qty || qty <= 0) { toast.error('Quantité invalide'); return }
    if (matiere && qty > matiere.quantite) { toast.error('Stock insuffisant'); return }
    setMatieres(prev => prev.map(m => m.id === parseInt(form.matiereId)
      ? { ...m, quantite: Math.max(0, m.quantite - qty), derniereMaj: new Date().toLocaleDateString('fr-FR') }
      : m))
    toast.success(`Sortie de ${qty}t enregistrée`)
    setShowSortie(false)
    setForm(f => ({ ...f, quantite: '', destination: 'production' }))
  }

  return (
    <div style={S.page}>
      <Toaster richColors position="top-right" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers style={{ color: '#D4AF37', width: 24, height: 24 }} /> Stocks matières &amp; produits
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#8899bb', marginTop: 4 }}>Matières premières, produits finis, sous-produits</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowEntree(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#D4AF37', color: '#0A1628', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            <Plus style={{ width: 15, height: 15 }} /> Entrée
          </button>
          <button onClick={() => setShowSortie(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(0,212,255,0.15)', color: '#00D4FF', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(0,212,255,0.3)', cursor: 'pointer' }}>
            <Minus style={{ width: 15, height: 15 }} /> Sortie
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Stock total', value: `${total.toFixed(1)} t`, icon: PackageOpen, color: '#00D4FF' },
          { label: 'Valeur totale', value: `${(valeur / 1000).toFixed(0)} k FCFA`, icon: TrendingUp, color: '#D4AF37' },
          { label: 'Alertes stock', value: String(alertes), icon: AlertTriangle, color: alertes > 0 ? '#f87171' : '#4ade80' },
          { label: 'Capacité utilisée', value: `${capacite}%`, icon: Activity, color: '#a78bfa' },
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
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Taux de remplissage par article (%)</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="nom" tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ backgroundColor: '#0c1a34', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: 'white', fontSize: 12 }} formatter={(v) => [`${v}%`, 'Remplissage']} />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.pct < 20 ? '#f87171' : entry.pct < 40 ? '#fb923c' : '#D4AF37'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filtres catégorie */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFiltreCateg(c)} style={{ padding: '0.35rem 0.85rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: filtreCateg === c ? '#D4AF37' : 'rgba(255,255,255,0.07)', color: filtreCateg === c ? '#0A1628' : '#8899bb', transition: 'all 0.2s' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...S.card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(212,175,55,0.08)' }}>
              {['Article', 'Catégorie', 'Quantité (t)', 'Capacité max', 'Remplissage', 'Statut', 'Valeur', 'Dernière MAJ'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => {
              const pct = Math.round((m.quantite / m.capaciteMax) * 100)
              const st = getStatut(pct)
              return (
                <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ ...S.td, color: 'white', fontWeight: 500 }}>{m.nom}</td>
                  <td style={{ ...S.td, color: '#8899bb', fontSize: '0.75rem' }}>{m.categorie}</td>
                  <td style={{ ...S.td, color: '#cbd5e1' }}>{m.quantite.toFixed(1)}</td>
                  <td style={{ ...S.td, color: '#8899bb' }}>{m.capaciteMax}</td>
                  <td style={{ ...S.td, minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)' }}>
                        <div style={{ height: 6, borderRadius: 3, width: `${pct}%`, backgroundColor: st.barColor, transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#8899bb', minWidth: 30 }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={S.td}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 20, backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                  </td>
                  <td style={{ ...S.td, color: '#D4AF37', fontWeight: 600 }}>{(m.valeurFCFA / 1000).toFixed(0)} k</td>
                  <td style={{ ...S.td, color: '#8899bb', fontSize: '0.75rem' }}>{m.derniereMaj}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Entrée */}
      {showEntree && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#0c1a34', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '1rem', padding: '1.5rem', width: 380 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Entrée stock</h3>
              <button onClick={() => setShowEntree(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: 18, height: 18, color: '#8899bb' }} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <select value={form.matiereId} onChange={e => setForm(f => ({ ...f, matiereId: e.target.value }))} style={{ ...S.input, cursor: 'pointer' }}>
                {matieres.map(m => <option key={m.id} value={m.id} style={{ backgroundColor: '#0A1628' }}>{m.nom}</option>)}
              </select>
              <input type="number" placeholder="Quantité (tonnes)" value={form.quantite} onChange={e => setForm(f => ({ ...f, quantite: e.target.value }))} style={S.input} />
              <input type="text" placeholder="Fournisseur (optionnel)" value={form.fournisseur} onChange={e => setForm(f => ({ ...f, fournisseur: e.target.value }))} style={S.input} />
            </div>
            <button onClick={handleEntree} style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', borderRadius: '0.5rem', backgroundColor: '#D4AF37', color: '#0A1628', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Enregistrer l&apos;entrée</button>
          </div>
        </div>
      )}

      {/* Modal Sortie */}
      {showSortie && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#0c1a34', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '1rem', padding: '1.5rem', width: 380 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Sortie stock</h3>
              <button onClick={() => setShowSortie(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: 18, height: 18, color: '#8899bb' }} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <select value={form.matiereId} onChange={e => setForm(f => ({ ...f, matiereId: e.target.value }))} style={{ ...S.input, cursor: 'pointer' }}>
                {matieres.map(m => <option key={m.id} value={m.id} style={{ backgroundColor: '#0A1628' }}>{m.nom}</option>)}
              </select>
              <input type="number" placeholder="Quantité (tonnes)" value={form.quantite} onChange={e => setForm(f => ({ ...f, quantite: e.target.value }))} style={S.input} />
              <select value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} style={{ ...S.input, cursor: 'pointer' }}>
                <option value="production" style={{ backgroundColor: '#0A1628' }}>Production</option>
                <option value="vente" style={{ backgroundColor: '#0A1628' }}>Vente directe</option>
                <option value="autre" style={{ backgroundColor: '#0A1628' }}>Autre</option>
              </select>
            </div>
            <button onClick={handleSortie} style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', borderRadius: '0.5rem', backgroundColor: 'rgba(0,212,255,0.15)', color: '#00D4FF', fontWeight: 600, border: '1px solid rgba(0,212,255,0.3)', cursor: 'pointer' }}>Enregistrer la sortie</button>
          </div>
        </div>
      )}
    </div>
  )
}
