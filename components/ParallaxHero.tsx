'use client'

import { useEffect, useState } from 'react'

export function ParallaxHero() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let ticking = false

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setOffset(Math.min(window.scrollY * 0.4, 220))
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-paper">
      <div className="absolute inset-0 flex">
        <div className="relative h-full w-1/2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-1.jpg"
            alt=""
            className="absolute inset-y-0 left-0 h-full w-[200%] max-w-none scale-110 object-cover"
            style={{ transform: `translateX(${-offset}px)` }}
          />
        </div>
        <div className="relative h-full w-1/2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-1.jpg"
            alt=""
            className="absolute inset-y-0 right-0 h-full w-[200%] max-w-none scale-110 object-cover"
            style={{ transform: `translateX(${offset}px)` }}
          />
        </div>
      </div>

      <div className="absolute inset-0 bg-paper/50" />

      <div className="relative z-10 px-6 text-center">
        <h1 className="text-4xl font-bold text-white md:text-6xl">زرین زیرساخت</h1>
        <p className="mx-auto mt-4 max-w-md text-white/90">
          کاتالوگ محصولات صنعتی و بازرگانی. محصول مدنظرتون رو پیدا کنید و درخواست استعلام قیمت ثبت کنید.
        </p>
      </div>
    </section>
  )
}
