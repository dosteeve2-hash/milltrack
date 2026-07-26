# MillTrack — Instructions Claude

## Stack
- Next.js 15 App Router + TypeScript strict (0 `any`)
- Supabase SSR : TOUJOURS `getUser()`, JAMAIS `getSession()`
- Framer Motion : `type: 'spring' as const`
- Charte : Navy #0A1628, Gold #D4AF37, Cyan #00BCD4
- Recharts : pattern `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []); if (!mounted) return null`

## Règles obligatoires
- Pub/sub Supabase Realtime — JAMAIS de polling
- `npm run build` 0 erreurs avant chaque push
- Co-authored-by: Claude <claude@anthropic.com> dans chaque commit

## Contexte produit
SaaS B2B pour usines de transformation. Dashboard analytics central.

## Principes Karpathy

> Andrej Karpathy (ex-Tesla AI / OpenAI) sur comment coder avec l'IA.

### 1. Reflechis avant de coder
Ne genere pas de code immediatement. Quel est le vrai probleme ? Quelle est la solution la plus simple ?

### 2. Simplicite d'abord
Le meilleur code est celui qui n'existe pas. Prefere 50 lignes claires a 200 lignes "intelligentes".

### 3. Modifications chirurgicales
Ne reecris pas ce qui fonctionne. Identifie le changement minimal qui resout le probleme.

### 4. Execution orientee objectif
Garde l'objectif final en vue. Livre quelque chose qui fonctionne, ameliore ensuite.

## Regles IA -- Securite

### Rate Limiting endpoints IA
Tout endpoint touchant Anthropic/OpenAI doit avoir un rate limit.
Max 20 requetes/utilisateur/heure.

### Protection injection de prompt
Ne jamais concatener l'input utilisateur dans un system prompt.
Utiliser des delimiteurs XML : <user_input>${userText}</user_input>

### Variables d'environnement
- .env.local JAMAIS commite (dans .gitignore)
- SUPABASE_SERVICE_ROLE_KEY : chiffre dans Vercel, jamais dans le code

### Authentification Supabase
- getUser() TOUJOURS cote serveur
- getSession() JAMAIS cote serveur
- Valider l'utilisateur dans chaque Server Action

### God File anti-pattern
- 1 fichier = 1 responsabilite
- Decouper tout fichier qui depasse 250 lignes

### Fichiers d'environnement
- Ne jamais modifier .env, .env.local ou .env.production directement

## Règles IA sécurité (CRITIQUE)

- Rate limit sur TOUS les endpoints AI : 20 req/user/heure max
- Ne jamais passer l'input user dans le system prompt — toujours : <user_input>${input}</user_input>
- God File anti-pattern : 1 fichier = 1 responsabilité, découper à 250 lignes
- Ne jamais modifier .env, .env.local, .env.production directement
