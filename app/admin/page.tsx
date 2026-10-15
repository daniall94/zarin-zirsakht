import PendingCount from '@/components/PendingCount'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import DeleteProductButton from '@/components/DeleteProductButton'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: products } = await supabase
    .from('products')
    .select('id, name, sku, slug, categories(name)')
    .order('name')

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="flex items-center justify-between">
  <h1 className="text-2xl font-bold text-graphite">پنل مدیریت</h1>
  <div className="flex items-center gap-4">
    <Link href="/admin/inquiries" className="text-sm text-steel hover:text-graphite">
  درخواست‌های استعلام
</Link>
<Link href="/admin/buyers" className="flex items-center gap-1.5 text-sm text-steel hover:text-graphite">
  خریداران <PendingCount role="buyer" />
</Link>
<Link href="/admin/suppliers" className="flex items-center gap-1.5 text-sm text-steel hover:text-graphite">
  تأمین‌کنندگان <PendingCount role="supplier" />
</Link>
    <LogoutButton />
  </div>
</div>
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-graphite">محصولات</h2>
        <Link
          href="/admin/products/new"
          className="bg-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-dark"
        >
          + محصول جدید
        </Link>
      </div>

      <div className="mt-6 divide-y divide-steel-light/30 border-y border-steel-light/40">
        {products?.map((product: any) => (
          <div key={product.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-graphite">{product.name}</p>
              <p className="mt-0.5 text-xs text-steel-light">
                {product.categories?.name ?? 'بدون دسته'} {product.sku ? `· ${product.sku}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/products/${product.id}`}
                className="text-sm text-steel hover:text-graphite"
              >
                ویرایش
              </Link>
              <DeleteProductButton productId={product.id} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
