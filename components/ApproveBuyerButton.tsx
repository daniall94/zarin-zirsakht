'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ApproveBuyerButton({
  profileId,
  isApproved,
}: {
  profileId: string
  isApproved: boolean
}) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async () => {
    setIsUpdating(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ approved_for_subscription: !isApproved }).eq('id', profileId)
    router.refresh()
    setIsUpdating(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
        isApproved ? 'bg-steel-light/30 text-steel' : 'bg-amber text-white hover:bg-amber-dark'
      }`}
    >
      {isApproved ? 'غیرفعال کردن' : 'فعال‌سازی حساب'}
    </button>
  )
}
