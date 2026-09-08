'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { toast, Toaster } from 'sonner'
import { Wrench, AlertTriangle, CheckCircle, Plus, X, Calendar, Cog } from 'lucide-react'

// ── Palette ───────────────────────────────────────────────────────────────────
const NAVY   = '#0A1628'
const GOLD   = '#D4AF37'
const CYAN   = '#00D4FF'
const BG2    = '#0c1a34'
const BORDER = 'rgba(255,255,255,0.08)'
const GREEN  = '#22c55e'
const RED    = '#ef4444'
const ORANGE = '#f59e0b'
const TEXT   = '#f0f4ff'
const TEXT2  = '#8899bb'
const TEXT3  = '#4e5f82'
const BG3    = '#111d34'

// ── Types ─────────────────────────────────────────────────────────────────────
type EtatMachine = 'Operationnel' | 'En maintenance' | 'A surveiller' | 'Hors service'
type TypeMaint   = 'Preventive' | 'Corrective' | 'Inspection' | 'Remplacement piece'

interface Machine {
  id: string
  nom: string
  reference: string
  etat: EtatMachine
  heuresUtilisation: number
  prochaineMaint: string
  derniereRevision: string
  piecesCritiques: string[]
}

interface Intervention {
  id: string
  machineId: string
  machineNom: string
  type: TypeMaint
  date: string
  technicien: string
  description: string
  cout: number
  dureeHeures: number
  statut: 'Terminee' | 'En cours' | 'Planifiee'
  pieces?: string[]
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MACHINES: Machine[] = [
  {
    id: 'M1', nom: 'Moulin a marteaux N°1', reference: 'MM-BF-001',
    etat: 'Operationnel', heuresUtilisation: 2840, prochaineMaint: '2026-08-20',
    derniereRevision: '2026-06-15',
    piecesCritiques: ['Marteaux (usure 65%)', 'Grille de tamisage', 'Roulement principal'],
  },
  {
    id: 'M2', nom: 'Moulin a marteaux N°2', reference: 'MM-BF-002',
    etat: 'A surveiller', heuresUtilisation: 3420, prochaineMaint: '2026-08-12',
    derniereRevision: '2026-05-20',
    piecesCritiques: ['Courroie de transmission (critique)', 'Marteaux (usure 80%)', 'Filtre a air'],
  },
  {
    id: 'M3', nom: 'Decortiqueuse riz', reference: 'DEC-BF-001',
    etat: 'Operationnel', heuresUtilisation: 1650, prochaineMaint: '2026-09-01',
    derniereRevision: '2026-07-10',
    piecesCritiques: ['Rouleaux decorticage', 'Ventilateur separateur'],
  },
  {
    id: 'M4', nom: 'Groupe electrogene 50KVA', reference: 'GE-BF-001',
    etat: 'En maintenance', heuresUtilisation: 4100, prochaineMaint: '2026-08-09',
    derniereRevision: '2026-08-08',
    piecesCritiques: ['Filtre huile (change)', 'Filtre gasoil (change)', 'Courroie alternateur'],
  },
  {
    id: 'M5', nom: 'Balance electronique 500kg', reference: 'BAL-BF-001',
    etat: 'Operationnel', heuresUtilisation: 0, prochaineMaint: '2026-12-01',
    derniereRevision: '2026-04-01',
    piecesCritiques: ['Cellules de charge — calibrage annuel'],
  },
]

const INTERVENTIONS: Intervention[] = [
  {
    id: 'I1', machineId: 'M4', machineNom: 'Groupe electrogene 50KVA',
    type: 'Preventive', date: '2026-08-08', technicien: 'Souleymane Kinda',
    description: 'Vidange huile moteur + remplacement filtres huile et gasoil. Verification niveau electrolyte batterie.',
    cout: 85_000, dureeHeures: 4, statut: 'En cours',
    pieces: ['Huile moteur 15W40 (5L)', 'Filtre a huile', 'Filtre gasoil'],
  },
  {
    id: 'I2', machineId: 'M2', machineNom: 'Moulin a marteaux N°2',
    type: 'Remplacement piece', date: '2026-08-12', technicien: 'Souleymane Kinda',
    description: 'Remplacement courroie de transmission et marteaux (usure 80%). Reglage tension courroie.',
    cout: 145_000, dureeHeures: 6, statut: 'Planifiee',
    pieces: ['Jeu de marteaux 12 pieces', 'Courroie B-94', 'Roulements 6205'],
  },
  {
    id: 'I3', machineId: 'M1', machineNom: 'Moulin a marteaux N°1',
    type: 'Inspection', date: '2026-06-15', technicien: 'Ibrahim Sawadogo',
    description: 'Inspection generale: usure marteaux 65%, grille OK, roulements a surveiller. RAS sinon.',
    cout: 15_000, dureeHeures: 2, statut: 'Terminee',
  },
  {
    id: 'I4', machineId: 'M3', machineNom: 'Decortiqueuse riz',
    type: 'Preventive', date: '2026-07-10', technicien: 'Ibrahim Sawadogo',
    description: 'Nettoyage complet decortiqueuse, lubrification rouleaux, reglage jeu rouleaux pour riz local.',
    cout: 25_000, dureeHeures: 3, statut: 'Terminee',
  },
  {
    id: 'I5', machineId: 'M1', machineNom: 'Moulin a marteaux N°1',
    type: 'Corrective', date: '2026-04-20', technicien: 'Souleymane Kinda',
    description: 'Remplacement grille de tamisage cassee. Vibrations excessives corrigees apres serrage boulons.',
    cout: 38_000, dureeHeures: 3, statut: 'Terminee',
    pieces: ['Grille de tamisage 3mm'],
  },
  {
    id: 'I6', machineId: 'M2', machineNom: 'Moulin a marteaux N°2',
    type: 'Preventive', date: '2026-05-20', technicien: 'Ibrahim Sawadogo',
    description: 'Revision 500h: lubrification, nettoyage, controle alignement courroies.',
    cout: 42_000, dureeHeures: 5, statut: 'Terminee',
  },
  {
    id: 'I7', machineId: 'M1', machineNom: 'Moulin a marteaux N°1',
    type: 'Preventive', date: '2026-08-20', technicien: 'A definir',
    description: 'Revision programmee 3000h: remplacement marteaux + roulements + nettoyage general.',
    cout: 180_000, dureeHeures: 8, statut: 'Planifiee',
    pieces: ['Jeu de marteaux complet', 'Roulements 6205 x2', 'Joints spi'],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const TODAY = new Date('2026-08-08')

function joursAvant(d: string): number {
  return Math.round((new Date(d).getTime() - TODAY.getTime()) / 86400000)
}

function etatColor(e: EtatMachine) {
  if (e === 'Operationnel')   return GREEN
  if (e === 'A surveiller')   return ORANGE
  if (e === 'En maintenance') return CYAN
  return RED
}

function statutColor(s: Intervention['statut']) {
  if (s === 'Terminee')  return GREEN
  if (s === 'En cours')  return CYAN
  return ORANGE
}

function typeColor(t: TypeMaint) {
  if (t === 'Preventive')         return GOLD
  if (t === 'Corrective')         return RED
  if (t === 'Remplacement piece') return ORANGE
  return TEXT2
}

// ── Composants ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, icon: Icon }:
  { label:string; value:string; sub?:string; color:string; icon:React.ComponentType<{size?:number;color?:string}> }) {
  return (
    <div style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:14, padding:'18px 22px',
      display:'flex', flexDirection:'column' as const, gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:12, color:TEXT2 }}>{label}</span>
        <div style={{ background:`${color}18`, borderRadius:8, padding:8, display:'flex' }}>
          <Icon size={15} color={color} />
        </div>
      </div>
      <div style={{ fontSize:26, fontWeight:700, color:TEXT, fontFamily:'monospace' }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:TEXT3 }}>{sub}</div>}
    </div>
  )
}

