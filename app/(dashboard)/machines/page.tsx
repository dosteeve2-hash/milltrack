import MachinesClient from './MachinesClient'

export const metadata = { title: 'Machines — MillTrack' }

const MOCK_MACHINES = [
  { id: 'M001', nom: 'Moulin A', type: 'Minoterie', capacite: '8 tonnes/h', statut: 'Operationnel', derniereMaintenance: '2026-06-15', prochaineMaintenance: '2026-08-15', heuresTotal: 4820, alertes: 0, rendement: 71, utilisation: 85 },
  { id: 'M002', nom: 'Moulin B', type: 'Minoterie', capacite: '6 tonnes/h', statut: 'Operationnel', derniereMaintenance: '2026-05-20', prochaineMaintenance: '2026-07-20', heuresTotal: 7230, alertes: 1, rendement: 68, utilisation: 72 },
  { id: 'M003', nom: 'Presse 1', type: 'Huilerie', capacite: '2 tonnes/h', statut: 'Operationnel', derniereMaintenance: '2026-07-01', prochaineMaintenance: '2026-09-01', heuresTotal: 2150, alertes: 0, rendement: 39, utilisation: 60 },
  { id: 'M004', nom: 'Presse 2', type: 'Huilerie', capacite: '2 tonnes/h', statut: 'En panne', derniereMaintenance: '2026-04-10', prochaineMaintenance: '2026-07-10', heuresTotal: 5670, alertes: 2, rendement: 0, utilisation: 0 },
  { id: 'M005', nom: 'Decortiqueuse', type: 'Sesame', capacite: '1.5 tonnes/h', statut: 'Maintenance', derniereMaintenance: '2026-07-13', prochaineMaintenance: '2026-09-13', heuresTotal: 1890, alertes: 0, rendement: 38, utilisation: 0 },
  { id: 'M006', nom: 'Broyeur C', type: 'Minoterie', capacite: '4 tonnes/h', statut: 'Operationnel', derniereMaintenance: '2026-07-05', prochaineMaintenance: '2026-10-05', heuresTotal: 980, alertes: 0, rendement: 74, utilisation: 90 },
  { id: 'M007', nom: 'Sechoir 1', type: 'Sechage', capacite: '3 tonnes/h', statut: 'Operationnel', derniereMaintenance: '2026-06-20', prochaineMaintenance: '2026-08-20', heuresTotal: 3400, alertes: 0, rendement: 95, utilisation: 55 },
]

export default function MachinesPage() {
  return <MachinesClient machines={MOCK_MACHINES} />
}
