import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'
import { OrderSection } from '@/components/OrderSection'

type PastOrder = {
  id: string
  status: string
  created_at: string
  order_file_path: string | null
  inquiry_items: { products: { name: string } | null }[]
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/account/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, approved_for_subscription')
    .eq('id', user.id)
    .single()

  const { data: rawOrders } = await supabase
    .from('inquiries')
    .select('id, status, created_at, order_file_path, inquiry_items(products(name))')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  const pastOrders = (rawOrders ?? []) as unknown as PastOrder[]

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite">حساب کاربری</h1>
        <LogoutButton redirectTo="/account/login" />
      </div>
      <p className="mt-2 text-steel">خوش اومدی، {profile?.full_name || user.email}.</p>

      <OrderSection
        userId={user.id}
        isApproved={profile?.approved_for_subscription ?? false}
      />

      {pastOrders.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-semibold text-graphite">سوابق سفارش‌ها</h2>
          <div className="mt-4 space-y-4">
            {pastOrders.map((order) => (
              <div key={order.id} className="border border-steel-light/40 bg-paper p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-steel-light">
                    {new Date(order.created_at).toLocaleDateString('fa-IR', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <span className="text-xs text-steel">
                    {order.status === 'contacted' ? 'تماس گرفته شد' : 'در انتظار بررسی'}
                  </span>
                </div>
                {order.inquiry_items.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {order.inquiry_items.map((item, i) => (
                      <li key={i} className="text-sm text-graphite">{item.products?.name}</li>
                    ))}
                  </ul>
                )}
                {order.order_file_path && (
                  <p className="mt-2 text-xs text-steel">📎 یه فایل سفارش هم ضمیمه شده</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
