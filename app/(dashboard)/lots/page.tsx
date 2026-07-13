import LotsClient from './LotsClient'

const MOCK_LOTS = [
  {
    id: 'L001',
    reference: 'LOT-2026-001',
    matierePremiere: 'Blé tendre',
    fournisseur: 'Coopérative Koudougou',
    quantiteEntree: 5000,
    qualite: 'Grade A',
    produitFini: 'Farine T55',
    quantiteSortie: 3420,
    rendement: 68.4,
    dateDebut: '2026-07-12',
    statut: 'En cours',
  },
  {
    id: 'L002',
    reference: 'LOT-2026-002',
    matierePremiere: 'Sésame',
    fournisseur: 'AgroTrack BF',
    quantiteEntree: 800,
    qualite: 'Grade A+',
    produitFini: 'Huile sésame brute',
    quantiteSortie: 312,
    rendement: 39.0,
    dateDebut: '2026-07-12',
    statut: 'En cours',
  },
  {
    id: 'L003',
    reference: 'LOT-2026-003',
    matierePremiere: 'Maïs',
    fournisseur: 'Marché central Ouaga',
    quantiteEntree: 3000,
    qualite: 'Grade B',
    produitFini: 'Farine de maïs',
    quantiteSortie: 2680,
    rendement: 89.3,
    dateDebut: '2026-07-11',
    statut: 'Terminé',
  },
  {
    id: 'L004',
    reference: 'LOT-2026-004',
    matierePremiere: 'Karité',
    fournisseur: 'Coopérative Dédougou',
    quantiteEntree: 1200,
    qualite: 'Grade A',
    produitFini: 'Beurre de karité',
    quantiteSortie: 0,
    rendement: 0,
    dateDebut: '2026-07-13',
    statut: 'Planifié',
  },
]

export default function LotsPage() {
  return <LotsClient lots={MOCK_LOTS} />
}
