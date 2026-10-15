import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-steel-light/20 px-6 py-14 md:px-12">
      <div className="grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-bold text-graphite">زرین زیرساخت</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-steel">
            [متن نمونه] تأمین‌کننده‌ی تجهیزات صنعتی، برقی، ایمنی و مواد اولیه برای کسب‌وکارها.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-graphite">دسترسی سریع</p>
          <ul className="mt-3 space-y-2 text-sm text-steel">
            <li><Link href="/" className="hover:text-amber-dark">صفحه اصلی</Link></li>
            <li><Link href="/about" className="hover:text-amber-dark">درباره ما</Link></li>
            <li><Link href="/contact" className="hover:text-amber-dark">تماس با ما</Link></li>
           <li><Link href="/supplier/login" className="hover:text-amber-dark">ورود تأمین‌کنندگان</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-graphite">تماس</p>
          <ul className="mt-3 space-y-2 text-sm text-steel" dir="ltr">
            <li><a href="tel:+98XXXXXXXXXX" className="hover:text-amber-dark">[شماره تلفن]</a></li>
            <li><a href="mailto:info@example.com" className="hover:text-amber-dark">[ایمیل]</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-steel-light/20 pt-6 text-center text-xs text-steel-light">
        © {new Date().getFullYear()} زرین زیرساخت. تمامی حقوق محفوظ است.
      </div>
    </footer>
  )
}
