'use client'

import { motion } from 'framer-motion'
import { Crown, Package2 } from 'lucide-react'

interface TopClient {
  rang: number
  nom: string
  type: string
  volume: number   // kg ce mois
  ca: number
}

const TOP_CLIENTS: TopClient[] = [
  { rang: 1, nom: 'Djibril Compaoré',              type: 'Revendeur',   volume: 2200, ca: 1_540_000 },
  { rang: 2, nom: 'Boulangerie Moderne du Centre',  type: 'Boulangerie', volume: 1300, ca:   910_000 },
  { rang: 3, nom: 'Boulangerie La Mie Dorée',       type: 'Boulangerie', volume: 1100, ca:   770_000 },
]

const BADGE_CFG = [
  { color: '#D4AF37', bg: 'rgba(212,175,55,0.18)', label: '🥇' },
  { color: '#a1a1aa', bg: 'rgba(161,161,170,0.15)', label: '🥈' },
  { color: '#b87333', bg: 'rgba(184,115,51,0.15)', label: '🥉' },
]

export default function TopClients() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
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
        <Crown style={{ width: 15, height: 15, color: '#D4AF37' }} />
        Top clients du mois
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {TOP_CLIENTS.map((client, i) => {
          const cfg = BADGE_CFG[i]
          return (
            <motion.div
              key={client.nom}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.875rem', borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${cfg.color}22`,
              }}
            >
              {/* Rang badge */}
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                backgroundColor: cfg.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}>
                {cfg.label}
              </div>

              {/* Infos */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  color: '#f0f4ff', fontSize: '0.8rem', fontWeight: 600, margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {client.nom}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                  <Package2 style={{ width: 10, height: 10, color: '#8899bb' }} />
                  <p style={{ color: '#8899bb', fontSize: '0.68rem', margin: 0 }}>
                    {client.volume.toLocaleString('fr-FR')} kg · {client.type}
                  </p>
                </div>
              </div>

              {/* CA */}
              <p style={{ color: cfg.color, fontWeight: 800, fontSize: '0.8rem', margin: 0, whiteSpace: 'nowrap' }}>
                {(client.ca / 1_000_000).toFixed(2)}M F
              </p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
