'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Factory, TrendingUp, Plus, X, ChevronDown, TriangleAlert } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface MoutureJour {
  id: string
  date: string
  lotBle: string
  poidsEntrant: number
  poidsFarine: number
  son: number
  rendement: number
  operateur: string
}

interface NouvelleEntree {
  date: string
  lot: string
  poidsEntrant: string
  poidsFarine: string
  operateur: string
}

const CHART_DATA = [
  { date: '19/06', ble: 9.8, farine: 7.1 },
  { date: '20/06', ble: 10.5, farine: 7.8 },
  { date: '21/06', ble: 8.7, farine: 6.3 },
  { date: '22/06', ble: 11.2, farine: 8.3 },
  { date: '23/06', ble: 10.0, farine: 7.3 },
  { date: '24/06', ble: 9.5, farine: 6.5 },
  { date: '25/06', ble: 12.0, farine: 8.9 },
  { date: '26/06', ble: 10.8, farine: 7.9 },
  { date: '27/06', ble: 11.5, farine: 8.5 },
  { date: '28/06', ble: 9.2, farine: 6.6 },
  { date: '29/06', ble: 10.3, farine: 7.5 },
  { date: '30/06', ble: 11.0, farine: 8.1 },
  { date: '01/07', ble: 9.6, farine: 7.0 },
  { date: '02/07', ble: 10.7, farine: 7.8 },
  { date: '03/07', ble: 11.3, farine: 8.4 },
  { date: '04/07', ble: 8.8, farine: 6.2 },
  { date: '05/07', ble: 9.9, farine: 7.2 },
  { date: '06/07', ble: 10.4, farine: 7.6 },
  { date: '07/07', ble: 11.8, farine: 8.8 },
  { date: '08/07', ble: 10.1, farine: 7.4 },
  { date: '09/07', ble: 9.7, farine: 6.8 },
  { date: '10/07', ble: 11.4, farine: 8.5 },
  { date: '11/07', ble: 10.8, farine: 7.9 },
  { date: '12/07', ble: 9.5, farine: 6.9 },
  { date: '13/07', ble: 9.5, farine: 6.2 },
  { date: '14/07', ble: 12.0, farine: 8.8 },
  { date: '15/07', ble: 8.6, farine: 6.3 },
  { date: '16/07', ble: 11.5, farine: 7.5 },
  { date: '17/07', ble: 9.8, farine: 6.7 },
  { date: '18/07', ble: 10.2, farine: 7.4 },
]

const MOCK_MOUTURE: MoutureJour[] = [
  { id: '1', date: '2026-07-18', lotBle: 'BLE-2026-047', poidsEntrant: 10200, poidsFarine: 7446, son: 2244, rendement: 73.0, operateur: 'Boureima Sawadogo' },
  { id: '2', date: '2026-07-17', lotBle: 'BLE-2026-046', poidsEntrant: 9800,  poidsFarine: 6664, son: 1836, rendement: 68.0, operateur: 'Adama Kaboré' },
  { id: '3', date: '2026-07-16', lotBle: 'BLE-2026-045', poidsEntrant: 11500, poidsFarine: 7475, son: 2300, rendement: 65.0, operateur: 'Ibrahim Traoré' },
  { id: '4', date: '2026-07-15', lotBle: 'BLE-2026-044', poidsEntrant: 8600,  poidsFarine: 6278, son: 1548, rendement: 73.0, operateur: 'Mariam Ouédraogo' },
  { id: '5', date: '2026-07-14', lotBle: 'BLE-2026-043', poidsEntrant: 12000, poidsFarine: 8160, son: 2400, rendement: 68.0, operateur: 'Boureima Sawadogo' },
  { id: '6', date: '2026-07-13', lotBle: 'BLE-2026-042', poidsEntrant: 9500,  poidsFarine: 6175, son: 1900, rendement: 65.0, operateur: 'Adama Kaboré' },
  { id: '7', date: '2026-07-12', lotBle: 'BLE-2026-041', poidsEntrant: 10800, poidsFarine: 7884, son: 2160, rendement: 73.0, operateur: 'Ibrahim Traoré' },
]

