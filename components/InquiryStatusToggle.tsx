'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function InquiryStatusToggle({
  inquiryId,
  status,
}: {
  inquiryId: string
  status: string
}) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const isContacted = status === 'contacted'

  const handleToggle = async () => {
    setIsUpdating(true)
    const supabase = createClient()
    await supabase
      .from('inquiries')
      .update({ status: isContacted ? 'pending' : 'contacted' })
      .eq('id', inquiryId)
    router.refresh()
    setIsUpdating(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`shrink-0 px-3 py-1.5 text-xs font-medium transition-colors ${
        isContacted ? 'bg-steel-light/30 text-steel' : 'bg-amber text-white hover:bg-amber-dark'
      }`}
    >
      {isContacted ? 'تماس گرفته شد ✓' : 'علامت‌گذاری به‌عنوان تماس‌گرفته‌شده'}
    </button>
  )
}