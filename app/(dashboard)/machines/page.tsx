import MachinesClient from './MachinesClient'

const MOCK_MACHINES = [
  {
    id: 'M001',
    nom: 'Moulin A',
    type: 'Minoterie',
    capacite: '8 tonnes/h',
    statut: 'Opérationnel',
    derniereMaintenance: '2026-06-15',
    prochaineMaintenance: '2026-08-15',
    heuresTotal: 4820,
    alertes: 0,
  },
  {
    id: 'M002',
    nom: 'Moulin B',
    type: 'Minoterie',
    capacite: '6 tonnes/h',
    statut: 'Opérationnel',
    derniereMaintenance: '2026-05-20',
    prochaineMaintenance: '2026-07-20',
    heuresTotal: 7230,
    alertes: 1,
  },
  {
    id: 'M003',
    nom: 'Presse 1',
    type: 'Huilerie',
    capacite: '2 tonnes/h',
    statut: 'Opérationnel',
    derniereMaintenance: '2026-07-01',
    prochaineMaintenance: '2026-09-01',
    heuresTotal: 2150,
    alertes: 0,
  },
  {
    id: 'M004',
    nom: 'Presse 2',
    type: 'Huilerie',
    capacite: '2 tonnes/h',
    statut: 'En panne',
    derniereMaintenance: '2026-04-10',
    prochaineMaintenance: '2026-07-10 (EN RETARD)',
    heuresTotal: 5670,
    alertes: 2,
  },
  {
    id: 'M005',
    nom: 'Décortiqueuse',
    type: 'Sésame',
    capacite: '1.5 tonnes/h',
    statut: 'Maintenance',
    derniereMaintenance: '2026-07-13',
    prochaineMaintenance: '2026-09-13',
    heuresTotal: 1890,
    alertes: 0,
  },
]

export default function MachinesPage() {
  return <MachinesClient machines={MOCK_MACHINES} />
}
