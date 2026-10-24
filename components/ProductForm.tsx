'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Category = { id: string; name: string }

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  sku: string | null
  category_id: string | null
  image_url: string | null
}
type ProductPayload = {
  name: string
  slug: string
  description: string | null
  sku: string | null
  category_id: string | null
  image_url: string | null
  supplier_id?: string
}

type Props = {
  categories: Category[]
  product?: Product
  supplierId?: string
  redirectTo?: string
}

export default function ProductForm({ categories, product, supplierId, redirectTo = '/admin' }: Props) {
  const router = useRouter()
  const isEditing = Boolean(product)

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [sku, setSku] = useState(product?.sku ?? '')
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  setError('اول باید وارد حساب بشی.')
  setIsUploading(false)
  return
}
const fileExt = file.name.split('.').pop()
const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)

    if (uploadError) {
      setError('آپلود عکس با مشکل مواجه شد: ' + uploadError.message)
      setIsUploading(false)
      return
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
    setImageUrl(data.publicUrl)
    setIsUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !slug.trim()) {
      setError('نام و slug اجباریه.')
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()

        const payload: ProductPayload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      sku: sku.trim() || null,
      category_id: categoryId || null,
      image_url: imageUrl.trim() || null,
    }

    let dbError
    if (isEditing) {
      const result = await supabase.from('products').update(payload).eq('id', product!.id)
      dbError = result.error
    } else {
      const insertPayload: ProductPayload = supplierId
        ? { ...payload, supplier_id: supplierId }
        : payload
      const result = await supabase.from('products').insert(insertPayload)
      dbError = result.error
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm text-steel">نام محصول *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" />
      </div>

      <div>
        <label className="block text-sm text-steel">Slug (برای آدرس، مثلاً: drill-x100) *</label>
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} dir="ltr"
          className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-amber" />
      </div>

      <div>
        <label className="block text-sm text-steel">دسته‌بندی</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber">
          <option value="">بدون دسته</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-steel">SKU</label>
        <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} dir="ltr"
          className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-amber" />
      </div>

      <div>
        <label className="block text-sm text-steel">توضیحات</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
          className="mt-1 w-full border border-steel-light/50 bg-white px-3 py-2 text-sm outline-none focus:border-amber" />
      </div>

      <div>
        <label className="block text-sm text-steel">عکس محصول</label>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="پیش‌نمایش" className="mt-2 h-32 w-32 bg-white object-cover" />
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2 block text-sm text-steel" />
        {isUploading && <p className="mt-1 text-xs text-steel-light">در حال آپلود...</p>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={isSubmitting || isUploading}
        className="bg-amber px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-dark disabled:bg-steel-light">
        {isSubmitting ? 'در حال ذخیره...' : isEditing ? 'ذخیره تغییرات' : 'افزودن محصول'}
      </button>
    </form>
  )
}