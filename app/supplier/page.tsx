import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import DeleteProductButton from '@/components/DeleteProductButton'

type ProductRow = {
  id: string
  name: string
  sku: string | null
  categories: { name: string } | null
}

export default async function SupplierDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/supplier/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, company_name, approved_for_subscription')
    .eq('id', user.id)
    .single()

  const { data: rawProducts } = await supabase
    .from('products')
    .select('id, name, sku, categories(name)')
    .eq('supplier_id', user.id)
    .order('name')

  const products = (rawProducts ?? []) as unknown as ProductRow[]
  const isApproved = profile?.approved_for_subscription ?? false

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
     <div className="flex items-center justify-between">
  <h1 className="text-2xl font-bold text-graphite">پنل تأمین‌کننده</h1>
  <div className="flex items-center gap-4">
    <Link href="/supplier/orders" className="text-sm text-steel hover:text-graphite">
      سفارش‌ها
    </Link>
    <LogoutButton redirectTo="/supplier/login" />
  </div>
</div>
      <p className="mt-2 text-steel">
        خوش اومدی، {profile?.company_name || profile?.full_name || user.email}.
      </p>

      {!isApproved && (
        <div className="mt-8 max-w-md border border-steel-light/40 bg-paper p-6">
          <p className="font-medium text-graphite">حساب شما هنوز تأیید نشده</p>
          <p className="mt-2 text-sm text-steel">
            می‌تونی از الان محصولاتت رو اضافه کنی، ولی تا وقتی قرارداد بسته نشه و ادمین حسابت رو فعال نکنه، تو کاتالوگ عمومی نمایش داده نمی‌شن.
          </p>
          <Link href="/contact" className="mt-4 inline-block text-sm text-amber-dark hover:underline">
            اطلاعات تماس ←
          </Link>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-graphite">محصولات من</h2>
        <Link
          href="/supplier/products/new"
          className="bg-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-dark"
        >
          + محصول جدید
        </Link>
      </div>

      <div className="mt-6 divide-y divide-steel-light/30 border-y border-steel-light/40">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-graphite">{product.name}</p>
              <p className="mt-0.5 text-xs text-steel-light">
                {product.categories?.name ?? 'بدون دسته'} {product.sku ? `· ${product.sku}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/supplier/products/${product.id}`} className="text-sm text-steel hover:text-graphite">
                ویرایش
              </Link>
              <DeleteProductButton productId={product.id} />
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="py-6 text-steel">هنوز محصولی اضافه نکردی.</p>}
      </div>
    </main>
  )
}
