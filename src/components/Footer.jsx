import { Link } from 'react-router-dom'
import { useLang } from '../i18n'

const socials = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/retro_kroken/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth="0" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@retrokroken',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.18 8.18 0 004.78 1.52V7.0a4.85 4.85 0 01-1.01-.31z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/people/Retrokroken/100070269799041/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    href: 'https://no.pinterest.com/retrokroken/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/Retrokroken',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2H21l-6.51 7.438L22.146 22H16.15l-4.694-6.133L6.09 22H3.332l6.963-7.958L2 2h6.146l4.243 5.59L18.244 2zm-.968 18.338h1.526L7.32 3.574H5.683l11.593 16.764z" />
      </svg>
    ),
  },
]

export default function Footer({ variant = 'dark' }) {
  const { t } = useLang()
  const isLight = variant === 'light'

  return (
    <footer className={isLight ? 'border-t border-border-light bg-white' : 'bg-transparent'}>
      <div className="max-w-6xl mx-auto px-6 py-2">
        <div className="flex justify-center">
          {/* Brand */}
          <div className="max-w-xs text-center">
            <div className="font-display font-bold text-xl tracking-tight mb-1">
                <span className="text-gradient-magenta">Retrokroken</span>
            </div>
            <p className={`${isLight ? 'text-ink/55' : 'text-white/40'} text-sm leading-tight`}>
              {t.footer.tagline}
            </p>
            {/* Socials */}
            <div className="flex items-center justify-center gap-3 mt-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${isLight ? 'border-border-light text-ink/45 hover:text-ink hover:border-magenta/40' : 'border-border text-white/40 hover:text-white hover:border-white/30'}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="mt-1">
              <Link
                to="/kontakt"
                className={`text-sm font-medium transition-colors ${isLight ? 'text-ink/60 hover:text-ink' : 'text-white/55 hover:text-white'}`}
              >
                {t.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
