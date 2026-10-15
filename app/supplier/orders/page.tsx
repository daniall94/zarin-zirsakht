import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import InquiryStatusToggle from '@/components/InquiryStatusToggle'

type OrderItem = {
  quantity: number
  products: { name: string; sku: string | null } | null
}

type Order = {
  id: string
  customer_name: string
  phone: string
  email: string | null
  message: string | null
  status: string
  created_at: string
  order_file_path: string | null
  inquiry_items: OrderItem[]
}

export default async function SupplierOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/supplier/login')

  const { data: rawOrders } = await supabase
    .from('inquiries')
    .select(
      'id, customer_name, phone, email, message, status, created_at, order_file_path, inquiry_items(quantity, products(name, sku))'
    )
    .eq('supplier_id', user.id)
    .order('created_at', { ascending: false })

  const orders = (rawOrders ?? []) as unknown as Order[]

  const ordersWithFiles = await Promise.all(
    orders.map(async (order) => {
      if (!order.order_file_path) return { ...order, fileUrl: null as string | null }
      const { data } = await supabase.storage
        .from('order-files')
        .createSignedUrl(order.order_file_path, 3600)
      return { ...order, fileUrl: data?.signedUrl ?? null }
    })
  )

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite">سفارش‌های دریافتی</h1>
        <LogoutButton redirectTo="/supplier/login" />
      </div>
      <Link href="/supplier" className="mt-2 inline-block text-sm text-steel hover:text-graphite">
        ← بازگشت به محصولات
      </Link>

      {ordersWithFiles.length === 0 ? (
        <p className="mt-8 text-steel">هنوز سفارشی برای محصولات شما ثبت نشده.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {ordersWithFiles.map((order) => (
            <div key={order.id} className="border border-steel-light/40 bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-graphite">{order.customer_name}</p>
                  <p className="mt-1 text-sm text-steel" dir="ltr">
                    {order.phone} {order.email ? `· ${order.email}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-steel-light">
                    {new Date(order.created_at).toLocaleDateString('fa-IR', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <InquiryStatusToggle inquiryId={order.id} status={order.status} />
              </div>

              {order.message && <p className="mt-3 text-sm leading-6 text-steel">{order.message}</p>}

              {order.inquiry_items.length > 0 && (
                <div className="mt-4 border-t border-steel-light/30 pt-3">
                  <p className="text-xs text-steel-light">محصولات درخواستی:</p>
                  <ul className="mt-2 space-y-1">
                    {order.inquiry_items.map((item, i) => (
                      <li key={i} className="text-sm text-graphite">
                        {item.products?.name ?? 'محصول حذف‌شده'}
                        {item.products?.sku && (
                          <span className="ms-2 font-mono text-xs text-steel-light">{item.products.sku}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {order.fileUrl && (
                <div className="mt-4 border-t border-steel-light/30 pt-3">
                  <a href={order.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-amber-dark hover:underline">
                    📎 دانلود فایل سفارش
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
