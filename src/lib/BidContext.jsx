import { createContext, useContext, useMemo, useState } from 'react'

const BidContext = createContext(null)

export function BidProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  function addItem(item) {
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id)
      if (existing) return current

      return [
        ...current,
        {
          id: item.id,
          title: item.title,
          category: item.category || '',
          main_category: item.main_category || '',
          object_code: item.object_code || '',
          amount: '',
        },
      ]
    })
    setIsOpen(true)
  }

  function hasItem(id) {
    return items.some((entry) => entry.id === id)
  }

  function removeItem(id) {
    setItems((current) => current.filter((entry) => entry.id !== id))
  }

  function updateAmount(id, amount) {
    setItems((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, amount } : entry))
    )
  }

  function clear(options = {}) {
    const { keepOpen = false } = options
    setItems([])
    setIsOpen(!keepOpen)
  }

  const value = useMemo(
    () => ({ items, isOpen, open, close, addItem, hasItem, removeItem, updateAmount, clear }),
    [items, isOpen]
  )

  return <BidContext.Provider value={value}>{children}</BidContext.Provider>
}

export function useBidBasket() {
  const context = useContext(BidContext)
  if (!context) throw new Error('useBidBasket must be used within BidProvider')
  return context
}