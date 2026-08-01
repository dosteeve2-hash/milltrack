'use client'

import { useState } from 'react'
import { PackageOpen, TrendingUp, AlertTriangle, BarChart3, X, Plus, Minus } from 'lucide-react'
import { Toaster, toast } from 'sonner'

interface Matiere {
  id: number
  nom: string
  quantite: number
  capaciteMax: number
  valeurFCFA: number
  derniereMaj: string
}

const MATIERES_INITIALES: Matiere[] = [
  { id: 1, nom: 'Maïs brut', quantite: 12.4, capaciteMax: 50, valeurFCFA: 310000, derniereMaj: '01/08/2026' },
  { id: 2, nom: 'Blé tendre', quantite: 3.2, capaciteMax: 40, valeurFCFA: 256000, derniereMaj: '31/07/2026' },
  { id: 3, nom: 'Sorgho', quantite: 8.7, capaciteMax: 30, valeurFCFA: 174000, derniereMaj: '01/08/2026' },
  { id: 4, nom: 'Soja', quantite: 1.5, capaciteMax: 20, valeurFCFA: 225000, derniereMaj: '30/07/2026' },
  { id: 5, nom: 'Son de blé (stocké)', quantite: 4.1, capaciteMax: 15, valeurFCFA: 82000, derniereMaj: '01/08/2026' },
  { id: 6, nom: 'Farine blanche', quantite: 18.3, capaciteMax: 25, valeurFCFA: 915000, derniereMaj: '01/08/2026' },
  { id: 7, nom: 'Farine de maïs', quantite: 9.6, capaciteMax: 20, valeurFCFA: 480000, derniereMaj: '01/08/2026' },
  { id: 8, nom: 'Farine de soja', quantite: 0.8, capaciteMax: 10, valeurFCFA: 120000, derniereMaj: '30/07/2026' },
]

function getStatut(pct: number) {
  if (pct < 20) return { label: 'Critique', bg: '#fee2e2', color: '#dc2626' }
  if (pct < 40) return { label: 'Bas', bg: '#fef3c7', color: '#d97706' }
  if (pct > 90) return { label: 'Plein', bg: '#dcfce7', color: '#16a34a' }
  return { label: 'Normal', bg: '#e0f2fe', color: '#0369a1' }
}

export default function StocksPage() {
  const [matieres, setMatieres] = useState<Matiere[]>(MATIERES_INITIALES)
  const [showEntree, setShowEntree] = useState(false)
  const [showSortie, setShowSortie] = useState(false)
  const [form, setForm] = useState({ matiereId: '1', quantite: '', fournisseur: '', destination: 'production' })

  const total = matieres.reduce((s, m) => s + m.quantite, 0)
  const valeur = matieres.reduce((s, m) => s + m.valeurFCFA, 0)
  const alertes = matieres.filter(m => (m.quantite / m.capaciteMax) * 100 < 40).length
  const capacite = Math.round((total / matieres.reduce((s, m) => s + m.capaciteMax, 0)) * 100)

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
    <div className="p-6" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Toaster richColors position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0A1628' }}>Stocks matières</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Gestion des matières premières et produits finis</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowEntree(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#0A1628' }}>
            <Plus className="w-4 h-4" /> Entrée stock
          </button>
          <button onClick={() => setShowSortie(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}>
            <Minus className="w-4 h-4" /> Sortie stock
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {[
          { label: 'Stock total', value: `${total.toFixed(1)} t`, icon: PackageOpen, color: '#0A1628' },
          { label: 'Valeur totale', value: `${(valeur/1000).toFixed(0)} k FCFA`, icon: TrendingUp, color: '#D4AF37' },
          { label: 'Alertes stock', value: `${alertes}`, icon: AlertTriangle, color: alertes > 0 ? '#dc2626' : '#16a34a' },
          { label: 'Capacité utilisée', value: `${capacite}%`, icon: BarChart3, color: '#00D4FF' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: '#64748b' }}>{label}</span>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#0A1628' }}>
              {['Matière', 'Quantité (t)', 'Capacité max', 'Remplissage', 'Statut', 'Dernière MAJ'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#D4AF37' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matieres.map((m, i) => {
              const pct = Math.round((m.quantite / m.capaciteMax) * 100)
              const st = getStatut(pct)
              return (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                  <td className="px-4 py-3 font-medium text-sm" style={{ color: '#0A1628' }}>{m.nom}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#334155' }}>{m.quantite.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#334155' }}>{m.capaciteMax}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-full h-2" style={{ backgroundColor: '#e2e8f0' }}>
                        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pct < 20 ? '#dc2626' : pct < 40 ? '#d97706' : '#D4AF37' }} />
                      </div>
                      <span className="text-xs font-medium w-10 text-right" style={{ color: '#64748b' }}>{pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{m.derniereMaj}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Entrée */}
      {showEntree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl p-6 w-96 shadow-xl" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ color: '#0A1628' }}>Entrée stock</h3>
              <button onClick={() => setShowEntree(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <select value={form.matiereId} onChange={e => setForm(f => ({ ...f, matiereId: e.target.value }))}
                className="w-full border rounded-lg p-2 text-sm" style={{ borderColor: '#e2e8f0' }}>
                {matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
              </select>
              <input type="number" placeholder="Quantité (tonnes)" value={form.quantite}
                onChange={e => setForm(f => ({ ...f, quantite: e.target.value }))}
                className="w-full border rounded-lg p-2 text-sm" style={{ borderColor: '#e2e8f0' }} />
              <input type="text" placeholder="Fournisseur" value={form.fournisseur}
                onChange={e => setForm(f => ({ ...f, fournisseur: e.target.value }))}
                className="w-full border rounded-lg p-2 text-sm" style={{ borderColor: '#e2e8f0' }} />
            </div>
            <button onClick={handleEntree} className="w-full mt-4 py-2 rounded-lg font-medium text-white"
              style={{ backgroundColor: '#0A1628' }}>Enregistrer l&apos;entrée</button>
          </div>
        </div>
      )}

      {/* Modal Sortie */}
      {showSortie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl p-6 w-96 shadow-xl" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ color: '#0A1628' }}>Sortie stock</h3>
              <button onClick={() => setShowSortie(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <select value={form.matiereId} onChange={e => setForm(f => ({ ...f, matiereId: e.target.value }))}
                className="w-full border rounded-lg p-2 text-sm" style={{ borderColor: '#e2e8f0' }}>
                {matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
              </select>
              <input type="number" placeholder="Quantité (tonnes)" value={form.quantite}
                onChange={e => setForm(f => ({ ...f, quantite: e.target.value }))}
                className="w-full border rounded-lg p-2 text-sm" style={{ borderColor: '#e2e8f0' }} />
              <select value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                className="w-full border rounded-lg p-2 text-sm" style={{ borderColor: '#e2e8f0' }}>
                <option value="production">Production</option>
                <option value="vente">Vente directe</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <button onClick={handleSortie} className="w-full mt-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}>Enregistrer la sortie</button>
          </div>
        </div>
      )}
    </div>
  )
}
