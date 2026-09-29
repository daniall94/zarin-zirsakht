import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import ApproveBuyerButton from '@/components/ApproveBuyerButton'

export default async function AdminBuyersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: buyers } = await supabase
    .from('profiles')
    .select('id, full_name, email, company_name, approved_for_subscription')
    .eq('role', 'buyer')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite">خریداران</h1>
        <LogoutButton />
      </div>
      <Link href="/admin" className="mt-2 inline-block text-sm text-steel hover:text-graphite">
        ← بازگشت به محصولات
      </Link>

      <div className="mt-8 divide-y divide-steel-light/30 border-y border-steel-light/40">
        {buyers?.map((buyer) => (
          <div key={buyer.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="text-sm font-medium text-graphite">{buyer.full_name || 'بدون نام'}</p>
              <p className="mt-1 text-xs text-steel" dir="ltr">{buyer.email}</p>
              {buyer.company_name && <p className="mt-0.5 text-xs text-steel-light">{buyer.company_name}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${buyer.approved_for_subscription ? 'text-amber-dark' : 'text-steel-light'}`}>
                {buyer.approved_for_subscription ? 'فعال' : 'غیرفعال'}
              </span>
              <ApproveBuyerButton profileId={buyer.id} isApproved={buyer.approved_for_subscription} />
            </div>
          </div>
        ))}
        {buyers?.length === 0 && <p className="py-6 text-steel">هنوز خریداری ثبت‌نام نکرده.</p>}
      </div>
    </main>
  )
}
