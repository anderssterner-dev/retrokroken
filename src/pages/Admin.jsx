import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { CATEGORY_TREE, MAIN_CATEGORIES, findMainCategoryForSubcategory, translateCategory } from '../lib/categories'
import { useLang } from '../i18n'

const EMPTY_FORM = { title_sv: '', title_no: '', title_en: '', object_code: '', description_sv: '', description_no: '', description_en: '', main_category: '', category: '', era: '', condition: '' }

// ── Small UI helpers ──────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-2 tracking-wider uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-bg border border-border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm ' +
  'focus:outline-none focus:border-magenta/60 focus:shadow-[0_0_0_3px_rgba(255,0,110,0.10)] transition-all'

// ── Login screen ──────────────────────────────────────────────────────────────

function LoginForm() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8">
        <div className="mb-8">
          <div className="font-display font-bold text-xl mb-1">
            <span className="text-gradient-magenta">Retrokroken</span>
          </div>
          <p className="text-white/40 text-sm">Admin</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Email">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="admin@example.com" className={inputCls} />
          </Field>
          <Field label="Password">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••" className={inputCls} />
          </Field>
          {error && <p className="text-magenta text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-magenta text-white font-semibold text-sm shadow-neon hover:shadow-[0_0_36px_rgba(255,0,110,0.55)] transition-all disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Item list row ─────────────────────────────────────────────────────────────

function ItemRow({ item, onToggle, onDelete, onEdit }) {
  const [busy, setBusy] = useState(false)

  async function toggle() {
    setBusy(true)
    await onToggle(item)
    setBusy(false)
  }

  async function del() {
    if (!confirm(`Delete "${item.title}"?`)) return
    setBusy(true)
    await onDelete(item.id)
    setBusy(false)
  }

  function edit() {
    onEdit(item)
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      {item.image_url && (
        <img src={item.image_url} alt={item.title}
          className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{item.title}</p>
        <p className="text-white/40 text-xs">
          {item.object_code ? `${item.object_code} · ` : ''}
          {item.main_category || findMainCategoryForSubcategory(item.category)}
          {item.category ? ` / ${item.category}` : ''}
          {item.era ? ` · ${item.era}` : ''}
        </p>
      </div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
        item.status === 'published'
          ? 'bg-cyan/10 text-cyan border border-cyan/30'
          : 'bg-white/5 text-white/40 border border-border'
      }`}>
        {item.status}
      </span>
      <button onClick={edit} disabled={busy}
        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:border-white/40 hover:text-white transition-all disabled:opacity-40 flex-shrink-0">
        Edit
      </button>
      <button onClick={toggle} disabled={busy}
        className="text-xs px-3 py-1.5 rounded-lg border border-magenta/40 text-magenta hover:bg-magenta hover:text-white transition-all disabled:opacity-40 flex-shrink-0">
        {item.status === 'published' ? 'Unpublish' : 'Publish'}
      </button>
      <button onClick={del} disabled={busy}
        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/30 hover:border-red-500/50 hover:text-red-400 transition-all disabled:opacity-40 flex-shrink-0">
        Delete
      </button>
    </div>
  )
}

// ── Main admin dashboard ──────────────────────────────────────────────────────

function Dashboard({ session }) {
  const { lang, setLang, languages } = useLang()
  const [form,         setForm]         = useState(EMPTY_FORM)
  const [editingId,    setEditingId]    = useState(null)
  const [existingImages, setExistingImages] = useState({ image_url: null, gallery_images: [] })
  const [imageFiles,   setImageFiles]   = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [items,        setItems]        = useState([])
  const [saving,       setSaving]       = useState(false)
  const [message,      setMessage]      = useState(null)
  const fileRef = useRef(null)

  async function fetchItems() {
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  useEffect(() => { fetchItems() }, [])

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [imagePreviews])

  function handleImageChange(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))
    setImageFiles(files)
    setImagePreviews(files.map((file) => URL.createObjectURL(file)))
  }

  async function uploadImages() {
    if (!imageFiles.length) return []

    const uploadedUrls = []

    for (const [index, file] of imageFiles.entries()) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('products').upload(path, file)
      if (error) throw new Error('Image upload failed: ' + error.message)
      uploadedUrls.push(supabase.storage.from('products').getPublicUrl(path).data.publicUrl)
    }

    return uploadedUrls
  }

  async function save(status) {
    if (!form.title_sv.trim() && !form.title_no.trim() && !form.title_en.trim()) { setMessage('At least one title is required.'); return }
    if (!form.main_category || !form.category) {
      setMessage('Choose a main category and subcategory.')
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const uploadedUrls = await uploadImages()
      const title = form.title_sv.trim() || form.title_no.trim() || form.title_en.trim()
      const payload = {
        ...form,
        title,
        object_code: form.object_code.trim() || null,
        status,
      }

      if (uploadedUrls.length > 0) {
        payload.image_url = uploadedUrls[0]
        payload.gallery_images = uploadedUrls.slice(1)
      } else if (editingId) {
        // Keep existing images if not uploading new ones
        payload.image_url = existingImages.image_url
        payload.gallery_images = existingImages.gallery_images
      }

      let error
      if (editingId) {
        const { error: updateError } = await supabase.from('items').update(payload).eq('id', editingId)
        error = updateError
      } else {
        const { error: insertError } = await supabase.from('items').insert(payload)
        error = insertError
      }

      if (error) throw new Error(error.message)
      setMessage(editingId ? 'Item updated!' : (status === 'published' ? 'Item published!' : 'Saved as draft.'))
      setForm(EMPTY_FORM)
      setEditingId(null)
      setExistingImages({ image_url: null, gallery_images: [] })
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))
      setImageFiles([])
      setImagePreviews([])
      if (fileRef.current) fileRef.current.value = ''
      fetchItems()
    } catch (err) {
      setMessage(err.message)
    }
    setSaving(false)
  }

  async function toggleStatus(item) {
    const newStatus = item.status === 'published' ? 'draft' : 'published'
    await supabase.from('items').update({ status: newStatus }).eq('id', item.id)
    fetchItems()
  }

  async function deleteItem(id) {
    await supabase.from('items').delete().eq('id', id)
    fetchItems()
  }

  async function editItem(item) {
    setForm({
      title_sv: item.title_sv || '',
      title_no: item.title_no || '',
      title_en: item.title_en || '',
      object_code: item.object_code || '',
      description_sv: item.description_sv || '',
      description_no: item.description_no || '',
      description_en: item.description_en || '',
      main_category: item.main_category || '',
      category: item.category || '',
      era: item.era || '',
      condition: item.condition || '',
    })
    setExistingImages({
      image_url: item.image_url || null,
      gallery_images: item.gallery_images || [],
    })
    setEditingId(item.id)
    setImageFiles([])
    setImagePreviews([])
    if (fileRef.current) fileRef.current.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display font-bold text-xl">
              <span className="text-gradient-magenta">Retrokroken</span>
              <span className="text-white/30 text-base font-normal ml-2">Admin</span>
            </div>
            <p className="text-white/30 text-xs mt-0.5">{session.user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full px-1 py-0.5 border border-border">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                    lang === l
                      ? 'bg-magenta text-white'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="/" className="text-xs text-white/40 hover:text-white transition-colors">
              View site
            </a>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-xs px-4 py-2 rounded-full border border-border text-white/50 hover:border-white/30 hover:text-white transition-all">
              Sign out
            </button>
          </div>
        </div>

        {/* Add item form */}
        <div className="bg-card border border-border rounded-2xl p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-white text-lg">
              {editingId ? 'Edit Item' : 'Add New Item'}
            </h2>
            {editingId && (
              <button
                onClick={() => {
                  setForm(EMPTY_FORM)
                  setEditingId(null)
                  setExistingImages({ image_url: null, gallery_images: [] })
                  setMessage(null)
                }}
                className="text-xs px-3 py-1.5 rounded-lg border border-border text-white/50 hover:text-white/70 transition-all"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-5">
            <Field label="Title - Swedish (SV)">
              <input type="text" value={form.title_sv}
                onChange={e => setForm({ ...form, title_sv: e.target.value })}
                placeholder="Swedish title..." className={inputCls} />
            </Field>

            <Field label="Title - Norwegian (NO)">
              <input type="text" value={form.title_no}
                onChange={e => setForm({ ...form, title_no: e.target.value })}
                placeholder="Norwegian title..." className={inputCls} />
            </Field>

            <Field label="Title - English (EN)">
              <input type="text" value={form.title_en}
                onChange={e => setForm({ ...form, title_en: e.target.value })}
                placeholder="English title..." className={inputCls} />
            </Field>

            <Field label="Object code">
              <input type="text" value={form.object_code}
                onChange={e => setForm({ ...form, object_code: e.target.value.toUpperCase() })}
                placeholder="e.g. RK-24001" className={inputCls} />
              <p className="mt-2 text-xs text-white/25">Leave blank to let Supabase generate one automatically.</p>
            </Field>

            <Field label="Description - Swedish (SV)">
              <textarea value={form.description_sv}
                onChange={e => setForm({ ...form, description_sv: e.target.value })}
                placeholder="Swedish description..." rows={3}
                className={inputCls + ' resize-none'} />
            </Field>

            <Field label="Description - Norwegian (NO)">
              <textarea value={form.description_no}
                onChange={e => setForm({ ...form, description_no: e.target.value })}
                placeholder="Norwegian description..." rows={3}
                className={inputCls + ' resize-none'} />
            </Field>

            <Field label="Description - English (EN)">
              <textarea value={form.description_en}
                onChange={e => setForm({ ...form, description_en: e.target.value })}
                placeholder="English description..." rows={3}
                className={inputCls + ' resize-none'} />
            </Field>

            <div className="grid grid-cols-4 gap-4">
              <Field label="Main category">
                <select
                  value={form.main_category}
                  onChange={e => setForm({ ...form, main_category: e.target.value, category: '' })}
                  className={inputCls}
                >
                  <option value="">Select main category</option>
                  {MAIN_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{translateCategory(category, lang, 'main')}</option>
                  ))}
                </select>
              </Field>
              <Field label="Subcategory">
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  disabled={!form.main_category}
                  className={`${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="">Select subcategory</option>
                  {(CATEGORY_TREE[form.main_category] || []).map((subcategory) => (
                    <option key={subcategory} value={subcategory}>{translateCategory(subcategory, lang, 'sub')}</option>
                  ))}
                </select>
              </Field>
              <Field label="Era">
                <input type="text" value={form.era}
                  onChange={e => setForm({ ...form, era: e.target.value })}
                  placeholder="e.g. 80s" className={inputCls} />
              </Field>
              <Field label="Condition">
                <input type="text" value={form.condition}
                  onChange={e => setForm({ ...form, condition: e.target.value })}
                  placeholder="e.g. Excellent" className={inputCls} />
              </Field>
            </div>

            {/* Image upload */}
            <Field label="Images">
              <div
                onClick={() => fileRef.current?.click()}
                className="relative border border-dashed border-border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-magenta/40 transition-colors group"
              >
                {imagePreviews.length ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {imagePreviews.slice(0, 3).map((preview, index) => (
                      <img key={preview} src={preview} alt={`preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-border" />
                    ))}
                    {imagePreviews.length > 3 && (
                      <div className="w-16 h-16 rounded-lg border border-border bg-white/5 flex items-center justify-center text-xs text-white/50">
                        +{imagePreviews.length - 3}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white/20 group-hover:text-white/40 transition-colors"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4-4 4 4 4-6 4 6M4 20h16M12 4v8" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                    {imageFiles.length ? `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} selected` : 'Click to upload images'}
                  </p>
                  <p className="text-xs text-white/25 mt-0.5">JPG, PNG, WEBP. First image becomes the main image.</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple
                  onChange={handleImageChange} className="hidden" />
              </div>
            </Field>

            {message && (
              <p className={`text-sm ${message.includes('!') ? 'text-cyan' : 'text-magenta'}`}>
                {message}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              {!editingId && (
                <button onClick={() => save('draft')} disabled={saving}
                  className="flex-1 py-3 rounded-xl border border-border text-white/60 font-semibold text-sm hover:border-white/30 hover:text-white transition-all disabled:opacity-40">
                  {saving ? 'Saving...' : 'Save as Draft'}
                </button>
              )}
              <button onClick={() => save(editingId ? form.status || 'published' : 'published')} disabled={saving}
                className="flex-1 py-3 rounded-xl bg-magenta text-white font-semibold text-sm shadow-neon hover:shadow-[0_0_36px_rgba(255,0,110,0.55)] transition-all disabled:opacity-40">
                {saving ? (editingId ? 'Updating...' : 'Publishing...') : (editingId ? 'Update' : 'Publish')}
              </button>
            </div>
          </div>
        </div>

        {/* Items list */}
        {items.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-7">
            <h2 className="font-display font-semibold text-white text-lg mb-4">
              All Items
              <span className="ml-2 text-white/30 text-sm font-normal">({items.length})</span>
            </h2>
            <div>
              {items.map(item => (
                <ItemRow key={item.id} item={item}
                  onToggle={toggleStatus} onDelete={deleteItem} onEdit={editItem} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Entry point ───────────────────────────────────────────────────────────────

export default function Admin() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return null // brief auth check
  if (!session) return <LoginForm />
  return <Dashboard session={session} />
}
