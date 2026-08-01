'use client'

import { motion } from 'framer-motion'
import { CalendarClock, User, Wrench } from 'lucide-react'

interface Revision {
  machine: string
  type: string
  date: string
  technicien: string
  badge: string
}

const REVISIONS: Revision[] = [
  { machine: 'Moulin B',       type: 'Vidange + courroies', date: '2026-08-04', technicien: 'Ouédraogo S.', badge: '#fb923c' },
  { machine: 'Décortiqueuse',  type: 'Inspection générale', date: '2026-08-07', technicien: 'Kaboré M.',    badge: '#D4AF37' },
  { machine: 'Presse 1',       type: 'Remplacement filtres', date: '2026-09-10', technicien: 'Zongo B.',     badge: '#4ade80' },
]

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

function daysUntil(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - new Date('2026-08-01').getTime()) / 86_400_000)
  return diff
}

export default function PlanningMaintenance() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      style={{
        backgroundColor: '#111e35',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '1.25rem',
      }}
    >
      <h3 style={{
        color: '#f0f4ff', fontWeight: 700, fontSize: '0.9rem',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        margin: '0 0 1rem',
      }}>
        <CalendarClock style={{ width: 15, height: 15, color: '#D4AF37' }} />
        Maintenance planifiée
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {REVISIONS.map((rev, i) => {
          const days = daysUntil(rev.date)
          return (
            <motion.div
              key={rev.machine}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.875rem', borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid rgba(255,255,255,0.06)`,
              }}
            >
              {/* Badge date */}
              <div style={{
                minWidth: 38, textAlign: 'center', padding: '0.3rem 0.2rem',
                borderRadius: 8, backgroundColor: `${rev.badge}18`,
              }}>
                <p style={{ color: rev.badge, fontWeight: 800, fontSize: '0.85rem', margin: 0, lineHeight: 1 }}>
                  {formatDate(rev.date).split(' ')[0]}
                </p>
                <p style={{ color: rev.badge, fontSize: '0.6rem', margin: '0.1rem 0 0', opacity: 0.85 }}>
                  {formatDate(rev.date).split(' ')[1]}
                </p>
              </div>

              {/* Infos */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Wrench style={{ width: 11, height: 11, color: '#8899bb', flexShrink: 0 }} />
                  <p style={{ color: '#f0f4ff', fontSize: '0.8rem', fontWeight: 600, margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rev.machine}
                  </p>
                </div>
                <p style={{ color: '#8899bb', fontSize: '0.68rem', margin: '0.15rem 0 0',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {rev.type}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                  <User style={{ width: 10, height: 10, color: '#8899bb' }} />
                  <p style={{ color: '#8899bb', fontSize: '0.65rem', margin: 0 }}>{rev.technicien}</p>
                </div>
              </div>

              {/* J-X */}
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap',
                color: days <= 7 ? '#fb923c' : '#8899bb',
              }}>
                J-{days}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
