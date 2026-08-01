'use client'

import { useState } from 'react'
import { ClipboardList, Search, X, Plus, CheckCircle } from 'lucide-react'
import { Toaster, toast } from 'sonner'

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
]

const STATUT_CONFIG: Record<string, { bg: string; color: string }> = {
  'En attente': { bg: '#fef3c7', color: '#d97706' },
  'En cours':   { bg: '#dbeafe', color: '#1d4ed8' },
  'Prête':      { bg: '#dcfce7', color: '#16a34a' },
  'Livrée':     { bg: '#f0f9ff', color: '#0369a1' },
  'Annulée':    { bg: '#fee2e2', color: '#dc2626' },
}

const TYPES = ['Tous', 'Farine blanche', 'Farine complète', 'Farine de maïs', 'Son de blé']
const STATUTS = ['Tous', 'En attente', 'En cours', 'Prête', 'Livrée', 'Annulée']

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
    <div className="p-6" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Toaster richColors position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#0A1628' }}>
            <ClipboardList className="w-7 h-7" style={{ color: '#D4AF37' }} /> Commandes de mouture
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>{filtered.length} commande{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#0A1628' }}>
          <Plus className="w-4 h-4" /> Nouvelle commande
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher client ou N°..." className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm"
            style={{ borderColor: '#e2e8f0' }} />
        </div>
        <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm" style={{ borderColor: '#e2e8f0' }}>
          {STATUTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filtreType} onChange={e => setFiltreType(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm" style={{ borderColor: '#e2e8f0' }}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Tableau */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#0A1628' }}>
              {['N°', 'Client', 'Quantité (kg)', 'Type mouture', 'Statut', 'Livraison', 'Montant', 'Action'].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#D4AF37' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const st = STATUT_CONFIG[c.statut] || { bg: '#f1f5f9', color: '#64748b' }
              return (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                  <td className="px-3 py-3 text-xs font-mono" style={{ color: '#64748b' }}>{c.id}</td>
                  <td className="px-3 py-3 text-sm font-medium" style={{ color: '#0A1628' }}>{c.client}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: '#334155' }}>{c.quantiteKg.toLocaleString()}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: '#334155' }}>{c.typeMouture}</td>
                  <td className="px-3 py-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>{c.statut}</span>
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color: '#64748b' }}>{c.dateLivraison}</td>
                  <td className="px-3 py-3 text-sm font-medium" style={{ color: '#D4AF37' }}>{c.montantFCFA.toLocaleString()} F</td>
                  <td className="px-3 py-3">
                    {(c.statut === 'En cours' || c.statut === 'En attente') && (
                      <button onClick={() => marquerPrete(c.id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded font-medium transition-colors"
                        style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                        <CheckCircle className="w-3 h-3" /> Prête
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl p-6 w-96 shadow-xl" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ color: '#0A1628' }}>Nouvelle commande</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Nom du client" value={form.client}
                onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                className="w-full border rounded-lg p-2 text-sm" style={{ borderColor: '#e2e8f0' }} />
              <input type="number" placeholder="Quantité (kg)" value={form.quantiteKg}
                onChange={e => setForm(f => ({ ...f, quantiteKg: e.target.value }))}
                className="w-full border rounded-lg p-2 text-sm" style={{ borderColor: '#e2e8f0' }} />
              <select value={form.typeMouture} onChange={e => setForm(f => ({ ...f, typeMouture: e.target.value }))}
                className="w-full border rounded-lg p-2 text-sm" style={{ borderColor: '#e2e8f0' }}>
                {TYPES.slice(1).map(t => <option key={t}>{t}</option>)}
              </select>
              <input type="date" value={form.dateLivraison}
                onChange={e => setForm(f => ({ ...f, dateLivraison: e.target.value }))}
                className="w-full border rounded-lg p-2 text-sm" style={{ borderColor: '#e2e8f0' }} />
            </div>
            <button onClick={ajouterCommande}
              className="w-full mt-4 py-2 rounded-lg font-medium text-white"
              style={{ backgroundColor: '#0A1628' }}>Créer la commande</button>
          </div>
        </div>
      )}
    </div>
  )
}
