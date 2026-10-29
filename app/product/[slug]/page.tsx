import { AddToInquiryButton } from '@/components/AddToInquiryButton'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { redirectIfSupplier } from '@/lib/redirect-if-supplier'

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  sku: string | null
  image_url: string | null
  categories: { name: string; slug: string } | null
}

export default async function ProductPage({
  
  params,
}: {
  params: Promise<{ slug: string }>
}) {
   await redirectIfSupplier()
  const { slug } = await params
  const supabase = await createClient()

  const { data: rawProduct } = await supabase
    .from('products')
    .select('id, name, slug, description, sku, image_url, categories(name, slug)')
    .eq('slug', slug)
    .single()

  if (!rawProduct) {
    notFound()
  }

  const product = rawProduct as unknown as Product

  return (
    <main className="min-h-screen">
      <div className="px-6 py-6 md:px-12">
        <Link href="/" className="text-sm text-steel hover:text-graphite">
          ← بازگشت به کاتالوگ
        </Link>
      </div>

      <div className="grid gap-10 px-6 pb-16 md:grid-cols-2 md:px-12">
        <div className="flex aspect-square w-full items-center justify-center bg-white">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg className="h-16 w-16 text-steel-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          )}
        </div>

        <div>
         {product.categories && (
  <Link href={`/category/${product.categories.slug}`} className="text-sm text-steel hover:text-amber-dark">
    {product.categories.name}
  </Link>
)}
          <h1 className="mt-2 text-2xl font-bold text-graphite md:text-3xl">
            {product.name}
          </h1>
          {product.sku && (
            <p className="mt-2 font-mono text-sm text-steel-light">{product.sku}</p>
          )}
          {product.description && (
            <p className="mt-6 leading-7 text-steel">{product.description}</p>
          )}

          <AddToInquiryButton
  product={{
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
  }}
/>
        </div>
      </div>
    </main>
  )
}

