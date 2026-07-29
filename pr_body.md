## Sprint 14

### Pages ajoutees
- `/fournisseurs` : Stats, BarChart top 5, liste filtrable, modal ajout fournisseur
- `/parametres` : 3 onglets Profil / Minoterie / Alertes avec animations Framer Motion

### Changements
- `components/SidebarNav.tsx` : liens Fournisseurs + Parametres
- `app/layout.tsx` : preload false sur fonts Google pour build hors-ligne

### Technique
- TypeScript strict 0 any
- Recharts mounted pattern
- Framer Motion spring animations
- Donnees mockees realistes Dedougou, Bobo-Dioulasso, Kaya

Co-authored-by: Claude <claude@anthropic.com>
