'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, User, Factory, Bell, CheckCircle2 } from 'lucide-react'

type Tab = 'profil' | 'minoterie' | 'alertes'

interface ProfilState {
  gerant: string
  minoterie: string
  telephone: string
  email: string
  localisation: string
}

interface MinoterieState {
  capaciteJour: string
  nbMoulins: string
  nbEmployes: string
  heureOuverture: string
  heureFermeture: string
  cereales: Record<string, boolean>
}

interface AlertesState {
  seuilStockKg: string
  seuilCoutFCFA: string
  smsActif: boolean
}

const CEREALES = ['Mil', 'Sorgho', 'Maïs', 'Blé', 'Riz', 'Fonio']

const inputStyle = {
  backgroundColor: '#0A1628',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#f0f4ff',
}

export default function ParametresPage() {
  const [tab, setTab] = useState<Tab>('profil')
  const [toast, setToast] = useState(false)

  const [profil, setProfil] = useState<ProfilState>({
    gerant: 'Oumar Sawadogo',
    minoterie: 'Minoterie du Sahel',
    telephone: '+226 70 12 34 56',
    email: 'contact@minoteriesahel.bf',
    localisation: 'Dédougou, Burkina Faso',
  })

  const [minoterie, setMinoterie] = useState<MinoterieState>({
    capaciteJour: '12',
    nbMoulins: '4',
    nbEmployes: '18',
    heureOuverture: '07:00',
    heureFermeture: '18:00',
    cereales: { Mil: true, Sorgho: true, Maïs: true, Blé: false, Riz: false, Fonio: false },
  })

  const [alertes, setAlertes] = useState<AlertesState>({
    seuilStockKg: '5000',
    seuilCoutFCFA: '200000',
    smsActif: true,
  })

  const handleSave = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profil', label: 'Profil', icon: User },
    { key: 'minoterie', label: 'Minoterie', icon: Factory },
    { key: 'alertes', label: 'Alertes', icon: Bell },
  ]

  return (
    <div className="p-8" style={{ color: '#f0f4ff' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" style={{ color: '#D4AF37' }} />
          Paramètres
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8899bb' }}>
          Profil gérant · Configuration minoterie · Alertes
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-8 p-1 rounded-xl w-fit"
        style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="relative flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ color: tab === t.key ? '#0A1628' : 'rgba(240,244,255,0.55)', zIndex: 1 }}>
            {tab === t.key && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: '#D4AF37', zIndex: -1 }}
                transition={{ type: 'spring' as const, stiffness: 280, damping: 26 }} />
            )}
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 22 } }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
          className="rounded-2xl p-6 max-w-xl"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)' }}>

          {/* ── PROFIL ── */}
          {tab === 'profil' && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold" style={{ color: '#8899bb' }}>Informations gérant</h2>
              {[
                { label: 'Nom du gérant', key: 'gerant' as const, placeholder: 'Nom complet' },
                { label: 'Nom de la minoterie', key: 'minoterie' as const, placeholder: 'Nom officiel' },
                { label: 'Téléphone', key: 'telephone' as const, placeholder: '+226 …' },
                { label: 'Email', key: 'email' as const, placeholder: 'contact@minoterie.bf' },
                { label: 'Localisation', key: 'localisation' as const, placeholder: 'Ville, Burkina Faso' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium block mb-1" style={{ color: '#8899bb' }}>{f.label}</label>
                  <input
                    value={profil[f.key]}
                    onChange={e => setProfil(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── MINOTERIE ── */}
          {tab === 'minoterie' && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold" style={{ color: '#8899bb' }}>Configuration technique</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Capacité (tonnes/jour)', key: 'capaciteJour' as const, unit: 't/j' },
                  { label: 'Nombre de moulins', key: 'nbMoulins' as const, unit: '' },
                  { label: "Nombre d'employés", key: 'nbEmployes' as const, unit: '' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-medium block mb-1" style={{ color: '#8899bb' }}>{f.label}</label>
                    <div className="relative">
                      <input type="number"
                        value={minoterie[f.key]}
                        onChange={e => setMinoterie(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: '#8899bb' }}>Heure ouverture</label>
                  <input type="time" value={minoterie.heureOuverture}
                    onChange={e => setMinoterie(prev => ({ ...prev, heureOuverture: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: '#8899bb' }}>Heure fermeture</label>
                  <input type="time" value={minoterie.heureFermeture}
                    onChange={e => setMinoterie(prev => ({ ...prev, heureFermeture: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium block mb-2" style={{ color: '#8899bb' }}>Céréales traitées</label>
                <div className="grid grid-cols-3 gap-2">
                  {CEREALES.map(c => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="checkbox"
                        checked={minoterie.cereales[c] ?? false}
                        onChange={e => setMinoterie(prev => ({ ...prev, cereales: { ...prev.cereales, [c]: e.target.checked } }))}
                        className="accent-yellow-400 w-4 h-4"
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ALERTES ── */}
          {tab === 'alertes' && (
            <div className="space-y-5">
              <h2 className="text-sm font-semibold" style={{ color: '#8899bb' }}>Seuils & notifications</h2>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#8899bb' }}>
                  Seuil stock minimum (kg) avant alerte
                </label>
                <input type="number"
                  value={alertes.seuilStockKg}
                  onChange={e => setAlertes(prev => ({ ...prev, seuilStockKg: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
                <p className="text-xs mt-1" style={{ color: '#8899bb' }}>
                  Une alerte sera déclenchée quand le stock d&apos;une matière passe sous ce seuil.
                </p>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#8899bb' }}>
                  Seuil coût unitaire (FCFA) avant alerte
                </label>
                <input type="number"
                  value={alertes.seuilCoutFCFA}
                  onChange={e => setAlertes(prev => ({ ...prev, seuilCoutFCFA: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <p className="text-sm font-medium">Alertes SMS</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8899bb' }}>
                    Recevoir les alertes par SMS sur le téléphone du gérant
                  </p>
                </div>
                <button
                  onClick={() => setAlertes(prev => ({ ...prev, smsActif: !prev.smsActif }))}
                  className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ backgroundColor: alertes.smsActif ? '#D4AF37' : 'rgba(255,255,255,0.15)' }}>
                  <motion.div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                    animate={{ left: alertes.smsActif ? '1.5rem' : '0.25rem' }}
                    transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Save button */}
      <div className="mt-6 max-w-xl flex items-center gap-4">
        <button onClick={handleSave}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#D4AF37', color: '#0A1628' }}>
          Sauvegarder
        </button>
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: '#4ade80' }}>
              <CheckCircle2 className="w-4 h-4" />
              Paramètres sauvegardés
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