const OPERATEURS = ['Boureima Sawadogo', 'Adama Kaboré', 'Ibrahim Traoré', 'Mariam Ouédraogo']

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.07 },
  }),
}

const inputCls = 'w-full px-3 py-2 rounded-lg text-sm outline-none'
const inputStyle = { backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', color: '#f0f4ff' }
const labelStyle = { color: '#8899bb' }

export default function MouturePage() {
  const [mounted, setMounted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<NouvelleEntree>({
    date: '2026-07-18',
    lot: '',
    poidsEntrant: '',
    poidsFarine: '',
    operateur: OPERATEURS[0],
  })

  useEffect(() => setMounted(true), [])

  const today = MOCK_MOUTURE.find(m => m.date === '2026-07-18') ?? MOCK_MOUTURE[0]
  const bleT = (today.poidsEntrant / 1000).toFixed(1)
  const farineT = (today.poidsFarine / 1000).toFixed(1)
  const sonT = (today.son / 1000).toFixed(1)

  const lowRendement = MOCK_MOUTURE.filter(m => m.rendement < 70).length

  const kpis = [
    { label: "Blé reçu aujourd'hui", value: `${bleT} t`,       color: '#D4AF37' },
    { label: 'Farine produite',       value: `${farineT} t`,    color: '#00BCD4' },
    { label: 'Rendement',             value: `${today.rendement}%`,
      color: today.rendement >= 70 ? '#4ade80' : '#ef4444' },
    { label: 'Son récupéré',          value: `${sonT} t`,       color: '#f97316' },
  ]

  const rendCalc =
    form.poidsEntrant && form.poidsFarine
      ? ((parseFloat(form.poidsFarine) / parseFloat(form.poidsEntrant)) * 100).toFixed(1)
      : null

  function handleSubmit() {
    setShowModal(false)
    setForm({ date: '2026-07-18', lot: '', poidsEntrant: '', poidsFarine: '', operateur: OPERATEURS[0] })
  }

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Factory className="w-6 h-6" style={{ color: '#D4AF37' }} />
            Production Mouture
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8899bb' }}>
            Blé → Farine · Rendements journaliers · Son
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lowRendement > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
              <TriangleAlert className="w-3.5 h-3.5" />
              {lowRendement} jour{lowRendement > 1 ? 's' : ''} sous 70%
            </div>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
          >
            <Plus className="w-4 h-4" />
            Enregistrer production
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="p-5 rounded-2xl"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-xs mb-3" style={{ color: '#8899bb' }}>{k.label}</p>
            <p className="text-3xl font-bold" style={{ color: k.color }}>{k.value}</p>
            <TrendingUp className="w-3.5 h-3.5 mt-2" style={{ color: k.color, opacity: 0.5 }} />
          </motion.div>
        ))}
      </div>

      {/* AreaChart 30 jours */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="p-6 rounded-2xl mb-8"
        style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <h2 className="font-semibold mb-1">Blé entrant vs Farine sortante — 30 derniers jours</h2>
        <p className="text-xs mb-5" style={{ color: '#8899bb' }}>Volumes en tonnes · Du 19/06 au 18/07/2026</p>
        {mounted && (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradFarine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00BCD4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#8899bb', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: '#8899bb', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                unit=" t"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f1f3d',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#f0f4ff',
                }}
                formatter={(v) => [`${v} t`]}
              />
              <Legend wrapperStyle={{ color: '#8899bb', fontSize: 12, paddingTop: 8 }} />
              <Area
                type="monotone"
                dataKey="ble"
                name="Blé entrant"
                stroke="#D4AF37"
                strokeWidth={2}
                fill="url(#gradBle)"
              />
              <Area
                type="monotone"
                dataKey="farine"
                name="Farine sortante"
                stroke="#00BCD4"
                strokeWidth={2}
                fill="url(#gradFarine)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Tableau journalier */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between border-b"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <h2 className="font-semibold">Journal de mouture</h2>
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}
          >
            {MOCK_MOUTURE.length} entrées
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Date', 'Lot blé', 'Entrant (kg)', 'Farine (kg)', 'Son (kg)', 'Rendement', 'Opérateur'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#8899bb' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_MOUTURE.map((m, i) => (
                <motion.tr
                  key={m.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-xs" style={{ color: '#8899bb' }}>{m.date}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#D4AF37' }}>{m.lotBle}</td>
                  <td className="px-4 py-3 font-medium">{m.poidsEntrant.toLocaleString('fr-FR')}</td>
                  <td className="px-4 py-3 font-medium">{m.poidsFarine.toLocaleString('fr-FR')}</td>
                  <td className="px-4 py-3" style={{ color: '#8899bb' }}>{m.son.toLocaleString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    {m.rendement < 70 ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: 'rgba(239,68,68,0.15)',
                          color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.3)',
                        }}
                      >
                        <TriangleAlert className="w-3 h-3" />
                        {m.rendement}%
                      </span>
                    ) : (
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: 'rgba(74,222,128,0.12)', color: '#4ade80' }}
                      >
                        {m.rendement}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8899bb' }}>{m.operateur}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Enregistrer */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="relative w-full max-w-md rounded-2xl p-6 z-10"
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)' }}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } }}
              exit={{ scale: 0.94, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Factory className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  Enregistrer une production
                </h2>
                <button onClick={() => setShowModal(false)} style={{ color: '#8899bb' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium block mb-1" style={labelStyle}>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={labelStyle}>Lot blé</label>
                  <input
                    type="text"
                    value={form.lot}
                    onChange={e => setForm(prev => ({ ...prev, lot: e.target.value }))}
                    placeholder="Ex : BLE-2026-048"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={labelStyle}>Poids entrant (kg)</label>
                  <input
                    type="number"
                    value={form.poidsEntrant}
                    onChange={e => setForm(prev => ({ ...prev, poidsEntrant: e.target.value }))}
                    placeholder="Ex : 10 000"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={labelStyle}>Poids farine obtenu (kg)</label>
                  <input
                    type="number"
                    value={form.poidsFarine}
                    onChange={e => setForm(prev => ({ ...prev, poidsFarine: e.target.value }))}
                    placeholder="Ex : 7 300"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={labelStyle}>Opérateur</label>
                  <select
                    value={form.operateur}
                    onChange={e => setForm(prev => ({ ...prev, operateur: e.target.value }))}
                    className={inputCls}
                    style={inputStyle}
                  >
                    {OPERATEURS.map(op => <option key={op} value={op}>{op}</option>)}
                  </select>
                </div>

                {rendCalc !== null && (
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: parseFloat(rendCalc) >= 70
                        ? 'rgba(74,222,128,0.08)'
                        : 'rgba(239,68,68,0.08)',
                      border: `1px solid ${parseFloat(rendCalc) >= 70
                        ? 'rgba(74,222,128,0.2)'
                        : 'rgba(239,68,68,0.2)'}`,
                    }}
                  >
                    <p
                      className="text-xs font-medium flex items-center gap-1.5"
                      style={{ color: parseFloat(rendCalc) >= 70 ? '#4ade80' : '#ef4444' }}
                    >
                      {parseFloat(rendCalc) < 70 && <TriangleAlert className="w-3.5 h-3.5" />}
                      Rendement calculé : {rendCalc}%
                      {parseFloat(rendCalc) < 70 && ' — en dessous du seuil (70%)'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#8899bb' }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}
                >
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll padding */}
      <div className="h-8" />
    </div>
  )
}
