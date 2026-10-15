'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordForm({ linkExpired }: { linkExpired: boolean }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('ایمیل رو وارد کن.')
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError('مشکلی پیش اومد: ' + error.message)
      setIsSubmitting(false)
      return
    }

    setIsSent(true)
    setIsSubmitting(false)
  }

  if (isSent) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-graphite">ایمیلت رو چک کن</h1>
          <p className="mt-3 text-sm text-steel">
            اگه این ایمیل تو سایت ثبت شده باشه، یه لینک برای تعیین رمز جدید براش فرستاده می‌شه. لینک رو تو همین مرورگر باز کن. اگه ایمیل نیومد، پوشه‌ی اسپم رو هم نگاه کن.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-graphite">فراموشی رمز عبور</h1>

        {linkExpired && (
          <p className="text-sm text-red-600">لینک معتبر نبود یا منقضی شده. دوباره درخواست بده.</p>
        )}

        <div>
          <label className="block text-sm text-steel">ایمیل حسابت</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr"
            className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" required />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-amber px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-dark disabled:bg-steel-light">
          {isSubmitting ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
        </button>

        <p className="text-center text-sm text-steel">
          <Link href="/account/login" className="text-amber-dark hover:underline">بازگشت به ورود</Link>
        </p>
      </form>
    </main>
  )
}
