import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

export default async function EditSupplierProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/supplier/login')

  const [{ data: categories }, { data: product }] = await Promise.all([
    supabase.from('categories').select('id, name').order('name'),
    supabase
      .from('products')
      .select('id, name, slug, description, sku, category_id, image_url')
      .eq('id', id)
      .eq('supplier_id', user.id)
      .single(),
  ])

  if (!product) notFound()

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <h1 className="text-2xl font-bold text-graphite">ویرایش محصول</h1>
      <div className="mt-8">
        <ProductForm categories={categories ?? []} product={product} redirectTo="/supplier" />
      </div>
    </main>
  )
}
