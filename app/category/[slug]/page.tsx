import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductGrid } from '@/components/ProductGrid'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const { data: rawProducts } = await supabase
    .from('products')
    .select('id, name, slug, sku, image_url')
    .eq('category_id', category.id)
    .order('name')

  const products = rawProducts ?? []

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <Link href="/" className="text-sm text-steel hover:text-graphite">
        ← بازگشت به دسته‌بندی‌ها
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-graphite md:text-4xl">{category.name}</h1>
      <p className="mt-2 text-steel">{products.length} محصول</p>

      <div className="mt-8">
        {products.length > 0 ? (
          <ProductGrid items={products} />
        ) : (
          <p className="text-steel">فعلاً محصولی تو این دسته نیست.</p>
        )}
      </div>
    </main>
  )
}