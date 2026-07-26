# PRD — MillTrack

## Résumé exécutif
MillTrack est un SaaS B2B de suivi de production en temps réel pour les usines de transformation africaines — minoteries (blé, maïs), huileries (sésame, karité, arachide), rizeries et autres unités industrielles. Il digitalise la chaîne de production, de la réception de matière première jusqu'au produit fini, avec traçabilité des lots, monitoring des machines et analyse des rendements. MillTrack fait partie de l'écosystème FORGE Afrika — c'est l'outil qui donne aux usines les données dont elles ont besoin pour exporter et se certifier.

## Motivation originale
> "SaaS B2B pour usines de transformation. Dashboard analytics central."
> — Contexte produit issu de CLAUDE.md

Les minoteries et huileries burkinabèses gèrent leur production sur papier. Pas de traçabilité des lots, pas de suivi des pannes, pas d'analyse des rendements. Résultat : pertes invisibles, qualité inconsistante, zéro données pour négocier avec les acheteurs ou obtenir des certifications export.

## Vision et ambition
MillTrack veut être le "SAP africain allégé" — aussi puissant qu'un ERP pour le suivi industriel, mais pensé pour des PME avec 5 à 50 employés et des équipes non-IT. L'ambition est d'équiper 50% des unités de transformation industrielles du Burkina Faso en Phase 2, et d'étendre à la CEDEAO (Côte d'Ivoire, Sénégal, Ghana, Mali) en Phase 3.

## Problème résolu
1. **Pertes invisibles** — sans suivi lot par lot, impossible de savoir où les matières se perdent dans le process.
2. **Pannes non anticipées** — les machines tombent en panne sans alertes préventives, causant des arrêts coûteux.
3. **Rendements non mesurés** — les dirigeants d'usines ne savent pas si leur ratio matière première → produit fini est dans la norme.
4. **Certification export impossible** — les acheteurs européens et moyen-orientaux exigent une traçabilité que le papier ne peut pas fournir.

## Utilisateurs cibles
- **Directeurs d'usines** — vue globale production, rendements, pannes
- **Agents de production** — saisie des lots, pesées, étapes process
- **Responsables maintenance** — suivi préventif des machines, alertes
- **Acheteurs/exportateurs** — via ValueChain Connect, accèdent aux certificats de traçabilité

## Fonctionnalités clés (MVP)

### Module Lots
- Réception matière première (fournisseur, poids, qualité, photos)
- Numérotation lot automatique
- Traçabilité from-to (intrant → produit fini)

### Module Production
- Suivi des étapes du process (broyage, filtrage, conditionnement...)
- Durée réelle vs durée standard
- Calcul rendement lot par lot

### Module Machines
- Registre des équipements (marque, modèle, date achat)
- Planning maintenance préventive
- Alertes pannes (kilométrage, heures de fonctionnement, cycles)
- Historique des interventions

### Module Stocks
- Inventaire intrants (matière première disponible)
- Inventaire produits finis (par lot, par qualité)
- Alertes seuil minimum

### Rapports & Analytics
- Dashboard Recharts : rendements par lot, par machine, par période
- Comparaison saisons
- Export PDF/Excel pour acheteurs et banques

### Certifications
- Documents qualité générés automatiquement (fiche lot, certificat d'origine)
- Pré-remplis à partir des données de production

## Stack technique
```
Frontend    Next.js 15 (App Router) + TypeScript strict + Tailwind CSS
UI          shadcn/ui + Framer Motion (spring animations)
Auth/DB     Supabase SSR + PostgreSQL + Realtime
Charts      Recharts (pattern `mounted` pour SSR)
Déploiement Vercel
Charte      Navy #0A1628, Gold #D4AF37, Cyan #00BCD4
```

## Intégration écosystème FORGE Afrika
- **AgroTrack BF → MillTrack** : les bons de livraison des coopératives arrivent directement comme réceptions de lots
- **MillTrack → TAAMA** : les usines MillTrack peuvent s'équiper de TAAMA (ERP complet) quand elles grandissent
- **MillTrack → ValueChain Connect** : les produits finis certifiés sont listés automatiquement sur le marketplace B2B
- **MillTrack → CompTrack** : les données financières (coût production, CA) s'exportent vers CompTrack pour la comptabilité
- **MillTrack → FORGE Afrika HQ** : métriques (tonnage transformé, rendements) remontées au dashboard groupe

## Feuille de route
### Phase 1 — Module lots + production
Réception matière première, suivi process, calcul rendement. SaaS B2B, abonnement mensuel.

### Phase 2 — Suivi machines + alertes
Maintenance préventive, historique pannes, alertes automatiques.

### Phase 3 — Analytics rendements + Recharts
Dashboard analytics avancé, benchmarking inter-usines (anonymisé).

### Phase 4 — Certifications + intégration ValueChain
Documents export générés automatiquement, connecteur ValueChain Connect.

## Métriques de succès
- Nombre d'usines actives (cible Phase 1 : 5 usines pilotes)
- Réduction des pertes matière mesurée (cible : -15% pertes vs avant MillTrack)
- Délai moyen de maintenance (cible : pannes non planifiées < 2/mois par usine)
- Nombre de certifications export facilitées par MillTrack
- MRR (cible Phase 1 fin : 500 000 FCFA/mois)

## Contraintes et décisions clés
- **Pub/sub Supabase Realtime, jamais polling** — les alertes machine doivent être instantanées
- **TypeScript strict** — 0 `any` ; la gestion des lots implique des types complexes qui doivent être rigoureusement typés
- **Multi-tenant** — chaque usine est isolée ; RLS Supabase garantit qu'une usine ne voit pas les données d'une autre
- **Interface adaptée aux non-IT** — les agents de production saisissent sur tablette en atelier ; l'UX doit être utilisable avec les mains propres et imprécises
- **`npm run build` 0 erreurs** avant chaque push, sans exception

---
*PRD rédigé par Claude (COO) sur instruction de Steve Donald Compaore (PDG FORGE Afrika)*
*Dernière mise à jour : 2026-07-25*
