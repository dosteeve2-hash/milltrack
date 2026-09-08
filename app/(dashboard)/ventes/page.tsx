'use client'

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { toast } from 'sonner'
import { ShoppingCart, TrendingUp, Package, Users, Plus, Search, Eye, X } from 'lucide-react'

/* ── Types ───────────────────────────────────────────────────────────────── */
type StatutVente = 'Livree' | 'En cours' | 'En attente' | 'Annulee'
type ProduitMill = 'Farine blanche 50kg' | 'Semoule fine 25kg' | 'Farine mais 50kg' | 'Son de ble 40kg' | 'Semoule grossiere 25kg' | 'Farine integrale 25kg'

interface Vente {
  id: string
  reference: string
  date: string
  client: string
  produit: ProduitMill
  quantite: number  // sacs
  prixUnitaire: number  // FCFA/sac
  montantTotal: number
  statut: StatutVente
  modePaiement: string
  notes?: string
}

/* ── Mock data ───────────────────────────────────────────────────────────── */
const VENTES: Vente[] = [
  { id:'V01', reference:'VT-2026-0089', date:'2026-08-07', client:'Boulangerie Moderne Ouaga',
    produit:'Farine blanche 50kg', quantite:60, prixUnitaire:22_500, montantTotal:1_350_000,
    statut:'Livree', modePaiement:'Virement', notes:'Client regulier — paiement 30j.' },
  { id:'V02', reference:'VT-2026-0088', date:'2026-08-06', client:'Restaurant Saveurs Africaines',
    produit:'Semoule fine 25kg', quantite:24, prixUnitaire:14_000, montantTotal:336_000,
    statut:'Livree', modePaiement:'Especes' },
  { id:'V03', reference:'VT-2026-0087', date:'2026-08-05', client:'Epicerie Centrale Bobo',
    produit:'Farine mais 50kg', quantite:40, prixUnitaire:18_000, montantTotal:720_000,
    statut:'En cours', modePaiement:'Mobile money' },
  { id:'V04', reference:'VT-2026-0086', date:'2026-08-04', client:'Ferme Avicole Kaya',
    produit:'Son de ble 40kg', quantite:80, prixUnitaire:8_500, montantTotal:680_000,
    statut:'Livree', modePaiement:'Cheque' },
  { id:'V05', reference:'VT-2026-0085', date:'2026-08-03', client:'Hotel Laico Ouaga 2000',
    produit:'Farine blanche 50kg', quantite:30, prixUnitaire:23_000, montantTotal:690_000,
    statut:'Livree', modePaiement:'Virement' },
  { id:'V06', reference:'VT-2026-0084', date:'2026-08-01', client:'Grossiste Alimentation Tanga',
    produit:'Semoule grossiere 25kg', quantite:100, prixUnitaire:12_500, montantTotal:1_250_000,
    statut:'En attente', modePaiement:'Virement', notes:'Proforma envoyee — attente validation budget.' },
  { id:'V07', reference:'VT-2026-0083', date:'2026-07-30', client:'Cantines Scolaires — MENA',
    produit:'Farine mais 50kg', quantite:200, prixUnitaire:17_500, montantTotal:3_500_000,
    statut:'Livree', modePaiement:'Virement', notes:'Marche public — livraison en 3 fois.' },
  { id:'V08', reference:'VT-2026-0082', date:'2026-07-28', client:'Boulangerie Oumarou & Fils',
    produit:'Farine integrale 25kg', quantite:50, prixUnitaire:15_500, montantTotal:775_000,
    statut:'Livree', modePaiement:'Especes' },
  { id:'V09', reference:'VT-2026-0081', date:'2026-07-25', client:'Supermarche Score Ouaga',
    produit:'Semoule fine 25kg', quantite:80, prixUnitaire:14_500, montantTotal:1_160_000,
    statut:'En cours', modePaiement:'Mobile money' },
  { id:'V10', reference:'VT-2026-0080', date:'2026-07-22', client:'Ferme Avicole Kaya',
    produit:'Son de ble 40kg', quantite:120, prixUnitaire:8_200, montantTotal:984_000,
    statut:'Livree', modePaiement:'Cheque' },
  { id:'V11', reference:'VT-2026-0079', date:'2026-07-20', client:'Boulangerie Moderne Ouaga',
    produit:'Farine blanche 50kg', quantite:80, prixUnitaire:22_500, montantTotal:1_800_000,
    statut:'Annulee', modePaiement:'Virement', notes:'Annulee — probleme qualite lot. Rembourse.' },
  { id:'V12', reference:'VT-2026-0078', date:'2026-07-18', client:'Supermarche Kanta Bobo',
    produit:'Farine mais 50kg', quantite:60, prixUnitaire:17_800, montantTotal:1_068_000,
    statut:'Livree', modePaiement:'Virement' },
]

