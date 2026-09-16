'use client'

import { motion } from 'framer-motion'
import { Target, TrendingUp, AlertTriangle } from 'lucide-react'

interface Objectif {
  produit: string
  cible: number   // tonnes
  realise: number // tonnes
  unite: string
}

const OBJECTIFS: Objectif[] = [
  { produit: 'Farine Blanche', cible: 15, realise: 12.4, unite: 't' },
  { produit: 'Farine Maïs',   cible: 8,  realise: 7.1,  unite: 't' },
  { produit: 'Son de Blé',    cible: 5,  realise: 2.8,  unite: 't' },
]

function getBarColor(pct: number) {
  if (pct >= 90) return '#4ade80'
  if (pct >= 60) return '#fb923c'
  return '#f87171'
}

function getStatusIcon(pct: number) {
  if (pct >= 90) return TrendingUp
  if (pct >= 60) return Target
  return AlertTriangle
}

export default function ObjectifsProduction() {
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
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{
          color: '#f0f4ff', fontWeight: 700, fontSize: '1rem', margin: 0,
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <Target style={{ width: 16, height: 16, color: '#D4AF37' }} />
          Objectifs de production — Juillet 2026
        </h2>
        <p style={{ color: '#8899bb', fontSize: '0.75rem', marginTop: '0.25rem', marginBottom: 0 }}>
          Suivi mensuel par produit · 3 objectifs actifs
        </p>
      </div>
      {/* Objectifs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {OBJECTIFS.map((obj, i) => {
          const pct      = Math.round((obj.realise / obj.cible) * 100)
          const barColor = getBarColor(pct)
          const delta    = obj.realise - obj.cible
          const StatusIcon = getStatusIcon(pct)

          return (
            <motion.div
              key={obj.produit}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Ligne titre */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StatusIcon style={{ width: 14, height: 14, color: barColor }} />
                  <span style={{ color: '#f0f4ff', fontSize: '0.875rem', fontWeight: 600 }}>{obj.produit}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: barColor, fontSize: '0.875rem', fontWeight: 700 }}>{pct}%</span>
                  <span style={{ color: '#8899bb', fontSize: '0.75rem' }}>
                    {obj.realise}{obj.unite} / {obj.cible}{obj.unite}
                  </span>
                </div>
              </div>
              {/* Barre de progression */}
              <div style={{
                height: 8, borderRadius: 99,
                backgroundColor: 'rgba(255,255,255,0.07)',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(pct, 100)}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                  style={{ height: '100%', borderRadius: 99, backgroundColor: barColor }}
                />
              </div>

              {/* Delta */}
              <div style={{ marginTop: '0.3rem', textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: delta >= 0 ? '#4ade80' : '#f87171' }}>
                  {delta >= 0 ? '+' : ''}{delta.toFixed(1)}{obj.unite} vs objectif
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* KPIs résumé */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem',
        marginTop: '1.25rem', paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        {OBJECTIFS.map(obj => {
          const pct = Math.round((obj.realise / obj.cible) * 100)
          return (
            <div key={obj.produit} style={{
              textAlign: 'center', padding: '0.6rem',
              borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)',
            }}>
              <p style={{ color: '#8899bb', fontSize: '0.65rem', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                {obj.produit.split(' ')[1] || obj.produit.split(' ')[0]}
              </p>
              <p style={{ color: getBarColor(pct), fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{pct}%</p>
              <p style={{ color: '#8899bb', fontSize: '0.65rem', margin: '0.2rem 0 0' }}>atteint</p>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
