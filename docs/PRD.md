# PRD — MillTrack

## Vision

MillTrack est le système de gestion de production de référence pour les usines de transformation agroalimentaire en Afrique de l'Ouest. Il transforme des processus papier en données exploitables, permettant aux gérants d'usine de prendre des décisions basées sur les faits : rendements réels, coûts de production, alertes pannes.

## Utilisateurs cibles

| Persona | Rôle | Besoin principal |
|---------|------|-----------------|
| Gérant d'usine | Admin | Vue globale production + rentabilité |
| Chef de production | Opérateur | Saisie lots, suivi machines |
| Technicien maintenance | Opérateur | Suivi pannes, maintenance préventive |
| Comptable | Lecteur | Rapports coûts et rendements |

## Problèmes validés

1. **Traçabilité zéro** — les lots ne sont pas suivis de la réception à l'expédition
2. **Rendements inconnus** — impossibilité de calculer le taux de transformation réel
3. **Pannes non anticipées** — maintenance curative uniquement, pas préventive
4. **Zéro données pour export** — pas de certificats de qualité traçables

## Phase 1 — MVP (priorités)

### Fonctionnalités incluses

- [ ] Authentification (email/password via Supabase Auth)
- [ ] Création et gestion des lots (réception matière première)
- [ ] Enregistrement des cycles de production (lot → produit fini)
- [ ] Calcul automatique du rendement de transformation
- [ ] Dashboard principal : résumé production du jour/semaine/mois
- [ ] Liste des lots avec statuts (En attente / En cours / Terminé)

### Fonctionnalités exclues de la Phase 1

- Suivi machines et alertes pannes (Phase 2)
- Recharts analytics avancés (Phase 3)
- Module certifications export (Phase 4)
- Intégration ValueChain Connect (Phase 4)

## Stack technique

- **Frontend** : Next.js 15 App Router + TypeScript strict + Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Realtime + Auth)
- **UI** : shadcn/ui + Framer Motion + Recharts
- **Deploy** : Vercel
- **Emails** : Resend

## Modèle de données (Phase 1)

```
lots
  id, usine_id, reference, matiere_premiere, quantite_kg, date_reception, statut

cycles_production
  id, lot_id, date_debut, date_fin, quantite_produit_fini_kg, rendement_pct, notes

usines
  id, nom, type (minoterie | huilerie), ville, pays, owner_id
```

## Métriques de succès Phase 1

- 3 usines pilotes Burkina Faso onboardées
- 50 lots créés dans le système
- Rendement moyen calculé automatiquement sur 30 jours
- NPS > 7 auprès des chefs de production
