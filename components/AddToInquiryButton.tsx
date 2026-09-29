'use client'

import { useInquiry } from '@/lib/inquiry-context'

type Props = {
  product: {
    id: string
    name: string
    slug: string
    sku: string | null
  }
}

export function AddToInquiryButton({ product }: Props) {
  const { items, addItem } = useInquiry()
  const isAdded = items.some((item) => item.id === product.id)

  return (
    <button
      onClick={() => addItem(product)}
      disabled={isAdded}
      className="mt-3 self-start bg-amber px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-dark disabled:cursor-not-allowed disabled:bg-steel-light"
    >
      {isAdded ? 'اضافه شد ✓' : 'افزودن به لیست استعلام'}
    </button>
  )
}