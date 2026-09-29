export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <h1 className="text-3xl font-bold text-graphite md:text-4xl">تماس با ما</h1>
      <p className="mt-4 max-w-md text-steel">
        برای سفارش، مشاوره یا هر سوالی، از طریق راه‌های زیر با ما در ارتباط باشید.
      </p>

      <div className="mt-10 grid gap-8 sm:max-w-xl sm:grid-cols-2">
        <div>
          <h3 className="text-sm text-steel">تلفن</h3>
          <a href="tel:+98XXXXXXXXXX" className="mt-1 block text-lg font-medium text-graphite hover:text-amber-dark">
            [شماره تلفن]
          </a>
        </div>
        <div>
          <h3 className="text-sm text-steel">ایمیل</h3>
          <a href="mailto:info@example.com" className="mt-1 block text-lg font-medium text-graphite hover:text-amber-dark">
            [ایمیل]
          </a>
        </div>
        <div>
          <h3 className="text-sm text-steel">آدرس</h3>
          <p className="mt-1 text-graphite">[آدرس شرکت]</p>
        </div>
        <div>
          <h3 className="text-sm text-steel">ساعات کاری</h3>
          <p className="mt-1 text-graphite">[مثلاً: شنبه تا چهارشنبه، ۸ تا ۱۶]</p>
        </div>
      </div>
    </main>
  )
}