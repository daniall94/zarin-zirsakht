'use client'

import Link from 'next/link'
import { useInquiry } from '@/lib/inquiry-context'

export function InquiryBadge() {
  const { items } = useInquiry()

  return (
    <Link href="/account" className="flex items-center gap-2 text-sm text-steel hover:text-graphite">
      حساب من
      {items.length > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center bg-amber px-1 text-xs font-medium text-white">
          {items.length}
        </span>
      )}
    </Link>
  )
}
