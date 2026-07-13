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
