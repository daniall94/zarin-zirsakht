import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ParallaxHero } from '@/components/ParallaxHero'

type CategoryWithCount = {
  id: string
  name: string
  slug: string
  products: { count: number }[]
}

const certificates = [
  { title: '[نام گواهینامه ۱]', issuer: '[نهاد صادرکننده]' },
  { title: '[نام گواهینامه ۲]', issuer: '[نهاد صادرکننده]' },
  { title: '[نام گواهینامه ۳]', issuer: '[نهاد صادرکننده]' },
  { title: '[نام گواهینامه ۴]', issuer: '[نهاد صادرکننده]' },
]

function NeonDivider() {
  return (
    <div className="h-px w-full bg-neon shadow-[0_0_6px_var(--color-neon),0_0_16px_var(--color-neon)]" />
  )
}

export default async function Home() {
  const supabase = await createClient()

  const { data: rawCategories } = await supabase
    .from('categories')
    .select('id, name, slug, products(count)')
    .order('name')

  const categories = (rawCategories ?? []) as unknown as CategoryWithCount[]

  return (
    <main className="min-h-screen">
      <ParallaxHero />
      <NeonDivider />

      <section className="px-6 py-20 md:px-12">
        <h2 className="text-2xl font-bold text-graphite">دسته‌بندی محصولات</h2>
        <div className="mt-10 grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex items-center justify-between border-b border-steel-light/20 py-4"
            >
              <span className="text-graphite transition-colors group-hover:text-amber-dark">
                {category.name}
              </span>
              <span className="flex items-center gap-3 text-sm text-steel">
                {category.products?.[0]?.count ?? 0}
                <svg
                  className="h-3.5 w-3.5 translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <NeonDivider />

      <section className="px-6 py-20 md:px-12">
        <h2 className="text-2xl font-bold text-graphite">گواهینامه‌ها و مدارک</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {certificates.map((cert) => (
            <div key={cert.title} className="flex flex-col items-center text-center">
              <svg className="h-10 w-10 text-steel" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036v-13.036"
                />
              </svg>
              <p className="mt-4 text-sm font-medium text-graphite">{cert.title}</p>
              <p className="mt-1 text-xs text-steel">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