/* ── Produit colors ───────────────────────────────────────────────────────── */
const PRODUIT_COLORS: Record<ProduitMill, string> = {
  'Farine blanche 50kg':    '#D4AF37',
  'Semoule fine 25kg':      '#00D4FF',
  'Farine mais 50kg':       '#f97316',
  'Son de ble 40kg':        '#22c55e',
  'Semoule grossiere 25kg': '#a78bfa',
  'Farine integrale 25kg':  '#ec4899',
}

function statutColor(s: StatutVente) {
  if (s === 'Livree')    return '#22c55e'
  if (s === 'En cours')  return '#00D4FF'
  if (s === 'En attente') return '#f59e0b'
  return '#6b7280'
}

function StatutBadge({ s }: { s: StatutVente }) {
  const c = statutColor(s)
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4,
      background:`${c}18`, color:c, borderRadius:6, padding:'3px 10px',
      fontSize:11, fontWeight:700, whiteSpace:'nowrap' as const }}>{s}</span>
  )
}

function KpiCard({ label, value, sub, color, icon: Icon }:
  { label:string; value:string|number; sub?:string; color:string; icon:React.ComponentType<{size?:number;color?:string}> }) {
  return (
    <div style={{ backgroundColor:'#0f1f3d', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14,
      padding:'18px 22px', display:'flex', flexDirection:'column' as const, gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:12, color:'rgba(240,244,255,0.5)' }}>{label}</span>
        <div style={{ background:`${color}18`, borderRadius:8, padding:8, display:'flex' }}>
          <Icon size={15} color={color} />
        </div>
      </div>
      <div style={{ fontSize:24, fontWeight:700, color:'#f0f4ff', fontFamily:'monospace' }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'rgba(240,244,255,0.3)' }}>{sub}</div>}
    </div>
  )
}

function ModalVente({ v, onClose }: { v: Vente; onClose: () => void }) {
  const pc = PRODUIT_COLORS[v.produit]
  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)' }} onClick={onClose} />
      <div style={{ position:'relative', backgroundColor:'#0f1f3d', border:'1px solid rgba(255,255,255,0.08)',
        borderRadius:18, padding:28, width:'100%', maxWidth:500, maxHeight:'90vh',
        overflowY:'auto' as const, margin:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#f0f4ff' }}>{v.reference}</div>
            <div style={{ fontSize:12, color:'rgba(240,244,255,0.5)', marginTop:3 }}>{v.client} · {v.date}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(240,244,255,0.3)', cursor:'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ background:`${pc}10`, border:`1px solid ${pc}25`, borderRadius:12, padding:'14px 18px',
          textAlign:'center' as const, marginBottom:16 }}>
          <div style={{ fontSize:12, color:'rgba(240,244,255,0.5)', marginBottom:4 }}>Total vente</div>
          <div style={{ fontSize:26, fontWeight:800, color:pc, fontFamily:'monospace' }}>
            {v.montantTotal.toLocaleString('fr-FR')} FCFA
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          {([
            ['Produit', v.produit],
            ['Quantite', `${v.quantite} sacs`],
            ['Prix unitaire', `${v.prixUnitaire.toLocaleString('fr-FR')} FCFA`],
            ['Mode paiement', v.modePaiement],
            ['Statut', v.statut],
            ['Date', v.date],
          ] as [string,string][]).map(([k, val], i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 14px' }}>
              <div style={{ fontSize:10, color:'rgba(240,244,255,0.3)', textTransform:'uppercase' as const,
                letterSpacing:'0.05em', marginBottom:3 }}>{k}</div>
              <div style={{ fontSize:13, color:'#f0f4ff', fontWeight:500 }}>{val}</div>
            </div>
          ))}
        </div>
        {v.notes && (
          <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)',
            borderRadius:10, padding:'10px 14px', marginBottom:16 }}>
            <div style={{ fontSize:11, color:'#f59e0b', fontWeight:600, marginBottom:4 }}>Notes</div>
            <div style={{ fontSize:12, color:'rgba(240,244,255,0.5)' }}>{v.notes}</div>
          </div>
        )}
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button onClick={onClose}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
              color:'rgba(240,244,255,0.5)', borderRadius:8, padding:'8px 16px', fontSize:12, cursor:'pointer' }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Chart par produit ───────────────────────────────────────────────────── */
