'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function BuyerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('ایمیل یا رمز عبور اشتباهه.')
      setIsSubmitting(false)
      return
    }

    router.push('/account')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-graphite">ورود به حساب خریدار</h1>

        <div>
          <label className="block text-sm text-steel">ایمیل</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr"
            className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" required />
        </div>

        <div>
          <label className="block text-sm text-steel">رمز عبور</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr"
            className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" required />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-amber px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-dark disabled:bg-steel-light">
          {isSubmitting ? 'در حال ورود...' : 'ورود'}
        </button>

        <p className="text-center text-sm text-steel">
          حساب نداری؟ <Link href="/account/signup" className="text-amber-dark hover:underline">ثبت‌نام کن</Link>
        </p>
      </form>
    </main>
  )
}
