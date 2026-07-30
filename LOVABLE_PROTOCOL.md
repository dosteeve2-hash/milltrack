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

## Stack Technique
- **Frontend** : Next.js 16 (App Router), React 19, TypeScript
- **Styles** : Tailwind CSS v4, tw-animate-css
- **Animations** : Framer Motion v12
- **Backend** : Supabase (PostgreSQL, Auth, Realtime)
- **Composants** : shadcn/ui + Base UI
- **Charts** : Recharts (rendements, tendances)
- **Tests** : Vitest + Testing Library
- **Monitoring** : Sentry
- **Déploiement** : Vercel

## Modèle de données

### Table `production_lots`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| raw_material | text | blé / maïs / sésame / karité / arachide |
| supplier_id | uuid | FK suppliers |
| input_weight_kg | numeric | Poids entrée (kg) |
| output_weight_kg | numeric | Poids sortie produit fini (kg) |
| yield_pct | numeric | Rendement % (calculé) |
| started_at | timestamp | Début production |
| completed_at | timestamp | Fin production |
| quality_grade | text | A / B / C |

### Table `machines`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| name | text | Nom machine |
| type | text | broyeur / presse / ensacheuse |
| status | enum | operationnel / maintenance / panne |
| last_maintenance | date | Dernière maintenance |
| next_maintenance | date | Prochaine maintenance prévue |

### Table `maintenance_logs`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| machine_id | uuid | FK machines |
| type | enum | preventive / corrective / urgence |
| description | text | Description intervention |
| cost_fcfa | numeric | Coût FCFA |
| technician | text | Technicien responsable |
| performed_at | timestamp | Date intervention |

## Flux utilisateur clé — Traitement d'un lot de sésame

1. Réception fournisseur → Lassana crée lot : 2 tonnes sésame grade A, fournisseur coopérative Kaya
2. Lancement production → démarre timer process, assigne opérateur
3. Fin process → saisit poids sortie : 1,72 tonnes huile → rendement calculé : 86%
4. Rapport lot généré → anomalie si rendement < 80% (alerte dashboard)
5. Produit fini ajouté en stock → disponible pour vente ValueChain Connect
6. Mariam consulte analytics rendements → comparaison avec lots précédents via Recharts

## Critères de succès
- Dashboard rendements charge en < 2 secondes (Supabase Realtime)
- Calcul rendement automatique à la saisie du poids sortie
- Alertes maintenance préventive envoyées J-7 avant échéance
- Rapports PDF/Excel générés en < 5 secondes
- Zéro erreur `npm run build`
- Compatible tablette Android (interface terrain techniciens)

---
*Lovable Protocol v1.0 — FORGE Afrika © 2025 — Steeve Donald Compaore*
