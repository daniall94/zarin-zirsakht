import Link from 'next/link'
import { AddToInquiryButton } from '@/components/AddToInquiryButton'

type Product = {
  id: string
  name: string
  slug: string
  sku: string | null
  image_url: string | null
}

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-px bg-steel-light/30 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((product) => (
        <article key={product.id} className="flex flex-col bg-paper p-4">
          <Link href={`/product/${product.slug}`} className="group">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-white">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <svg className="h-9 w-9 text-steel-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              )}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-graphite group-hover:text-amber-dark">
              {product.name}
            </h3>
            {product.sku && <p className="mt-1 font-mono text-xs text-steel-light">{product.sku}</p>}
          </Link>
          <AddToInquiryButton
            product={{ id: product.id, name: product.name, slug: product.slug, sku: product.sku }}
          />
        </article>
      ))}
    </div>
  )
}