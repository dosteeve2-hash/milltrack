'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Clock, Wrench } from 'lucide-react'

interface Machine {
  id: string
  nom: string
  type: string
  prochaineMaintenance: string
}

const TODAY = new Date('2026-08-01')

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getStatut(dateStr: string): 'ok' | 'avertissement' | 'critique' {
  const diff = (new Date(dateStr).getTime() - TODAY.getTime()) / 86_400_000
  if (diff < 0) return 'critique'
  if (diff <= 7) return 'avertissement'
  return 'ok'
}

const STATUT_CFG = {
  ok: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', icon: CheckCircle2, label: 'OK' },
  avertissement: { color: '#fb923c', bg: 'rgba(251,146,60,0.12)', icon: Clock, label: 'Bientôt' },
  critique: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: AlertTriangle, label: 'Dépassé' },
} as const

const MACHINES_INIT: Machine[] = [
  { id: 'm1', nom: 'Moulin A',          type: 'Minoterie', prochaineMaintenance: '2026-07-25' },
  { id: 'm2', nom: 'Moulin B',          type: 'Minoterie', prochaineMaintenance: '2026-08-04' },
  { id: 'm3', nom: 'Presse 1',          type: 'Huilerie',  prochaineMaintenance: '2026-09-10' },
  { id: 'm4', nom: 'Décortiqueuse',     type: 'Minoterie', prochaineMaintenance: '2026-08-07' },
  { id: 'm5', nom: 'Ventilateur Ind.', type: 'Général',   prochaineMaintenance: '2026-10-20' },
]

export default function AlertesMaintenance() {
  const [machines, setMachines] = useState(MACHINES_INIT)

  const marquerRevise = (id: string) => {
    const prochaine = new Date(TODAY)
    prochaine.setMonth(prochaine.getMonth() + 3)
    setMachines(prev =>
      prev.map(m =>
        m.id === id ? { ...m, prochaineMaintenance: prochaine.toISOString().slice(0, 10) } : m,
      ),
    )
  }

  const critiques      = machines.filter(m => getStatut(m.prochaineMaintenance) === 'critique').length
  const avertissements = machines.filter(m => getStatut(m.prochaineMaintenance) === 'avertissement').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      style={{
        backgroundColor: '#111e35',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench style={{ width: 16, height: 16, color: '#D4AF37' }} />
            Alertes Maintenance
          </h2>
          <p style={{ color: '#8899bb', fontSize: '0.75rem', marginTop: '0.25rem', marginBottom: 0 }}>
            {critiques > 0 && (
              <span style={{ color: '#f87171' }}>{critiques} dépassé{critiques > 1 ? 's' : ''} · </span>
            )}
            {avertissements > 0 && (
              <span style={{ color: '#fb923c' }}>{avertissements} à venir · </span>
            )}
            {machines.length} machines
          </p>
        </div>
      </div>

      {/* Liste machines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {machines.map((m, i) => {
          const statut = getStatut(m.prochaineMaintenance)
          const cfg    = STATUT_CFG[statut]
          const Icon   = cfg.icon
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.7rem 1rem',
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${statut !== 'ok' ? cfg.color + '33' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  backgroundColor: cfg.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon style={{ width: 17, height: 17, color: cfg.color }} />
                </div>
                <div>
                  <p style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>{m.nom}</p>
                  <p style={{ color: '#8899bb', fontSize: '0.7rem', margin: '0.15rem 0 0' }}>
                    {m.type} · Prochaine : {formatDate(m.prochaineMaintenance)}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                <span style={{
                  padding: '0.2rem 0.6rem', borderRadius: 99,
                  fontSize: '0.68rem', fontWeight: 700,
                  backgroundColor: cfg.bg, color: cfg.color,
                }}>
                  {cfg.label}
                </span>
                {statut !== 'ok' && (
                  <button
                    onClick={() => marquerRevise(m.id)}
                    style={{
                      padding: '0.3rem 0.7rem', borderRadius: 8,
                      fontSize: '0.7rem', fontWeight: 700,
                      backgroundColor: 'rgba(212,175,55,0.15)',
                      color: '#D4AF37',
                      border: '1px solid rgba(212,175,55,0.3)',
                      cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                  >
                    ✓ Marquer révisé
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
