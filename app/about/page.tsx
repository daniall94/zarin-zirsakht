import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-graphite md:text-4xl">درباره زرین زیرساخت</h1>
        <p className="mt-5 leading-8 text-steel">
          [متن نمونه — جایگزین کن] زرین زیرساخت یک شرکت بازرگانی فعال در حوزه‌ی تأمین و توزیع تجهیزات صنعتی، لوازم برقی، تجهیزات ایمنی و مواد اولیه است. ما با تکیه بر سال‌ها تجربه در این صنعت، تلاش می‌کنیم محصولاتی باکیفیت و قیمتی رقابتی برای مشتریان خود فراهم کنیم.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-px bg-steel-light/30 sm:grid-cols-3">
        {[
          { title: 'کیفیت تضمین‌شده', desc: '[نمونه] تمام محصولات پیش از عرضه از نظر کیفیت بررسی می‌شوند.' },
          { title: 'تحویل سریع', desc: '[نمونه] سفارش‌ها در سریع‌ترین زمان ممکن آماده و ارسال می‌شوند.' },
          { title: 'پشتیبانی تخصصی', desc: '[نمونه] تیم ما در انتخاب محصول مناسب همراه شماست.' },
        ].map((item) => (
          <div key={item.title} className="bg-paper p-6">
            <h3 className="font-semibold text-graphite">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-steel">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <Link
          href="/contact"
          className="inline-block bg-amber px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-dark"
        >
          تماس با ما
        </Link>
      </div>
    </main>
  )
}