function EtatBadge({ etat }: { etat: EtatMachine }) {
  const color = etatColor(etat)
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:`${color}20`,
      color, borderRadius:6, padding:'3px 10px', fontSize:11, fontWeight:700, whiteSpace:'nowrap' as const }}>
      {etat}
    </span>
  )
}

function ModalMachine({ m, onClose }: { m: Machine; onClose: () => void }) {
  const j = joursAvant(m.prochaineMaint)
  const color = j < 0 ? RED : j < 7 ? RED : j < 14 ? ORANGE : GREEN
  const interventionsMachine = INTERVENTIONS.filter(i => i.machineId === m.id)
  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div style={{ position:'relative', background:BG2, border:`1px solid ${BORDER}`, borderRadius:18,
        padding:28, width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto' as const, margin:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:TEXT }}>{m.nom}</div>
            <div style={{ fontSize:12, color:TEXT2, marginTop:2 }}>Ref: {m.reference}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:TEXT3, cursor:'pointer', padding:4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          {[
            ['Etat', <EtatBadge key="e" etat={m.etat} />],
            ['Heures utilisation', `${m.heuresUtilisation.toLocaleString('fr-FR')} h`],
            ['Derniere revision', m.derniereRevision],
            ['Prochaine maint.', <span key="p" style={{ color, fontWeight:700 }}>{m.prochaineMaint} ({j >= 0 ? `J-${j}` : `J+${Math.abs(j)}`})</span>],
          ].map(([k, v], i) => (
            <div key={i} style={{ background:BG3, borderRadius:10, padding:'10px 14px' }}>
              <div style={{ fontSize:10, color:TEXT3, textTransform:'uppercase' as const, letterSpacing:'0.05em', marginBottom:3 }}>{k}</div>
              <div style={{ fontSize:13, color:TEXT, fontWeight:500 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:600, color:TEXT2, marginBottom:8 }}>Pieces critiques a surveiller</div>
          <div style={{ display:'flex', flexDirection:'column' as const, gap:6 }}>
            {m.piecesCritiques.map((p, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:BG3,
                borderRadius:8, padding:'8px 12px', fontSize:12, color: p.includes('critique') || p.includes('80%') ? ORANGE : TEXT }}>
                <Cog size={12} color={p.includes('critique') ? ORANGE : TEXT3} />
                {p}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize:12, fontWeight:600, color:TEXT2, marginBottom:8 }}>Historique interventions</div>
          {interventionsMachine.map(iv => (
            <div key={iv.id} style={{ borderLeft:`2px solid ${statutColor(iv.statut)}`, paddingLeft:12,
              marginBottom:10, opacity: iv.statut === 'Terminee' ? 0.8 : 1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ fontSize:12, fontWeight:600, color:TEXT }}>{iv.type} — {iv.date}</div>
                <span style={{ fontSize:10, color:statutColor(iv.statut), fontWeight:700 }}>{iv.statut}</span>
              </div>
              <div style={{ fontSize:11, color:TEXT2, marginTop:3 }}>{iv.description}</div>
              <div style={{ fontSize:11, color:TEXT3, marginTop:2 }}>
                {iv.cout.toLocaleString('fr-FR')} FCFA · {iv.dureeHeures}h · {iv.technicien}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function MaintenancePage() {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [filterStatut, setFilterStatut] = useState('Toutes')

  // KPIs
  const operationnelles = MACHINES.filter(m => m.etat === 'Operationnel').length
  const enMaint         = MACHINES.filter(m => m.etat === 'En maintenance').length
  const aSurveiller     = MACHINES.filter(m => m.etat === 'A surveiller').length
  const coutMois        = INTERVENTIONS.filter(i => i.date.startsWith('2026-08')).reduce((s, i) => s + i.cout, 0)

  // Alerte machines urgentes
  const urgentes = MACHINES.filter(m => {
    const j = joursAvant(m.prochaineMaint)
    return j <= 7 && m.etat !== 'En maintenance'
  })

  // Chart cout par mois
  const chartData = useMemo(() => {
    const map: Record<string, number> = {}
    INTERVENTIONS.filter(i => i.statut !== 'Planifiee').forEach(i => {
      const mois = i.date.slice(0, 7)
      map[mois] = (map[mois] || 0) + i.cout
    })
    return Object.entries(map).sort().map(([m, cout]) => ({
      mois: new Date(m + '-01').toLocaleDateString('fr-FR', { month: 'short' }),
      cout,
    }))
  }, [])

  const filteredInterventions = useMemo(() =>
    filterStatut === 'Toutes'
      ? INTERVENTIONS
      : INTERVENTIONS.filter(i => i.statut === filterStatut),
  [filterStatut])

  const th: React.CSSProperties = { padding:'10px 14px', textAlign:'left', fontSize:11, color:TEXT3,
    fontWeight:600, borderBottom:`1px solid ${BORDER}`, background:BG3 }
  const td: React.CSSProperties = { padding:'11px 14px', fontSize:12, color:TEXT,
    borderBottom:`1px solid ${BORDER}`, verticalAlign:'middle' }
  const fBtn = (active: boolean): React.CSSProperties => ({
    background: active ? `${GOLD}20` : 'transparent', color: active ? GOLD : TEXT2,
    border: `1px solid ${active ? GOLD : BORDER}`, borderRadius:7,
    padding:'4px 12px', fontSize:11, cursor:'pointer', fontWeight: active ? 700 : 400,
  })

  return (
    <div style={{ color:TEXT, display:'flex', flexDirection:'column' as const, gap:22 }}>
      <Toaster position="bottom-right" richColors />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:TEXT, margin:0 }}>Maintenance & Machines</h1>
          <p style={{ fontSize:13, color:TEXT2, margin:'4px 0 0' }}>
            Suivi preventif · Moulin Cereales FORGE Afrika
          </p>
        </div>
        <button onClick={() => toast.success('Planifier une intervention — bientot disponible')}
          style={{ display:'flex', alignItems:'center', gap:7, background:GOLD, color:NAVY,
            border:'none', borderRadius:10, padding:'9px 16px', fontWeight:700, fontSize:13, cursor:'pointer' }}>
          <Plus size={14} /> Planifier intervention
        </button>
      </div>

      {/* Alerte urgente */}
      {urgentes.length > 0 && (
        <div style={{ background:`${RED}10`, border:`1px solid ${RED}30`, borderRadius:12,
          padding:'12px 18px', display:'flex', alignItems:'center', gap:10 }}>
          <AlertTriangle size={18} color={RED} />
          <span style={{ fontSize:13, color:RED, fontWeight:600 }}>
            {urgentes.length} machine{urgentes.length > 1 ? 's' : ''} avec maintenance due sous 7 jours : {urgentes.map(m => m.nom).join(', ')}
          </span>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:14 }}>
        <KpiCard label="Operationnelles"  value={`${operationnelles}/${MACHINES.length}`} sub="machines en service"       color={GREEN}  icon={CheckCircle}    />
        <KpiCard label="En maintenance"   value={String(enMaint)}                          sub="arretees pour entretien"  color={CYAN}   icon={Wrench}         />
        <KpiCard label="A surveiller"     value={String(aSurveiller)}                      sub="attention requise"        color={ORANGE} icon={AlertTriangle}  />
        <KpiCard label="Cout maintenance" value={`${coutMois.toLocaleString('fr-FR')} F`} sub="FCFA ce mois (aout 2026)" color={GOLD}   icon={Calendar}       />
      </div>

      {/* Etat des machines */}
      <div style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:14, padding:24 }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:TEXT, margin:'0 0 16px' }}>Etat du parc machines</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:12 }}>
          {MACHINES.map(m => {
            const j = joursAvant(m.prochaineMaint)
            const urgence = j <= 7
            return (
              <div key={m.id}
                onClick={() => setSelectedMachine(m)}
                style={{ background:BG3, border:`1px solid ${urgence ? ORANGE : BORDER}`,
                  borderRadius:12, padding:16, cursor:'pointer',
                  transition:'border-color 0.15s',
                  boxShadow: urgence ? `0 0 0 1px ${ORANGE}40` : 'none' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:TEXT }}>{m.nom}</div>
                    <div style={{ fontSize:11, color:TEXT3, marginTop:2 }}>{m.reference}</div>
                  </div>
                  <EtatBadge etat={m.etat} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:TEXT3 }}>
                  <span>{m.heuresUtilisation.toLocaleString('fr-FR')} h d&apos;utilisation</span>
                  <span style={{ color: j <= 0 ? RED : j <= 7 ? RED : j <= 14 ? ORANGE : GREEN, fontWeight:600 }}>
                    {j >= 0 ? `Maint. J-${j}` : `En retard J+${Math.abs(j)}`}
                  </span>
                </div>
                <div style={{ marginTop:8, height:4, background:`${BORDER}`, borderRadius:4, overflow:'hidden' }}>
                  <div style={{ width:`${Math.min(100, (m.heuresUtilisation / 5000) * 100)}%`,
                    height:'100%', background: m.heuresUtilisation > 4000 ? RED : m.heuresUtilisation > 3000 ? ORANGE : GREEN,
                    borderRadius:4 }} />
                </div>
                <div style={{ fontSize:10, color:TEXT3, marginTop:4 }}>
                  Usure cycle : {Math.round((m.heuresUtilisation / 5000) * 100)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* BarChart cout mensuel */}
      <div style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:14, padding:24 }}>
        <h3 style={{ fontSize:13, fontWeight:600, color:TEXT, margin:'0 0 14px' }}>Cout de maintenance mensuel (FCFA)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={36} margin={{ top:0, right:0, bottom:0, left:-10 }}>
            <XAxis dataKey="mois" tick={{ fontSize:11, fill:TEXT3 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:10, fill:TEXT3 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `${((v as number)/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:8, fontSize:12 }}
              cursor={{ fill:'rgba(255,255,255,0.04)' }}
              formatter={(v) => [`${(v as number).toLocaleString('fr-FR')} FCFA`, 'Maintenance']} />
            <Bar dataKey="cout" radius={[5,5,0,0]}>
              {chartData.map((_, i) => <Cell key={i} fill={i === chartData.length - 1 ? GOLD : CYAN} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau interventions */}
      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, flexWrap:'wrap', gap:8 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:TEXT, margin:0 }}>Journal des interventions</h3>
          <div style={{ display:'flex', gap:6 }}>
            {['Toutes', 'Planifiee', 'En cours', 'Terminee'].map(s => (
              <button key={s} onClick={() => setFilterStatut(s)} style={fBtn(filterStatut === s)}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:14, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Machine', 'Type', 'Date', 'Technicien', 'Cout FCFA', 'Duree', 'Statut'].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredInterventions.map((iv, i) => (
                  <tr key={iv.id} style={{ background: i % 2 === 1 ? `${BG3}60` : 'transparent' }}>
                    <td style={td}>
                      <div style={{ fontWeight:600, fontSize:12 }}>{iv.machineNom}</div>
                    </td>
                    <td style={td}>
                      <span style={{ background:`${typeColor(iv.type)}18`, color:typeColor(iv.type),
                        borderRadius:5, padding:'2px 8px', fontSize:11, fontWeight:600 }}>
                        {iv.type}
                      </span>
                    </td>
                    <td style={{ ...td, color:TEXT2 }}>{iv.date}</td>
                    <td style={{ ...td, color:TEXT2 }}>{iv.technicien}</td>
                    <td style={{ ...td, fontFamily:'monospace', color:GOLD, fontWeight:600 }}>
                      {iv.cout.toLocaleString('fr-FR')}
                    </td>
                    <td style={{ ...td, color:TEXT3 }}>{iv.dureeHeures}h</td>
                    <td style={td}>
                      <span style={{ background:`${statutColor(iv.statut)}20`, color:statutColor(iv.statut),
                        borderRadius:6, padding:'3px 9px', fontSize:11, fontWeight:700, whiteSpace:'nowrap' as const }}>
                        {iv.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:'10px 16px', borderTop:`1px solid ${BORDER}`, fontSize:11, color:TEXT3,
            display:'flex', justifyContent:'space-between' }}>
            <span>{filteredInterventions.length} intervention{filteredInterventions.length !== 1 ? 's' : ''}</span>
            <span style={{ color:GOLD, fontFamily:'monospace', fontWeight:600 }}>
              Total planifie : {INTERVENTIONS.filter(i => i.statut === 'Planifiee').reduce((s,i) => s+i.cout,0).toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>
      </div>

      {selectedMachine && <ModalMachine m={selectedMachine} onClose={() => setSelectedMachine(null)} />}
    </div>
  )
}
