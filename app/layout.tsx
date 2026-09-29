import type { Metadata } from 'next'
import { Vazirmatn } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { InquiryProvider } from '@/lib/inquiry-context'
import { InquiryBadge } from '@/components/InquiryBadge'
import { Footer } from '@/components/Footer'

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn',
})

export const metadata: Metadata = {
  title: 'زرین زیرساخت | کاتالوگ محصولات',
  description: 'کاتالوگ محصولات و سیستم درخواست استعلام قیمت شرکت زرین زیرساخت',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-sans antialiased`}>
        <InquiryProvider>
          <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b border-steel-light/30 bg-paper/70 px-6 py-4 backdrop-blur-md md:px-12">
            <Link href="/" className="font-bold text-graphite">
              زرین زیرساخت
            </Link>
           <nav className="flex items-center gap-5 text-sm text-steel">
  <Link href="/about" className="hover:text-graphite">درباره ما</Link>
  <Link href="/contact" className="hover:text-graphite">تماس با ما</Link>
</nav>
<InquiryBadge /> 
          </div>
          <div className="border border-neon shadow-[0_0_6px_var(--color-neon),0_0_16px_var(--color-neon)]">{children}</div>
          <Footer />
        </InquiryProvider>
      </body>
    </html>
  )
}

