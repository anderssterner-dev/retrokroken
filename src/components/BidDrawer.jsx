import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useBidBasket } from '../lib/BidContext'
import { useLang } from '../i18n'
import { supabase } from '../lib/supabase'

export default function BidDrawer() {
  const { t } = useLang()
  const location = useLocation()
  const { items, isOpen, open, close, removeItem, updateAmount, clear } = useBidBasket()
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const hideFloatingButton = location.pathname === '/'

  if (location.pathname.startsWith('/admin')) return null

  useEffect(() => {
    if (!isOpen) return undefined
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  const hasValidBids = useMemo(
    () => items.some((item) => Number(item.amount) > 0),
    [items]
  )

  const submittedItems = useMemo(
    () => items.filter((item) => Number(item.amount) > 0),
    [items]
  )

  function buildMailtoBody() {
    const bidLines = submittedItems.map((item) => {
      const meta = [item.main_category, item.category].filter(Boolean).join(' / ')
      const code = item.object_code ? ` (${item.object_code})` : ''
      return `- ${item.title}${code}${meta ? ` - ${meta}` : ''}: ${item.amount} kr`
    })

    return [
      `Hej,`,
      '',
      `Jag vill lägga bud på följande objekt:`,
      ...bidLines,
      '',
      `Kontaktmail: ${email.trim()}`,
      note.trim() ? `Meddelande: ${note.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n')
  }

  async function submitBids() {
    if (!email.trim() || !hasValidBids) return

    setSubmitting(true)
    setFeedback(null)

    const payload = {
      customerEmail: email.trim(),
      note: note.trim(),
      items: submittedItems.map((item) => ({
        id: item.id,
        title: item.title,
        object_code: item.object_code || null,
        main_category: item.main_category || null,
        category: item.category || null,
        amount: Number(item.amount),
      })),
    }

    const { error } = await supabase.functions.invoke('submit-bid-request', {
      body: payload,
    })

    if (error) {
      const subject = encodeURIComponent('Budförfrågan till Retrokroken')
      const mailBody = encodeURIComponent(buildMailtoBody())
      window.location.href = `mailto:retrokroken@gmail.com?subject=${subject}&body=${mailBody}`
      setFeedback(t.bidList.fallback)
      setSubmitting(false)
      return
    }

    clear({ keepOpen: true })
    setFeedback(t.bidList.success)
    setEmail('')
    setNote('')
    setSubmitting(false)
  }

  return (
    <>
      {!hideFloatingButton && (
        <button
          type="button"
          onClick={open}
          className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full border border-magenta bg-bg/90 px-4 py-3 text-sm font-semibold text-magenta shadow-neon backdrop-blur-md hover:bg-magenta hover:text-white transition-all duration-200"
        >
          {t.bidList.cta}
          <span className="rounded-full bg-magenta px-2 py-0.5 text-xs text-white">{items.length}</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={close}>
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-lg border-l border-border bg-card shadow-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-display text-2xl text-white">{t.bidList.title}</h2>
                <p className="text-sm text-white/40">{t.bidList.subtitle}</p>
              </div>
              <button onClick={close} className="text-white/30 hover:text-white transition-colors" aria-label="Close bid drawer">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex h-[calc(100%-84px)] flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                {items.length === 0 ? (
                  <p className="rounded-2xl border border-border bg-bg/60 p-5 text-sm text-white/40">
                    {t.bidList.empty}
                  </p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-border bg-bg/50 p-4">
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">{item.title}</p>
                          <p className="text-xs text-white/35">
                            {[item.main_category, item.category].filter(Boolean).join(' / ')}
                            {item.object_code ? ` - ${item.object_code}` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-white/35 hover:text-red-400 transition-colors"
                        >
                          {t.bidList.remove}
                        </button>
                      </div>

                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                        {t.modal.amountLabel}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.amount}
                        onChange={(event) => updateAmount(item.id, event.target.value)}
                        placeholder={t.modal.amountPlaceholder}
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-white placeholder-white/20 focus:border-magenta/60 focus:outline-none transition-all"
                      />
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-border px-6 py-5 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                    {t.modal.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t.modal.emailPlaceholder}
                    className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white placeholder-white/20 focus:border-magenta/60 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                    {t.bidList.noteLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder={t.bidList.notePlaceholder}
                    className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white placeholder-white/20 focus:border-magenta/60 focus:outline-none transition-all"
                  />
                </div>

                <p className="text-xs leading-relaxed text-white/35">{t.bidList.helper}</p>
                {feedback && <p className="text-xs leading-relaxed text-cyan">{feedback}</p>}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={clear}
                    className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-white/55 hover:text-white hover:border-white/30 transition-all"
                  >
                    {t.bidList.clear}
                  </button>
                  <button
                    type="button"
                    onClick={submitBids}
                    disabled={!email.trim() || !hasValidBids || submitting}
                    className="flex-1 rounded-xl bg-magenta px-4 py-3 text-sm font-semibold text-white shadow-neon disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_36px_rgba(255,0,110,0.55)] transition-all"
                  >
                    {submitting ? t.bidList.submitting : t.bidList.submit}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}