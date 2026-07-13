import { createClient } from '@/lib/supabase/server'
import OnboardingClient from './OnboardingClient'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isDemo = user?.email === 'demo@milltrack.app'
  return <OnboardingClient isDemo={isDemo} userEmail={user?.email ?? ''} />
}
