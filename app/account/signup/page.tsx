'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function BuyerSignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fullName.trim() || !email.trim() || !password) {
      setError('نام، ایمیل و رمز عبور اجباریه.')
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    if (signUpError) {
      setError('مشکلی پیش اومد: ' + signUpError.message)
      setIsSubmitting(false)
      return
    }

    if (data.user) {
      await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          company_name: companyName.trim() || null,
          phone: phone.trim() || null,
        })
        .eq('id', data.user.id)
    }

    router.push('/account')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-graphite">ساخت حساب خریدار</h1>

        <div>
          <label className="block text-sm text-steel">نام و نام‌خانوادگی *</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" />
        </div>

        <div>
          <label className="block text-sm text-steel">نام شرکت (اختیاری)</label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" />
        </div>

        <div>
          <label className="block text-sm text-steel">شماره تماس (اختیاری)</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" />
        </div>

        <div>
          <label className="block text-sm text-steel">ایمیل *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr"
            className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" />
        </div>

        <div>
          <label className="block text-sm text-steel">رمز عبور *</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr"
            className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-amber px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-dark disabled:bg-steel-light">
          {isSubmitting ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
        </button>

        <p className="text-center text-sm text-steel">
          حساب داری؟ <Link href="/account/login" className="text-amber-dark hover:underline">وارد شو</Link>
        </p>
      </form>
    </main>
  )
}
