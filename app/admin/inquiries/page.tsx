import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import InquiryStatusToggle from '@/components/InquiryStatusToggle'

type InquiryItem = {
  quantity: number
  products: { name: string; sku: string | null } | null
}

type Inquiry = {
  id: string
  customer_name: string
  phone: string
  email: string | null
  message: string | null
  status: string
  created_at: string
  inquiry_items: InquiryItem[]
}

export default async function InquiriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: rawInquiries } = await supabase
    .from('inquiries')
    .select('id, customer_name, phone, email, message, status, created_at, inquiry_items(quantity, products(name, sku))')
    .order('created_at', { ascending: false })

  const inquiries = (rawInquiries ?? []) as unknown as Inquiry[]

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite">درخواست‌های استعلام قیمت</h1>
        <LogoutButton />
      </div>

      <Link href="/admin" className="mt-2 inline-block text-sm text-steel hover:text-graphite">
        ← بازگشت به محصولات
      </Link>

      {inquiries.length === 0 ? (
        <p className="mt-8 text-steel">هنوز درخواستی ثبت نشده.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="border border-steel-light/40 bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-graphite">{inquiry.customer_name}</p>
                  <p className="mt-1 text-sm text-steel" dir="ltr">
                    {inquiry.phone} {inquiry.email ? `· ${inquiry.email}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-steel-light">
                    {new Date(inquiry.created_at).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <InquiryStatusToggle inquiryId={inquiry.id} status={inquiry.status} />
              </div>

              {inquiry.message && (
                <p className="mt-3 text-sm leading-6 text-steel">{inquiry.message}</p>
              )}

              <div className="mt-4 border-t border-steel-light/30 pt-3">
                <p className="text-xs text-steel-light">محصولات درخواستی:</p>
                <ul className="mt-2 space-y-1">
                  {inquiry.inquiry_items.map((item, i) => (
                    <li key={i} className="text-sm text-graphite">
                      {item.products?.name ?? 'محصول حذف‌شده'}
                      {item.products?.sku && (
                        <span className="ms-2 font-mono text-xs text-steel-light">
                          {item.products.sku}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}