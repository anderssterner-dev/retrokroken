import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n'
import { supabase } from '../lib/supabase'
import { CATEGORY_TREE, MAIN_CATEGORIES, findMainCategoryForSubcategory, translateCategory } from '../lib/categories'
import { useBidBasket } from '../lib/BidContext'

function ProductCard({ item, index, variant = 'dark' }) {
  const { t } = useLang()
  const { addItem, hasItem } = useBidBasket()
  const isLight = variant === 'light'
  const accent      = index % 2 === 0 ? 'magenta' : 'cyan'
  const accentColor = accent === 'magenta' ? '#FF008C' : '#00F5D4'
  const accentClass = accent === 'magenta' ? 'text-magenta' : 'text-cyan'
  const borderHover = accent === 'magenta'
    ? 'hover:border-magenta/60 hover:shadow-neon'
    : 'hover:border-cyan/60 hover:shadow-neon-cyan'
  const ctaClass = accent === 'magenta'
    ? isLight ? 'border-magenta/50 text-magenta hover:bg-magenta hover:text-white' : 'border-magenta/50 text-magenta hover:bg-magenta hover:text-white'
    : isLight ? 'border-cyan/50 text-cyan hover:bg-cyan hover:text-ink' : 'border-cyan/50 text-cyan hover:bg-cyan hover:text-bg'
  const secondaryCtaClass = accent === 'magenta'
    ? 'bg-magenta text-white hover:shadow-[0_0_28px_rgba(255,0,110,0.45)]'
    : isLight ? 'bg-cyan text-ink hover:shadow-[0_0_28px_rgba(0,245,212,0.35)]' : 'bg-cyan text-bg hover:shadow-[0_0_28px_rgba(0,245,212,0.35)]'
  const alreadyAdded = hasItem(item.id)

  return (
    <div
      className={`reveal group relative rounded-2xl border transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col ${borderHover} ${isLight ? 'bg-white border-border-light shadow-[0_20px_60px_rgba(17,24,39,0.08)]' : 'bg-card border-border shadow-card'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className={`relative aspect-[4/3] overflow-hidden ${isLight ? 'bg-mist' : 'bg-bg/60'}`}>
        <Link to={`/objekt/${item.id}`} className="block h-full">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <>
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                style={{ background: `radial-gradient(circle at 50% 60%, ${accentColor}40 0%, transparent 70%)` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-20 h-20 opacity-15 group-hover:opacity-25 transition-opacity"
                  viewBox="0 0 80 80" fill="none" style={{ color: accentColor }}>
                  <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2" />
                  <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="1" />
                  <line x1="2" y1="40" x2="78" y2="40" stroke="currentColor" strokeWidth="1" />
                  <line x1="40" y1="2" x2="40" y2="78" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
            </>
          )}
        </Link>

      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <Link to={`/objekt/${item.id}`} className="inline-block">
            <h3 className={`font-display font-semibold text-base mb-1 transition-colors ${isLight ? 'text-ink hover:text-magenta' : 'text-white hover:text-magenta'}`}>{item.title}</h3>
          </Link>
          {item.object_code && (
            <p className={`text-[10px] uppercase tracking-[0.18em] mb-1 ${isLight ? 'text-ink/30' : 'text-white/20'}`}>{item.object_code}</p>
          )}
          {item.category && (
            <p className={`text-[11px] uppercase tracking-[0.18em] ${isLight ? 'text-ink/45' : 'text-white/30'}`}>
              {item.category}
            </p>
          )}
        </div>
        {item.description && (
          <p className={`text-sm leading-6 line-clamp-3 min-h-[4.5rem] ${isLight ? 'text-ink/60' : 'text-white/45'}`}>{item.description}</p>
        )}
        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link
            to={`/objekt/${item.id}`}
            className={`w-full text-center text-xs font-semibold px-4 py-2.5 rounded-xl border ${ctaClass} transition-all duration-200`}
          >
            {t.gallery.openObject}
          </Link>
          <button
            type="button"
            onClick={() => addItem(item)}
            disabled={alreadyAdded}
            className={`w-full rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${secondaryCtaClass}`}
          >
            {alreadyAdded ? t.bidList.added : t.bidList.addAction}
          </button>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-[0_20px_60px_rgba(17,24,39,0.08)] animate-pulse">
      <div className="aspect-[4/3] bg-slate-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-8 bg-slate-100 rounded-xl" />
      </div>
    </div>
  )
}

export default function Gallery({ showFooterCta = false, variant = 'dark', customLabel = null, customTitle = null, hideSubtitle = false }) {
  const { t, lang } = useLang()
  const isLight = variant === 'light'
  const [items,      setItems]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search, setSearch] = useState('')
  const [selectedMainCategory, setSelectedMainCategory] = useState('')
  const [expandedCategory, setExpandedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [newestItemDate, setNewestItemDate] = useState(null)
  const [showNewOnly, setShowNewOnly] = useState(false)

  useEffect(() => {
    supabase
      .from('items')
      .select('id, title, object_code, description, main_category, category, era, condition, image_url, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setItems(
            data.map((item) => ({
              ...item,
              main_category: item.main_category || findMainCategoryForSubcategory(item.category),
            }))
          )
          if (data.length > 0) {
            setNewestItemDate(data[0].created_at)
          }
        }
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (loading) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    document.querySelectorAll('#gallery .reveal:not(.visible)').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [items, loading, selectedMainCategory, selectedSubcategory])

  const filteredItems = items.filter((item) => {
    const matchesMain = !selectedMainCategory || item.main_category === selectedMainCategory
    const matchesSub = !selectedSubcategory || item.category === selectedSubcategory
    const haystack = [item.title, item.description, item.main_category, item.category, item.era, item.condition]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    const matchesSearch = !search.trim() || haystack.includes(search.trim().toLowerCase())

    let matchesNew = true
    if (showNewOnly) {
      const itemDate = new Date(item.created_at)
      const now = new Date()
      const diffHours = (now - itemDate) / (1000 * 60 * 60)
      matchesNew = diffHours <= 72
    }

    return matchesMain && matchesSub && matchesSearch && matchesNew
  })

  return (
    <section id="gallery" className={`py-24 px-6 ${isLight ? 'bg-white' : ''}`}>
      <div className="max-w-6xl mx-auto">
        <div className={`reveal mb-10 ${isLight ? 'pt-6 pb-2 border-b border-border-light' : ''}`}>
          <span className="text-xs font-medium text-magenta tracking-widest uppercase">
            {customLabel || t.gallery.label}
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mt-3">
            <div>
              <h2 className={`font-display font-bold text-4xl md:text-5xl mb-4 ${isLight ? 'text-ink' : 'text-white'}`}>
                {customTitle || t.gallery.title}
              </h2>
              {!hideSubtitle && (
                <p className={`max-w-xl text-base ${isLight ? 'text-ink/60' : 'text-white/50'}`}>
                  {t.gallery.subtitle}
                </p>
              )}
              {newestItemDate && (
                <p className={`text-sm mt-3 ${isLight ? 'text-ink/45' : 'text-white/35'}`}>
                  {t.catalog.newestAdditions}: {new Date(newestItemDate).toLocaleDateString(lang === 'sv' ? 'sv-SE' : lang === 'no' ? 'nb-NO' : 'en-US')}
                </p>
              )}
            </div>
            <div className={`text-sm ${isLight ? 'text-ink/45' : 'text-white/35'}`}>
              {t.catalog.showing} {filteredItems.length} {t.catalog.results}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
          <aside className={`reveal lg:sticky lg:top-24 rounded-2xl p-5 space-y-6 ${isLight ? 'border border-border-light bg-mist shadow-[0_12px_30px_rgba(17,24,39,0.05)]' : 'border border-border bg-card'}`}>
            <div>
              <label className={`block text-xs font-medium mb-2 tracking-wider uppercase ${isLight ? 'text-ink/45' : 'text-white/50'}`}>
                {t.catalog.searchPlaceholder}
              </label>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.catalog.searchPlaceholder}
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-magenta/60 transition-all ${isLight ? 'bg-mist border border-border-light text-ink placeholder-ink/25' : 'bg-bg border border-border text-white placeholder-white/20'}`}
              />
            </div>

            <div>
              <h3 className={`text-xs font-medium mb-3 tracking-wider uppercase ${isLight ? 'text-ink/45' : 'text-white/50'}`}>
                {t.catalog.browseBy}
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowNewOnly(!showNewOnly)
                    if (!showNewOnly) {
                      setSelectedMainCategory('')
                      setSelectedSubcategory('')
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${showNewOnly ? 'bg-cyan text-bg' : isLight ? 'text-ink/65 hover:bg-mist hover:text-ink' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                >
                  {t.catalog.newItems}
                </button>
                <button
                  onClick={() => {
                    setSelectedMainCategory('')
                    setSelectedSubcategory('')
                    setShowNewOnly(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${!selectedMainCategory && !showNewOnly ? 'bg-magenta text-white' : isLight ? 'text-ink/65 hover:bg-mist hover:text-ink' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                >
                  {t.catalog.allCategories}
                </button>
                {MAIN_CATEGORIES.map((category) => (
                  <div key={category}>
                    <button
                      onClick={() => {
                        setSelectedMainCategory(category)
                        setExpandedCategory(expandedCategory === category ? '' : category)
                        setSelectedSubcategory('')
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${selectedMainCategory === category ? isLight ? 'bg-white text-ink border border-magenta/30 shadow-[0_8px_20px_rgba(17,24,39,0.04)]' : 'bg-white/10 text-white border border-magenta/40' : isLight ? 'text-ink/65 hover:bg-white hover:text-ink' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                      {translateCategory(category, lang, 'main')}
                    </button>
                    {expandedCategory === category && (CATEGORY_TREE[category] || []).length > 0 && (
                      <div className="space-y-1 mt-1 ml-1">
                        {(CATEGORY_TREE[category] || []).map((subcategory) => (
                          <button
                            key={subcategory}
                            onClick={() => {
                              setSelectedMainCategory(category)
                              setSelectedSubcategory((current) => current === subcategory ? '' : subcategory)
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${selectedSubcategory === subcategory ? 'bg-cyan/10 text-cyan border border-cyan/30' : isLight ? 'text-ink/65 hover:bg-white hover:text-ink' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                          >
                            {translateCategory(subcategory, lang, 'sub')}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </aside>

          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredItems.length === 0 ? (
              <p className={`text-center py-16 ${isLight ? 'text-ink/35' : 'text-white/30'}`}>{t.catalog.noMatches}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {filteredItems.map((item, i) => (
                  <ProductCard key={item.id} item={item} index={i} variant={variant} />
                ))}
              </div>
            )}
          </div>
        </div>

        {showFooterCta && (
          <div className="reveal text-center mt-12">
            <Link to="/kontakt"
              className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${isLight ? 'text-ink/55 hover:text-ink' : 'text-white/50 hover:text-white'}`}>
              {t.gallery.viewAll}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
