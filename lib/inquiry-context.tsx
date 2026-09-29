'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type InquiryItem = {
  id: string
  name: string
  slug: string
  sku: string | null
}

type InquiryContextType = {
  items: InquiryItem[]
  addItem: (item: InquiryItem) => void
  removeItem: (id: string) => void
  clearItems: () => void
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined)
const STORAGE_KEY = 'zarin-sakht-inquiry'

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InquiryItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        // داده‌ی خراب رو نادیده می‌گیریم
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (item: InquiryItem) => {
    setItems((prev) => (prev.some((p) => p.id === item.id) ? prev : [...prev, item]))
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  const clearItems = () => setItems([])

  return (
    <InquiryContext.Provider value={{ items, addItem, removeItem, clearItems }}>
      {children}
    </InquiryContext.Provider>
  )
}

export function useInquiry() {
  const context = useContext(InquiryContext)
  if (!context) {
    throw new Error('useInquiry must be used within InquiryProvider')
  }
  return context
}