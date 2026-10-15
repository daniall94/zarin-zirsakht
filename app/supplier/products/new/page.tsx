import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

export default async function NewSupplierProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/supplier/login')

  const { data: categories } = await supabase.from('categories').select('id, name').order('name')

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <h1 className="text-2xl font-bold text-graphite">محصول جدید</h1>
      <div className="mt-8">
        <ProductForm categories={categories ?? []} supplierId={user.id} redirectTo="/supplier" />
      </div>
    </main>
  )
}
