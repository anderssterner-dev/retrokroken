import { useState, useEffect } from 'react'
import { useLang } from '../i18n'

export default function BidModal({ item, onClose }) {
  const { t } = useLang()
  const [form, setForm] = useState({ amount: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [fading, setFading] = useState(false)

  const accentColor = item.accent === 'magenta' ? '#FF006E' : '#00D9FF'
  const accentClass = item.accent === 'magenta' ? 'text-magenta' : 'text-cyan'
  const btnClass =
    item.accent === 'magenta'
      ? 'bg-magenta shadow-neon hover:shadow-[0_0_36px_rgba(255,0,110,0.55)]'
      : 'bg-cyan text-bg hover:shadow-[0_0_36px_rgba(0,217,255,0.55)]'
  const focusClass =
    item.accent === 'magenta'
      ? 'focus:border-magenta/60 focus:shadow-[0_0_0_3px_rgba(255,0,110,0.12)]'
      : 'focus:border-cyan/60 focus:shadow-[0_0_0_3px_rgba(0,217,255,0.12)]'

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Auto-close after confirmation
  useEffect(() => {
    if (!submitted) return
    const fadeTimer = setTimeout(() => setFading(true), 2500)
    const closeTimer = setTimeout(() => onClose(), 3300)
    return () => { clearTimeout(fadeTimer); clearTimeout(closeTimer) }
  }, [submitted, onClose])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-card overflow-hidden"
        style={{ borderColor: `${accentColor}30` }}
      >
        {/* Top accent line */}
        <div
          className="h-0.5 w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />

        <div className="p-7">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Item name */}
          <div className="mb-1">
            <span
              className={`text-xs font-medium ${accentClass} tracking-widest uppercase`}
            >
              {item.category}
            </span>
          </div>
          <h2 className="font-display font-bold text-white text-xl mb-6">
            {t.modal.title} - <span className={accentClass}>{item.name}</span>
          </h2>

          {submitted ? (
            <div
              className={`transition-opacity duration-700 ${fading ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className="flex flex-col items-center text-center py-8 gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center border"
                  style={{
                    borderColor: `${accentColor}40`,
                    background: `${accentColor}12`,
                  }}
                >
                  <svg
                    className={`w-7 h-7 ${accentClass}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-medium text-base leading-relaxed">
                  {t.modal.confirmation}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Bid amount */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wider uppercase">
                  {t.modal.amountLabel}
                </label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder={t.modal.amountPlaceholder}
                  className={`w-full bg-bg border border-border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none transition-all ${focusClass}`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wider uppercase">
                  {t.modal.emailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder={t.modal.emailPlaceholder}
                  className={`w-full bg-bg border border-border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none transition-all ${focusClass}`}
                />
              </div>

              {/* Spam note */}
              <p className="text-white/35 text-xs leading-relaxed border-l-2 border-white/10 pl-3">
                {t.modal.spamNote}
              </p>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-[1.01] ${btnClass}`}
              >
                {t.modal.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
