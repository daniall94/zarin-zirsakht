import { createClient } from '@/lib/supabase/server'

export default async function PendingCount({ role }: { role: 'buyer' | 'supplier' }) {
  const supabase = await createClient()
  const { count } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', role)
    .eq('approved_for_subscription', false)

  if (!count) return null

  return (
    <span className="flex h-5 min-w-5 items-center justify-center bg-amber px-1 text-xs font-medium text-white">
      {count}
    </span>
  )
}
