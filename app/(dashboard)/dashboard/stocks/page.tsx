'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Archive, AlertTriangle, CheckCircle2, Package } from 'lucide-react'

const MOCK_STOCKS = [
  { type: 'mp', produit: 'Blé tendre', quantite: 18500, unite: 'kg', valeur: 5550000, alerteMin: 5000, statut: 'OK' },
  { type: 'mp', produit: 'Sésame', quantite: 2100, unite: 'kg', valeur: 1050000, alerteMin: 2000, statut: 'Alerte' },
  { type: 'mp', produit: 'Maïs', quantite: 8200, unite: 'kg', valeur: 2460000, alerteMin: 3000, statut: 'OK' },
  { type: 'pf', produit: 'Farine T55', quantite: 12400, unite: 'kg', valeur: 4960000, alerteMin: 0, statut: 'OK' },
  { type: 'pf', produit: 'Huile sésame', quantite: 890, unite: 'litres', valeur: 1246000, alerteMin: 0, statut: 'OK' },
  { type: 'pf', produit: 'Farine maïs', quantite: 3100, unite: 'kg', valeur: 930000, alerteMin: 0, statut: 'OK' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.07 } }),
}

export default function StocksPage() {
  const [tab, setTab] = useState<'mp' | 'pf'>('mp')
  const filtered = MOCK_STOCKS.filter(s => s.type === tab)
  const alertes = MOCK_STOCKS.filter(s => s.statut === 'Alerte').length
  const valeurTotale = MOCK_STOCKS.reduce((sum, s) => sum + s.valeur, 0)

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Archive className="w-6 h-6" style={{ color: '#D4AF37' }} />
            Stocks
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8899bb' }}>Matières premières · Produits finis · Alertes seuil</p>
        </div>
        {alertes > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' }}>
            <AlertTriangle className="w-4 h-4" />
            {alertes} alerte{alertes > 1 ? 's' : ''} stock bas
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Valeur totale stocks', value: `${(valeurTotale / 1000000).toFixed(2)} M FCFA`, icon: Package, color: '#D4AF37' },
          { label: 'Alertes stock bas', value: alertes, icon: AlertTriangle, color: alertes > 0 ? '#f97316' : '#4ade80' },
          { label: 'Références actives', value: MOCK_STOCKS.length, icon: Archive, color: '#00BCD4' },
        ].map((c, i) => (
          <motion.div key={c.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            className="p-5 rounded-2xl" style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: '#8899bb' }}>{c.label}</span>
              <c.icon className="w-4 h-4" style={{ color: c.color }} />
            </div>
            <div className="text-2xl font-bold">{c.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'mp', label: 'Matières premières' },
          { key: 'pf', label: 'Produits finis' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as 'mp' | 'pf')}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: tab === t.key ? '#D4AF37' : 'rgba(255,255,255,0.06)',
              color: tab === t.key ? '#0A1628' : 'rgba(240,244,255,0.6)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Stock cards grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s, i) => {
          const isAlerte = s.statut === 'Alerte'
          const pctRemplissage = s.alerteMin > 0 ? Math.min((s.quantite / (s.alerteMin * 4)) * 100, 100) : 100
          return (
            <motion.div key={s.produit} custom={i} variants={fadeUp} initial="hidden" animate="show"
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: '#111e35',
                border: isAlerte ? '1px solid rgba(249,115,22,0.35)' : '1px solid rgba(255,255,255,0.08)',
              }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{s.produit}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8899bb' }}>
                    {(s.valeur / 1000).toFixed(0)} K FCFA
                  </p>
                </div>
                {isAlerte ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                    <AlertTriangle className="w-3 h-3" />Alerte
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>
                    <CheckCircle2 className="w-3 h-3" />OK
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold mb-1">
                {s.quantite.toLocaleString()}
                <span className="text-sm font-normal ml-1" style={{ color: '#8899bb' }}>{s.unite}</span>
              </div>
              {s.alerteMin > 0 && (
                <>
                  <div className="mt-3 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pctRemplissage}%`, backgroundColor: isAlerte ? '#f97316' : '#4ade80' }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#8899bb' }}>Seuil min : {s.alerteMin.toLocaleString()} {s.unite}</p>
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
