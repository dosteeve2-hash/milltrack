'use client'

import { motion } from 'framer-motion'
import { Wrench, AlertTriangle, CheckCircle2, XCircle, Clock, Zap } from 'lucide-react'

interface Machine {
  id: string
  nom: string
  type: string
  capacite: string
  statut: string
  derniereMaintenance: string
  prochaineMaintenance: string
  heuresTotal: number
  alertes: number
}

const STATUT_CFG: Record<string, { color: string; bg: string; icon: typeof CheckCircle2; label: string }> = {
  Opérationnel: { color: '#4ade80', bg: 'rgba(74,222,128,0.15)', icon: CheckCircle2, label: 'Opérationnel' },
  'En panne': { color: '#f87171', bg: 'rgba(248,113,113,0.15)', icon: XCircle, label: 'En panne' },
  Maintenance: { color: '#fb923c', bg: 'rgba(251,146,60,0.15)', icon: Wrench, label: 'Maintenance' },
}

const TYPE_COLOR: Record<string, string> = {
  Minoterie: '#D4AF37',
  Huilerie: '#00BCD4',
  Sésame: '#a78bfa',
}

function MaintenanceBar({ derniere, prochaine }: { derniere: string; prochaine: string }) {
  const start = new Date(derniere).getTime()
  const endRaw = prochaine.split(' ')[0]
  const end = new Date(endRaw).getTime()
  const now = new Date('2026-07-13').getTime()
  const total = end - start
  const elapsed = now - start
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100))
  const danger = pct > 90

  return (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ color: '#8899bb' }}>
        <span>Dernière : {derniere}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-1.5 rounded-full transition-all"
          style={{
            width: `${pct}%`,
            backgroundColor: danger ? '#f87171' : pct > 60 ? '#fb923c' : '#4ade80',
          }}
        />
      </div>
      <p className="text-xs mt-1" style={{ color: danger ? '#f87171' : '#8899bb' }}>
        Prochaine : {prochaine}
      </p>
    </div>
  )
}

export default function MachinesClient({ machines }: { machines: Machine[] }) {
  const operationnelles = machines.filter((m) => m.statut === 'Opérationnel').length
  const enPanne = machines.filter((m) => m.statut === 'En panne').length

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Machines</h1>
          <p className="text-sm mt-1" style={{ color: '#8899bb' }}>
            {operationnelles} opérationnelles · {enPanne} en panne
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
        >
          <Wrench className="w-4 h-4" />
          Planifier maintenance
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {machines.map((m, i) => {
          const cfg = STATUT_CFG[m.statut] ?? STATUT_CFG['Opérationnel']
          const Icon = cfg.icon
          const typeColor = TYPE_COLOR[m.type] ?? '#8899bb'

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.07 },
              }}
              className="p-5 rounded-2xl flex flex-col gap-4"
              style={{
                backgroundColor: '#111e35',
                border: `1px solid ${m.statut === 'En panne' ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{m.nom}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${typeColor}20`, color: typeColor }}>
                    {m.type}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </div>
                  {m.alertes > 0 && (
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: 'rgba(248,113,113,0.15)', color: '#f87171' }}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {m.alertes} alerte{m.alertes > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
                    <span className="text-xs" style={{ color: '#8899bb' }}>Capacité</span>
                  </div>
                  <p className="text-sm font-semibold">{m.capacite}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5" style={{ color: '#00BCD4' }} />
                    <span className="text-xs" style={{ color: '#8899bb' }}>Heures totales</span>
                  </div>
                  <p className="text-sm font-semibold">{m.heuresTotal.toLocaleString()} h</p>
                </div>
              </div>

              {/* Maintenance bar */}
              <MaintenanceBar derniere={m.derniereMaintenance} prochaine={m.prochaineMaintenance} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
