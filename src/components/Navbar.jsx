import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n'

const langLabels = { sv: 'SV', no: 'NO', en: 'EN' }

export default function Navbar({ variant = 'dark', showVCR = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { t, lang, setLang, languages } = useLang()
  const isLight = variant === 'light'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.collection, href: '/objekt' },
    { label: t.nav.contact, href: '/kontakt' },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isLight
          ? 'bg-white/96 backdrop-blur-md border-b border-border-light shadow-sm'
          : scrolled
            ? 'bg-bg/90 backdrop-blur-md border-b border-border shadow-lg'
            : 'bg-transparent'
      }`}
    >
      <div className="w-full px-6 md:px-10 h-16 flex items-center justify-end">
        {showVCR && (
          <div className="hidden md:flex items-center gap-10 mr-auto hero-vcr-inline">
            <span>PLAY</span>
            <span>SLP 00:00:00</span>
          </div>
        )}

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 ml-auto">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className={`text-sm font-medium transition-colors ${isLight ? 'text-ink/60 hover:text-ink' : 'text-white/70 hover:text-white'}`}
            >
              {l.label}
            </Link>
          ))}

          {/* Language switcher */}
          <div className={`flex items-center gap-1 rounded-full px-1 py-0.5 ${isLight ? 'border border-border-light bg-white' : 'border border-border'}`}>
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-200 ${
                  lang === l
                    ? 'bg-magenta text-white'
                    : isLight ? 'text-ink/40 hover:text-ink' : 'text-white/40 hover:text-white'
                }`}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>

        </nav>

        {/* Mobile burger */}
        <button
          className={`md:hidden transition-colors ${isLight ? 'text-ink/70 hover:text-ink' : 'text-white/70 hover:text-white'}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={`md:hidden backdrop-blur-md border-t px-6 py-4 flex flex-col gap-4 ${isLight ? 'bg-white/95 border-border-light' : 'bg-bg/95 border-border'}`}>
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium transition-colors py-1 ${isLight ? 'text-ink/70 hover:text-ink' : 'text-white/70 hover:text-white'}`}
            >
              {l.label}
            </Link>
          ))}

          {/* Mobile language switcher */}
          <div className="flex items-center gap-2 pt-1">
            <span className={`text-xs uppercase tracking-widest ${isLight ? 'text-ink/30' : 'text-white/30'}`}>Lang:</span>
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-200 ${
                  lang === l
                    ? 'border-magenta bg-magenta text-white'
                    : isLight ? 'border-border-light text-ink/40 hover:text-ink' : 'border-border text-white/40 hover:text-white'
                }`}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
