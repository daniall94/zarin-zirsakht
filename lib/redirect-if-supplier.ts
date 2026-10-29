import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function redirectIfSupplier() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'supplier') redirect('/supplier')
}
