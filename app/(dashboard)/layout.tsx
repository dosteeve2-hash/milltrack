import DashboardNav from '@/components/DashboardNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // `min-h-screen` sur mobile et non `h-screen` : sur Android la barre
    // d'adresse mange une partie de 100vh, et une hauteur figée coupe le bas
    // de la page. Le défilement reste celui du document.
    <div
      className="flex flex-col md:flex-row min-h-screen md:h-screen md:overflow-hidden"
      style={{ backgroundColor: '#0A1628' }}
    >
      <DashboardNav />
      <main className="flex-1 md:overflow-auto">{children}</main>
    </div>
  )
}
