import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n'

export default function Hero() {
  const { t } = useLang()
  const textRef = useRef(null)

  // Glitch jump — applies ONLY to the title+subtitle wrapper
  useEffect(() => {
    let glitchTimeout
    let snapTimeout

    function scheduleGlitch() {
      const delay = 2000 + Math.random() * 2000

      glitchTimeout = setTimeout(() => {
        const el = textRef.current
        if (!el) { scheduleGlitch(); return }

        const shift = (2 + Math.random() * 2) * (Math.random() > 0.5 ? 1 : -1)
        el.style.transition = 'none'
        el.style.transform  = `translateY(${shift}px)`
        if (Math.random() > 0.6) {
          el.style.transform += ` translateX(${(Math.random() * 1.5 - 0.75).toFixed(1)}px)`
        }

        const hold = 60 + Math.random() * 80
        snapTimeout = setTimeout(() => {
          el.style.transform  = ''
          el.style.transition = ''
          scheduleGlitch()
        }, hold)
      }, delay)
    }

    scheduleGlitch()

    return () => {
      clearTimeout(glitchTimeout)
      clearTimeout(snapTimeout)
      if (textRef.current) {
        textRef.current.style.transform  = ''
        textRef.current.style.transition = ''
      }
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen md:min-h-[74vh] flex items-center justify-center overflow-hidden"
    >
      {/* Neon Collectibles sign */}
      <div className="absolute inset-0 flex items-center z-20 pointer-events-none" style={{ justifyContent: 'calc(50% - 2rem)' }}>
        <img
          src="/sign.png"
          alt="Collectibles sign"
          className="w-80 md:w-[28rem] lg:w-[36rem] h-auto -translate-y-80 md:-translate-y-56 drop-shadow-[0_0_40px_rgba(255,0,110,0.6)]"
        />
      </div>

      {/* ── Hero-scoped VHS layers (clipped to this section) ── */}
      <div className="hero-vhs-scanlines" />
      <div className="hero-vhs-beam"      />
      <div className="hero-vhs-noise-a"   />
      <div className="hero-vhs-noise-b"   />
      <div className="hero-perspective-rays" />
      <div className="hero-synth-glow" />
      <div className="hero-synth-sun" />
      <div className="hero-horizon-line" />
      <div className="hero-perspective-grid" />

      {/* Radial glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-magenta/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan/8 blur-[100px] pointer-events-none" />

      {/* Decorative horizontal lines */}
      <div className="hero-deco-line-2 absolute inset-x-0 top-[42%] h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
      <div className="hero-deco-line-1 absolute inset-x-0 top-[40%] h-px bg-gradient-to-r from-transparent via-magenta/30 to-transparent" />
      <div className="hero-deco-line-2-copy absolute inset-x-0 top-[46%] h-1 bg-gradient-to-r from-transparent via-cyan/30 to-transparent z-50" />
      <div className="hero-deco-line-3-magenta absolute inset-x-0 top-[45%] h-1 bg-gradient-to-r from-transparent via-magenta/60 to-transparent z-51" />
      <div className="hero-deco-line-4 absolute inset-x-0 top-[41%] h-1 bg-gradient-to-r from-transparent via-cyan/30 to-transparent z-50" />

      {/* All content sits above VHS layers (z-10) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center -translate-y-12 md:-translate-y-8">
        {/* ── Glitch target: title only ── */}
        <div ref={textRef}>
          <h1 className="leading-none mb-4 md:mb-6">
            <span className="hero-retro-wordmark block text-3xl md:text-5xl lg:text-6xl text-white">
              RETRO
            </span>
            <span className="block mt-2 font-display font-bold text-6xl md:text-8xl lg:text-9xl text-gradient-magenta tracking-tight animate-glow">
              KROKEN
            </span>
          </h1>
        </div>
      </div>

      <div className="hero-cta-dock">
        <Link
          to="/objekt"
          className="hero-vhs-cta hero-vhs-cta--kodak group"
        >
          <span className="hero-vhs-cta__frame" aria-hidden="true" />
          <span className="hero-vhs-cta__plate hero-vhs-cta__plate--top" aria-hidden="true" />
          <span className="hero-vhs-cta__plate hero-vhs-cta__plate--bottom" aria-hidden="true" />
          <span className="hero-vhs-cta__panel" aria-hidden="true" />
          <span className="hero-vhs-cta__brand" aria-hidden="true">Kodak</span>
          <span className="hero-vhs-cta__label hero-vhs-cta__label--oj">{t.hero.cta}</span>
          <span className="hero-vhs-cta__spec" aria-hidden="true">VHS T-120</span>
          <span className="hero-vhs-cta__arrow" aria-hidden="true">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  )
}
