'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sessionProblem, setSessionProblem] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشه.')
      return
    }
    if (password !== confirm) {
      setError('رمز و تکرارش یکی نیستن.')
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      if (updateError.message.toLowerCase().includes('session')) {
        setSessionProblem(true)
      } else {
        setError('مشکلی پیش اومد: ' + updateError.message)
      }
      setIsSubmitting(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    let target = '/account'
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role === 'admin') target = '/admin'
      else if (profile?.role === 'supplier') target = '/supplier'
    }

    router.push(target)
    router.refresh()
  }

  if (sessionProblem) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-xl font-bold text-graphite">لینک معتبر نیست</h1>
          <p className="mt-3 text-sm text-steel">
            لینک بازیابی منقضی شده یا تو مرورگر دیگه‌ای باز شده. دوباره درخواست بده و لینک رو تو همون مرورگری که درخواست دادی باز کن.
          </p>
          <Link href="/forgot-password" className="mt-4 inline-block text-sm text-amber-dark hover:underline">
            درخواست دوباره
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-graphite">تعیین رمز عبور جدید</h1>

        <div>
          <label className="block text-sm text-steel">رمز عبور جدید</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr"
            className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" required />
        </div>

        <div>
          <label className="block text-sm text-steel">تکرار رمز عبور</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} dir="ltr"
            className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" required />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-amber px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-dark disabled:bg-steel-light">
          {isSubmitting ? 'در حال ذخیره...' : 'ذخیره رمز جدید'}
        </button>
      </form>
    </main>
  )
}