const PRODUITS: ProduitMill[] = ['Farine blanche 50kg','Semoule fine 25kg','Farine mais 50kg','Son de ble 40kg','Semoule grossiere 25kg','Farine integrale 25kg']
const chartData = PRODUITS.map(p => ({
  nom: p.replace(' 50kg','').replace(' 25kg','').replace(' 40kg',''),
  ca: VENTES.filter(v => v.produit === p && v.statut !== 'Annulee').reduce((s, v) => s + v.montantTotal, 0),
  color: PRODUIT_COLORS[p],
})).filter(d => d.ca > 0)

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function VentesPage() {
  const [search,      setSearch]      = useState('')
  const [filterStat,  setFilterStat]  = useState('Tous')
  const [selected,    setSelected]    = useState<Vente | null>(null)

  const filtered = useMemo(() =>
    VENTES.filter(v =>
      (filterStat === 'Tous' || v.statut === filterStat) &&
      (!search || v.client.toLowerCase().includes(search.toLowerCase()) ||
                  v.reference.toLowerCase().includes(search.toLowerCase()) ||
                  v.produit.toLowerCase().includes(search.toLowerCase()))
    ), [filterStat, search])

  const caTotal    = VENTES.filter(v => v.statut !== 'Annulee').reduce((s, v) => s + v.montantTotal, 0)
  const ventesLivr = VENTES.filter(v => v.statut === 'Livree').length
  const sacsTotal  = VENTES.filter(v => v.statut !== 'Annulee').reduce((s, v) => s + v.quantite, 0)
  const clientsU   = new Set(VENTES.map(v => v.client)).size

  const th: React.CSSProperties = {
    padding:'10px 16px', textAlign:'left', fontSize:11, color:'rgba(240,244,255,0.3)',
    fontWeight:600, borderBottom:'1px solid rgba(255,255,255,0.06)',
    background:'rgba(255,255,255,0.02)', whiteSpace:'nowrap' as const,
  }
  const td: React.CSSProperties = {
    padding:'12px 16px', fontSize:13, color:'#f0f4ff',
    borderBottom:'1px solid rgba(255,255,255,0.05)', verticalAlign:'middle',
  }
  const fBtn = (a: boolean): React.CSSProperties => ({
    background:a ? 'rgba(212,175,55,0.15)' : 'transparent',
    color:a ? '#D4AF37' : 'rgba(240,244,255,0.5)',
    border:`1px solid ${a ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius:7, padding:'4px 11px', fontSize:11, cursor:'pointer', fontWeight:a?700:400,
  })

  return (
    <div className="p-6 md:p-8" style={{ display:'flex', flexDirection:'column' as const, gap:24 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#f0f4ff', margin:0 }}>Ventes produits</h1>
          <p style={{ fontSize:13, color:'rgba(240,244,255,0.5)', margin:'4px 0 0' }}>
            {VENTES.length} transactions · MillTrack
          </p>
        </div>
        <button onClick={() => toast.success('Nouvelle vente — bientot disponible')}
          style={{ display:'flex', alignItems:'center', gap:7, background:'#D4AF37', color:'#0A1628',
            border:'none', borderRadius:10, padding:'10px 16px', fontWeight:700, fontSize:13, cursor:'pointer' }}>
          <Plus size={14} /> Enregistrer
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:14 }}>
        <KpiCard label='CA ventes'       value={`${(caTotal/1_000_000).toFixed(2)}M`}  sub='FCFA hors annulees' color='#D4AF37' icon={TrendingUp}  />
        <KpiCard label='Livrees'         value={ventesLivr}                             sub='ventes confirmees'  color='#22c55e' icon={ShoppingCart} />
        <KpiCard label='Sacs vendus'     value={sacsTotal.toLocaleString('fr-FR')}       sub='total produits'     color='#00D4FF' icon={Package}      />
        <KpiCard label='Clients uniques' value={clientsU}                               sub='acheteurs actifs'   color='#a78bfa' icon={Users}         />
      </div>

      {/* Chart CA par produit */}
      <div style={{ backgroundColor:'#0f1f3d', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:24 }}>
        <h3 style={{ fontSize:13, fontWeight:600, color:'#f0f4ff', margin:'0 0 16px' }}>CA par type de produit (FCFA)</h3>
        <ResponsiveContainer width='100%' height={180}>
          <BarChart data={chartData} barSize={44} margin={{ top:0, right:0, bottom:0, left:-10 }}>
            <XAxis dataKey='nom' tick={{ fontSize:10, fill:'rgba(240,244,255,0.4)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:10, fill:'rgba(240,244,255,0.4)' }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `${((v as number)/1_000_000).toFixed(1)}M`} />
            <Tooltip contentStyle={{ background:'#0f1f3d', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, fontSize:12 }}
              cursor={{ fill:'rgba(255,255,255,0.04)' }}
              formatter={(v) => [`${(v as number).toLocaleString('fr-FR')} FCFA`, 'CA']} />
            <Bar dataKey='ca' radius={[5,5,0,0]}>
              {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', flexDirection:'column' as const, gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, backgroundColor:'#0f1f3d',
          border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'8px 14px', maxWidth:380 }}>
          <Search size={14} color='rgba(240,244,255,0.35)' />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder='Client, reference ou produit...'
            style={{ background:'none', border:'none', outline:'none', color:'#f0f4ff', fontSize:13, width:'100%' }} />
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
          {['Tous','Livree','En cours','En attente','Annulee'].map(s => (
            <button key={s} onClick={() => setFilterStat(s)} style={fBtn(filterStat === s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor:'#0f1f3d', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Reference','Date','Client','Produit','Quantite','Montant','Paiement','Statut',''].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ ...td, textAlign:'center', color:'rgba(240,244,255,0.25)', padding:48, border:'none' }}>
                  Aucune vente
                </td></tr>
              )}
              {filtered.map((v, i) => (
                <tr key={v.id} style={{ background:i%2===1?'rgba(255,255,255,0.02)':'transparent' }}>
                  <td style={{ ...td, fontFamily:'monospace', fontSize:11, color:'rgba(240,244,255,0.5)' }}>{v.reference}</td>
                  <td style={{ ...td, fontSize:12, color:'rgba(240,244,255,0.5)' }}>{v.date}</td>
                  <td style={{ ...td, fontWeight:600, maxWidth:160 }}>
                    <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{v.client}</div>
                  </td>
                  <td style={td}>
                    <span style={{ background:`${PRODUIT_COLORS[v.produit]}15`, color:PRODUIT_COLORS[v.produit],
                      borderRadius:5, padding:'2px 8px', fontSize:11, fontWeight:600, whiteSpace:'nowrap' as const }}>
                      {v.produit}
                    </span>
                  </td>
                  <td style={{ ...td, fontFamily:'monospace', color:'rgba(240,244,255,0.7)' }}>{v.quantite} sacs</td>
                  <td style={{ ...td, fontFamily:'monospace', fontWeight:700, color:'#D4AF37' }}>
                    {v.montantTotal.toLocaleString('fr-FR')}
                  </td>
                  <td style={{ ...td, fontSize:12, color:'rgba(240,244,255,0.5)' }}>{v.modePaiement}</td>
                  <td style={td}><StatutBadge s={v.statut} /></td>
                  <td style={td}>
                    <button onClick={() => setSelected(v)}
                      style={{ display:'inline-flex', alignItems:'center', gap:5,
                        background:'rgba(0,212,255,0.1)', border:'none', color:'#00D4FF',
                        borderRadius:7, padding:'5px 11px', fontSize:11, cursor:'pointer', fontWeight:600 }}>
                      <Eye size={12}/> Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'10px 18px', borderTop:'1px solid rgba(255,255,255,0.06)',
          fontSize:11, color:'rgba(240,244,255,0.3)', display:'flex', justifyContent:'space-between' }}>
          <span>{filtered.length} vente{filtered.length!==1?'s':''}</span>
          <span style={{ color:'#D4AF37', fontWeight:600, fontFamily:'monospace' }}>
            Total filtre : {filtered.filter(v => v.statut !== 'Annulee').reduce((s, v) => s + v.montantTotal, 0).toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>

      {selected && <ModalVente v={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
