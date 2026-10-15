'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useInquiry } from '@/lib/inquiry-context'
import { createClient } from '@/lib/supabase/client'

type Props = {
  userId: string
  isApproved: boolean
}

export function OrderSection({ userId, isApproved }: Props) {
  const { items, removeItem, clearItems } = useInquiry()
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [orderFile, setOrderFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (items.length === 0 && !orderFile) {
      setError('یا حداقل یه محصول به لیست اضافه کن، یا یه فایل سفارش آپلود کن.')
      return
    }
    if (!customerName.trim() || !phone.trim()) {
      setError('نام و شماره تماس اجباریه.')
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()

    let orderFilePath: string | null = null
    if (orderFile) {
      const fileExt = orderFile.name.split('.').pop()
      const path = `${userId}/${crypto.randomUUID()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('order-files').upload(path, orderFile)
      if (uploadError) {
        setError('آپلود فایل با مشکل مواجه شد: ' + uploadError.message)
        setIsSubmitting(false)
        return
      }
      orderFilePath = path
    }

    const { error: orderError } = await supabase.rpc('place_order', {
      p_customer_name: customerName.trim(),
      p_phone: phone.trim(),
      p_email: email.trim(),
      p_message: message.trim(),
      p_file_path: orderFilePath,
      p_items: items.map((item) => ({ product_id: item.id, quantity: 1 })),
    })

    if (orderError) {
      setError('مشکلی پیش اومد: ' + orderError.message)
      setIsSubmitting(false)
      return
    }

    clearItems()
    setOrderFile(null)
    setIsSuccess(true)
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <div className="mt-10 max-w-md border border-steel-light/40 bg-paper p-6 text-center">
        <p className="font-medium text-graphite">درخواست شما ثبت شد ✓</p>
        <p className="mt-2 text-sm text-steel">به زودی کارشناسان ما باهاتون تماس می‌گیرن.</p>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-graphite">ثبت سفارش جدید</h2>

      <div className="mt-4">
        {items.length === 0 ? (
          <p className="text-sm text-steel">هنوز محصولی به لیست اضافه نکردی (اختیاریه — می‌تونی فقط فایل سفارش رو هم آپلود کنی).</p>
        ) : (
          <div className="divide-y divide-steel-light/30 border-y border-steel-light/40">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-graphite">{item.name}</p>
                  {item.sku && <p className="font-mono text-xs text-steel-light">{item.sku}</p>}
                </div>
                <button onClick={() => removeItem(item.id)} className="text-xs text-steel hover:text-red-600">
                  حذف
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isApproved ? (
        <div className="mt-6 max-w-md border border-steel-light/40 bg-paper p-6">
          <p className="font-medium text-graphite">حساب شما هنوز تأیید نشده</p>
          <p className="mt-2 text-sm text-steel">
            برای ثبت سفارش، لازمه اول باهامون قرارداد ببندید. لطفاً با ما تماس بگیرید.
          </p>
          <Link href="/contact" className="mt-4 inline-block text-sm text-amber-dark hover:underline">
            اطلاعات تماس ←
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
          <div>
            <label className="block text-sm text-steel">نام و نام‌خانوادگی *</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" />
          </div>
          <div>
            <label className="block text-sm text-steel">شماره تماس *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" />
          </div>
          <div>
            <label className="block text-sm text-steel">ایمیل (اختیاری)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" />
          </div>
          <div>
            <label className="block text-sm text-steel">توضیحات (اختیاری)</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3}
              className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" />
          </div>
          <div>
            <label className="block text-sm text-steel">فایل سفارش (اختیاری — PDF، Word یا Excel)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
              onChange={(e) => setOrderFile(e.target.files?.[0] ?? null)}
              className="mt-2 block text-sm text-steel"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={isSubmitting}
            className="bg-amber px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-dark disabled:bg-steel-light">
            {isSubmitting ? 'در حال ارسال...' : 'ثبت سفارش'}
          </button>
        </form>
      )}
    </div>
  )
}
