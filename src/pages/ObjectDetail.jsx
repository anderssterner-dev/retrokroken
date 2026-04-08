import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { useLang } from '../i18n'
import { findMainCategoryForSubcategory, translateCategory } from '../lib/categories'
import { useBidBasket } from '../lib/BidContext'

export default function ObjectDetail() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const { addItem, hasItem } = useBidBasket()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePopupOpen, setImagePopupOpen] = useState(false)

  useEffect(() => {
    supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single()
      .then(({ data }) => {
        setItem(data || null)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (!item) return
    setSelectedImage(item.image_url || item.gallery_images?.[0] || null)
  }, [item])

  const allImages = item
    ? [item.image_url, ...(Array.isArray(item.gallery_images) ? item.gallery_images : [])].filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="pt-24 px-6 pb-96 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <Link to="/objekt" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.nav.collection}
          </Link>

          {loading ? (
            <div className="h-[28rem] rounded-3xl border border-border bg-card animate-pulse" />
          ) : !item ? (
            <div className="rounded-3xl border border-border bg-card p-12 text-center">
              <h1 className="font-display text-3xl text-white mb-3">Object not found</h1>
              <p className="text-white/45 mb-8">This object is no longer available or has not been published.</p>
              <Link to="/objekt" className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-magenta text-magenta hover:bg-magenta hover:text-white transition-all duration-200">
                {t.nav.collection}
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 items-start">
              <div className="space-y-4">
                <div className="relative rounded-3xl border border-border bg-card overflow-hidden shadow-card w-full aspect-[4/5] cursor-pointer" onClick={() => selectedImage && setImagePopupOpen(true)}>
                  {selectedImage ? (
                    <img src={selectedImage} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-bg/60" />
                  )}
                  {selectedImage && (
                    <button
                      onClick={() => setImagePopupOpen(true)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all"
                      aria-label="View full image"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                      </svg>
                    </button>
                  )}
                </div>

                {allImages.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {allImages.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className={`rounded-2xl overflow-hidden border transition-all ${selectedImage === image ? 'border-magenta shadow-neon' : 'border-border hover:border-white/30'}`}
                      >
                        <img src={image} alt={`${item.title} ${index + 1}`} className="w-full aspect-square object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
                {(item.main_category || item.category) && (
                  <p className="text-xs font-medium text-cyan tracking-[0.18em] uppercase mb-4">
                    {[
                      translateCategory(item.main_category || findMainCategoryForSubcategory(item.category), lang, 'main'),
                      item.category && translateCategory(item.category, lang, 'sub')
                    ].filter(Boolean).join(' / ')}
                  </p>
                )}
                <h1 className="font-display text-4xl md:text-5xl text-white mb-5">{item.title}</h1>
                {item.object_code && (
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30 mb-5">{item.object_code}</p>
                )}
                {(item.era || item.condition) && (
                  <div className="grid grid-cols-[auto_auto] gap-6 mb-6 p-3 w-fit">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/25 mb-1">{t.objectDetail.era}</p>
                      <p className="text-lg font-semibold text-white/75">{item.era || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/25 mb-1">{t.objectDetail.condition}</p>
                      <p className="text-lg font-semibold text-white/75">{item.condition || '-'}</p>
                    </div>
                  </div>
                )}

                {(item.description_sv || item.description_no || item.description_en) && (
                  <div className="mb-8">
                    <p className="text-xs font-medium text-magenta mb-2 tracking-wider uppercase">
                      {t.objectDetail.description}
                    </p>
                    <p className="text-lg leading-7 text-white/75 whitespace-pre-line">
                      {item[`description_${lang}`] || item.description_sv || item.description_no || item.description_en}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => addItem(item)}
                  disabled={hasItem(item.id)}
                  className="w-full py-4 rounded-xl bg-magenta text-white font-semibold text-sm tracking-wide shadow-neon hover:shadow-[0_0_36px_rgba(255,0,110,0.55)] transition-all duration-200"
                >
                  {hasItem(item.id) ? t.bidList.added : t.gallery.bid}
                </button>
                <p className="text-sm leading-6 text-white/50 text-center mt-3">
                  {t.objectDetail.bidHelp}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Image popup modal */}
        {imagePopupOpen && selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setImagePopupOpen(false)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] flex items-center justify-center"
            >
              <img
                src={selectedImage}
                alt={item.title}
                className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              />
              <p className="absolute top-4 left-4 text-white/60 text-xs tracking-wider uppercase">
                {t.objectDetail.closeImage}
              </p>
              <button
                onClick={() => setImagePopupOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all z-50"
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="10" cy="10" r="7" />
                  <path d="M14 14l6 6" />
                  <line x1="10" y1="7" x2="10" y2="13" />
                  <line x1="7" y1="10" x2="13" y2="10" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}