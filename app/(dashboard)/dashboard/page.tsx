import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  // TODO: replace with real Supabase getUser() call
  // const supabase = await createClient()
  // const { data: { user } } = await supabase.auth.getUser()

  const MOCK_STATS = {
    lotsEnCours: 8,
    productionJour: 24.6,
    rendementMoyen: 68.4,
    machinesActives: 5,
    machinesEnPanne: 1,
    alertes: 2,
  }

  const MOCK_LOTS_ACTIFS = [
    {
      id: 'L001',
      matiere: 'Blé tendre',
      quantiteEntree: 5000,
      produit: 'Farine T55',
      quantiteSortie: 3420,
      rendement: 68.4,
      debut: '2026-07-12 06:00',
      statut: 'En cours',
      machine: 'Moulin A',
    },
    {
      id: 'L002',
      matiere: 'Sésame',
      quantiteEntree: 800,
      produit: 'Huile sésame',
      quantiteSortie: 312,
      rendement: 39.0,
      debut: '2026-07-12 08:30',
      statut: 'En cours',
      machine: 'Presse 1',
    },
    {
      id: 'L003',
      matiere: 'Maïs',
      quantiteEntree: 3000,
      produit: 'Farine maïs',
      quantiteSortie: 2680,
      rendement: 89.3,
      debut: '2026-07-11 14:00',
      statut: 'Terminé',
      machine: 'Moulin B',
    },
  ]

  return <DashboardClient stats={MOCK_STATS} lotsActifs={MOCK_LOTS_ACTIFS} />
}
