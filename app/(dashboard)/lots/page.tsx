import LotsClient from './LotsClient'

export const metadata = { title: 'Lots — MillTrack' }

const MOCK_LOTS = [
  { id: 'L001', reference: 'LOT-2026-001', matierePremiere: 'Ble tendre', fournisseur: 'Cooperative Koudougou', quantiteEntree: 5000, qualite: 'Grade A', produitFini: 'Farine T55', quantiteSortie: 3420, rendement: 68.4, dateDebut: '2026-07-12', dateFin: null, statut: 'En cours', machine: 'Moulin A', cout: 1250000 },
  { id: 'L002', reference: 'LOT-2026-002', matierePremiere: 'Sesame', fournisseur: 'AgroTrack BF', quantiteEntree: 800, qualite: 'Grade A+', produitFini: 'Huile sesame', quantiteSortie: 312, rendement: 39.0, dateDebut: '2026-07-12', dateFin: null, statut: 'En cours', machine: 'Presse 1', cout: 560000 },
  { id: 'L003', reference: 'LOT-2026-003', matierePremiere: 'Mais', fournisseur: 'Marche central Ouaga', quantiteEntree: 3000, qualite: 'Grade B', produitFini: 'Farine de mais', quantiteSortie: 2680, rendement: 89.3, dateDebut: '2026-07-11', dateFin: '2026-07-13', statut: 'Termine', machine: 'Moulin B', cout: 870000 },
  { id: 'L004', reference: 'LOT-2026-004', matierePremiere: 'Karite', fournisseur: 'Cooperative Dedougou', quantiteEntree: 1200, qualite: 'Grade A', produitFini: 'Beurre de karite', quantiteSortie: 0, rendement: 0, dateDebut: '2026-07-13', dateFin: null, statut: 'Planifie', machine: 'Presse 2', cout: 0 },
  { id: 'L005', reference: 'LOT-2026-005', matierePremiere: 'Ble tendre', fournisseur: 'Cooperative Koudougou', quantiteEntree: 4500, qualite: 'Grade A', produitFini: 'Farine T65', quantiteSortie: 3195, rendement: 71.0, dateDebut: '2026-07-08', dateFin: '2026-07-10', statut: 'Termine', machine: 'Moulin A', cout: 1125000 },
  { id: 'L006', reference: 'LOT-2026-006', matierePremiere: 'Sesame', fournisseur: 'ValueChain Connect', quantiteEntree: 600, qualite: 'Grade A+', produitFini: 'Huile sesame brute', quantiteSortie: 228, rendement: 38.0, dateDebut: '2026-07-09', dateFin: '2026-07-11', statut: 'Termine', machine: 'Presse 1', cout: 420000 },
  { id: 'L007', reference: 'LOT-2026-007', matierePremiere: 'Mais', fournisseur: 'Marche Bobo-Dioulasso', quantiteEntree: 2000, qualite: 'Grade A', produitFini: 'Farine de mais', quantiteSortie: 0, rendement: 0, dateDebut: '2026-07-14', dateFin: null, statut: 'Planifie', machine: 'Moulin B', cout: 0 },
  { id: 'L008', reference: 'LOT-2026-008', matierePremiere: 'Ble tendre', fournisseur: 'SONAGESS', quantiteEntree: 10000, qualite: 'Grade A', produitFini: 'Farine T55', quantiteSortie: 7100, rendement: 71.0, dateDebut: '2026-07-01', dateFin: '2026-07-06', statut: 'Termine', machine: 'Moulin A', cout: 2500000 },
]

export default function LotsPage() {
  return <LotsClient lots={MOCK_LOTS} />
}
