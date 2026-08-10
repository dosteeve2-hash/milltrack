'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wrench, AlertTriangle, CheckCircle2, XCircle, Clock, Zap, Search, Activity } from 'lucide-react'

interface Machine {
  id: string; nom: string; type: string; capacite: string; statut: string
  derniereMaintenance: string; prochaineMaintenance: string
  heuresTotal: number; alertes: number; rendement: number; utilisation: number
}

const STATUT_CFG: Record<string, { color: string; bg: string; icon: typeof CheckCircle2; label: string }> = {
  'Operationnel': { color: '#4ade80', bg: 'rgba(74,222,128,0.15)',   icon: CheckCircle2, label: 'Operationnel' },
  'En panne':     { color: '#f87171', bg: 'rgba(248,113,113,0.15)',  icon: XCircle,      label: 'En panne'     },
  'Maintenance':  { color: '#fb923c', bg: 'rgba(251,146,60,0.15)',   icon: Wrench,       label: 'Maintenance'  },
}

const TYPE_COLOR: Record<string, string> = {
  'Minoterie': '#D4AF37', 'Huilerie': '#00BCD4', 'Sesame': '#a78bfa', 'Sechage': '#4ade80',
}

const STATUTS_FILTER = ['Tous', 'Operationnel', 'En panne', 'Maintenance']

function MaintenanceBar({ derniere, prochaine }: { derniere: string; prochaine: string }) {
  const start = new Date(derniere).getTime()
  const endRaw = prochaine.split(' ')[0]
  const end = new Date(endRaw).getTime()
  const now = new Date('2026-08-10').getTime()
  const total = end - start
  const elapsed = now - start
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100))
  const danger = pct > 90

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#8899bb', marginBottom: 4 }}>
        <span>Derniere: {derniere}</span>
        <span style={{ color: danger ? '#f87171' : '#8899bb' }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: 5, borderRadius: 3, width: `${pct}%`, backgroundColor: danger ? '#f87171' : pct > 60 ? '#fb923c' : '#4ade80', transition: 'width 0.5s' }} />
      </div>
      <p style={{ fontSize: '0.68rem', marginTop: 3, color: danger ? '#f87171' : '#5a6a85' }}>Prochaine: {prochaine}</p>
    </div>
  )
}

export default function MachinesClient({ machines }: { machines: Machine[] }) {
  const [filtre, setFiltre] = useState('Tous')
  const [search, setSearch] = useState('')

  const filtered = machines.filter(m => {
    const matchF = filtre === 'Tous' || m.statut === filtre
    const matchS = m.nom.toLowerCase().includes(search.toLowerCase()) || m.type.toLowerCase().includes(search.toLowerCase())
    return matchF && matchS
  })

  const operationnelles = machines.filter(m => m.statut === 'Operationnel').length
  const enPanne         = machines.filter(m => m.statut === 'En panne').length
  const maintenance     = machines.filter(m => m.statut === 'Maintenance').length
  const tauxDispo       = Math.round((operationnelles / machines.length) * 100)

  return (
    <div style={{ padding: '2rem', color: '#f0f4ff' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wrench style={{ width: 22, height: 22, color: '#D4AF37' }} /> Machines
          </h1>
          <p style={{ color: '#8899bb', fontSize: '0.8rem', margin: 0 }}>{machines.length} machines · {operationnelles} operationnelles · taux dispo {tauxDispo}%</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.6rem 1.1rem', borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', backgroundColor: '#D4AF37', color: '#0A1628', border: 'none', cursor: 'pointer' }}>
          <Wrench style={{ width: 15, height: 15 }} /> Planifier maintenance
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Operationnelles',  value: String(operationnelles),  color: '#4ade80', icon: CheckCircle2  },
          { label: 'En panne',         value: String(enPanne),          color: '#f87171', icon: XCircle       },
          { label: 'En maintenance',   value: String(maintenance),      color: '#fb923c', icon: Wrench        },
          { label: 'Taux dispo',       value: `${tauxDispo}%`,          color: '#00BCD4', icon: Activity      },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#8899bb', fontSize: '0.7rem' }}>{k.label}</span>
              <k.icon style={{ width: 14, height: 14, color: k.color }} />
            </div>
            <p style={{ color: k.color, fontWeight: 800, fontSize: '1.3rem', margin: 0 }}>{k.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filtres + Search */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#8899bb' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom ou type…"
            style={{ paddingLeft: 28, paddingRight: 10, paddingTop: 7, paddingBottom: 7, backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff', fontSize: '0.8rem', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {STATUTS_FILTER.map(s => {
            const cfg = STATUT_CFG[s]
            const isActive = filtre === s
            return (
              <button key={s} onClick={() => setFiltre(s)} style={{
                padding: '0.35rem 0.8rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: '1px solid',
                background: isActive ? (cfg ? cfg.bg : 'rgba(255,255,255,0.08)') : 'transparent',
                borderColor: isActive ? (cfg ? cfg.color : 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.08)',
                color: isActive ? (cfg ? cfg.color : '#f0f4ff') : '#8899bb',
              }}>{s}</button>
            )
          })}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map((m, i) => {
          const cfg = STATUT_CFG[m.statut] ?? STATUT_CFG['Operationnel']
          const Icon = cfg.icon
          const typeColor = TYPE_COLOR[m.type] ?? '#8899bb'
          const borderColor = m.statut === 'En panne' ? 'rgba(248,113,113,0.35)' : m.statut === 'Maintenance' ? 'rgba(251,146,60,0.25)' : 'rgba(255,255,255,0.08)'

          return (
            <motion.div key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.06 } }}
              style={{ padding: '1.25rem', borderRadius: 16, backgroundColor: '#111e35', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
            >
              {/* Top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', margin: '0 0 4px' }}>{m.nom}</h3>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 12, backgroundColor: `${typeColor}20`, color: typeColor }}>{m.type}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, backgroundColor: cfg.bg, color: cfg.color }}>
                    <Icon style={{ width: 12, height: 12 }} />{cfg.label}
                  </div>
                  {m.alertes > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 12, fontSize: '0.68rem', fontWeight: 600, backgroundColor: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
                      <AlertTriangle style={{ width: 11, height: 11 }} /> {m.alertes} alerte{m.alertes > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { icon: Zap, label: 'Capacite', value: m.capacite, color: '#D4AF37' },
                  { icon: Clock, label: 'Heures', value: m.heuresTotal.toLocaleString('fr-FR') + 'h', color: '#00BCD4' },
                  { icon: Activity, label: 'Utilisation', value: m.utilisation + '%', color: m.utilisation >= 70 ? '#4ade80' : '#D4AF37' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '0.6rem', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                      <item.icon style={{ width: 11, height: 11, color: item.color }} />
                      <span style={{ fontSize: '0.6rem', color: '#8899bb' }}>{item.label}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, margin: 0, color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Maintenance bar */}
              <MaintenanceBar derniere={m.derniereMaintenance} prochaine={m.prochaineMaintenance} />

              {/* Rendement if available */}
              {m.rendement > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#8899bb' }}>Rendement process</span>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: m.rendement >= 70 ? '#4ade80' : m.rendement >= 50 ? '#D4AF37' : '#f97316' }}>{m.rendement}%</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#8899bb' }}>Aucune machine trouvee</div>
      )}
    </div>
  )
}
