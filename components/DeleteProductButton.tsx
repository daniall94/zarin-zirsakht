'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('مطمئنی می‌خوای این محصول رو حذف کنی؟')) return

    setIsDeleting(true)
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', productId)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm text-steel hover:text-red-600 disabled:opacity-50"
    >
      {isDeleting ? '...' : 'حذف'}
    </button>
  )
}