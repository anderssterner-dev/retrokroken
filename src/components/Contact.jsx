import { useState } from 'react'
import { useLang } from '../i18n'
import { supabase } from '../lib/supabase'

export default function Contact() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase.functions.invoke('submit-bid-request', {
      body: {
        type: 'contact',
        name: form.name,
        customerEmail: form.email,
        message: form.message,
      },
    })

    setSubmitting(false)

    if (error) {
      // Fallback: open mailto with contact info
      const subject = encodeURIComponent('Kontaktmeddelande till Retrokroken')
      const mailBody = encodeURIComponent(`Namn: ${form.name}\n\nMeddelande:\n${form.message}`)
      window.location.href = `mailto:retrokroken@gmail.com?subject=${subject}&body=${mailBody}`
    }

    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-magenta/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto">
        {/* Header */}
        <div className="reveal text-center mb-12">
          <span className="text-xs font-medium text-cyan tracking-widest uppercase">
            {t.contact.label}
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mt-3 mb-4">
            {t.contact.title}
          </h2>
          <p className="text-white/50 text-base">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="reveal">
          {sent ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-xl text-white mb-2">{t.contact.sent}</h3>
              <p className="text-white/50 text-sm">{t.contact.sentSub}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wider uppercase">
                  {t.contact.namePlaceholder}
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder={t.contact.namePlaceholder}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-magenta/60 focus:shadow-[0_0_0_3px_rgba(255,0,110,0.12)] transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wider uppercase">
                  {t.contact.emailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder={t.contact.emailPlaceholder}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-magenta/60 focus:shadow-[0_0_0_3px_rgba(255,0,110,0.12)] transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wider uppercase">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-magenta/60 focus:shadow-[0_0_0_3px_rgba(255,0,110,0.12)] transition-all resize-none"
                />
              </div>

              <p className="text-white/35 text-sm">
                {t.contact.noBidsNote}
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-magenta text-white font-semibold text-sm tracking-wide shadow-neon hover:shadow-[0_0_36px_rgba(255,0,110,0.55)] hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? `${t.contact.submit}...` : t.contact.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
