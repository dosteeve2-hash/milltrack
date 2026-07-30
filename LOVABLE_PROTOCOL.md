# MillTrack — Lovable Protocol

## Vision
MillTrack digitalise la chaîne de production des minoteries et huileries africaines. Du lot de matière première reçue au produit fini expédié, chaque étape est tracée, chaque rendement analysé, chaque panne anticipée — donnant aux usiniers burkinabès et ouest-africains les données dont ils ont besoin pour négocier avec les acheteurs et accéder aux certifications export.

## URL de production
https://milltrack.vercel.app

## Utilisateurs cibles
- **Persona 1 — Lassana, Directeur minoterie blé (Bobo-Dioulasso)** : Traite 50 tonnes/semaine. Pertes invisibles faute de suivi. Besoin : tracer chaque lot entrée/sortie, calculer le rendement de mouture, alertes pannes broyeurs.
- **Persona 2 — Mariam, Responsable production huilerie sésame (Ouagadougou)** : Exporte vers l'Italie. Besoin : traçabilité pour certification Bio, rapports qualité par lot, suivi des machines.
- **Persona 3 — Adama, Technicien maintenance (usine karité, Koudougou)** : Suit 12 machines. Besoin : calendrier maintenance préventive, historique pannes, alertes échéances.

## Fonctionnalités core
### P0 (MVP live)
- Réception lots matière première (pesée, qualité, fournisseur, date)
- Suivi process de production (durée, opérateur, paramètres)
- Calcul rendements de transformation (entrée/sortie en %)
- Monitoring machines (statut, maintenance préventive, alertes pannes)
- Inventaire intrants et produits finis
- Rapports analytiques rendements (Recharts) + export PDF/Excel
- Documents qualité pour certification export

### P1 (prochaine itération)
- Auth multi-rôles (Directeur / Opérateur / Technicien maintenance)
- Tableau de bord rendements comparatifs (semaine/mois/année)
- Module maintenance préventive avec calendrier et rappels
- Alertes Supabase Realtime (panne machine, stock critique, rendement anormal)
- Intégration AgroTrack BF (réception lots depuis coopératives partenaires)

### P2 (roadmap)
- Connexion IoT basique (capteurs de poids, température via MQTT)
- Prédiction pannes (Machine Learning simple sur historique maintenance)
- Intégration ValueChain Connect (vente produits finis aux acheteurs B2B)
- Application mobile technicien (saisie maintenance terrain offline)
- Multi-usines (groupe avec plusieurs sites de production)

## Design System
- **Couleurs** : Navy `#0A1628`, Gold `#D4AF37`, Cyan `#00BCD4`
- **Typographie** : Inter / Geist
- **Animations** : Framer Motion v12 (fadeInUp, transitions dashboard)
- **Composants** : shadcn/ui + Base UI
- **Icônes** : Lucide React
- **Charts** : Recharts (rendements, tendances, comparatifs)
- **Monitoring** : Sentry
