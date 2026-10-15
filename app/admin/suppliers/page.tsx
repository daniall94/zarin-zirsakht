import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import ApproveBuyerButton from '@/components/ApproveBuyerButton'

export default async function AdminSuppliersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: suppliers } = await supabase
    .from('profiles')
    .select('id, full_name, email, company_name, approved_for_subscription')
    .eq('role', 'supplier')
    .order('approved_for_subscription', { ascending: true })
.order('created_at', { ascending: false })

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite">تأمین‌کنندگان</h1>
        <LogoutButton />
      </div>
      <Link href="/admin" className="mt-2 inline-block text-sm text-steel hover:text-graphite">
        ← بازگشت به محصولات
      </Link>

      <div className="mt-8 divide-y divide-steel-light/30 border-y border-steel-light/40">
        {suppliers?.map((supplier) => (
          <div key={supplier.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="text-sm font-medium text-graphite">{supplier.company_name || 'بدون نام شرکت'}</p>
              <p className="mt-1 text-xs text-steel">{supplier.full_name}</p>
              <p className="mt-0.5 text-xs text-steel-light" dir="ltr">{supplier.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${supplier.approved_for_subscription ? 'text-amber-dark' : 'text-steel-light'}`}>
                {supplier.approved_for_subscription ? 'فعال' : 'غیرفعال'}
              </span>
              <ApproveBuyerButton profileId={supplier.id} isApproved={supplier.approved_for_subscription} />
            </div>
          </div>
        ))}
        {suppliers?.length === 0 && <p className="py-6 text-steel">هنوز تأمین‌کننده‌ای ثبت‌نام نکرده.</p>}
      </div>
    </main>
  )
}
