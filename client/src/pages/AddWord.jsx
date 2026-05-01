import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import apiClient from '../api/client'

const GRAMMATICAL_CATEGORIES = [
  { value: 'verbe', label: 'Verbe' },
  { value: 'nom', label: 'Nom' },
  { value: 'adjectif', label: 'Adjectif' },
  { value: 'adverbe', label: 'Adverbe' },
  { value: 'expression', label: 'Expression' },
  { value: 'regle_grammaire', label: 'Règle de grammaire' },
]

const THEMATIC_CATEGORIES = [
  { value: 'noms_generaux', label: 'Noms généraux' },
  { value: 'verbes_generaux', label: 'Verbes généraux' },
  { value: 'adj_adv_expr', label: 'Adj. / Adv. / Expressions' },
  { value: 'temps_freq', label: 'Temps et fréquence' },
  { value: 'justice_personnes', label: 'Justice - personnes' },
  { value: 'justice_procedure', label: 'Justice - procédure' },
]

const ARTICLES = [
  { value: '', label: '(verbe / adv.)' },
  { value: 'de', label: 'de' },
  { value: 'het', label: 'het' },
]

export default function AddWord() {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    dutch: '',
    article: '',
    grammatical_category: 'verbe',
    french: '',
    thematic_category: 'justice_procedure',
    example_nl: '',
    example_fr: '',
    conjugated_form: '',
    separable: false,
    lesson_id: '',
  })

  useEffect(() => {
    apiClient.get('/lessons').then(res => setLessons(res.data)).catch(() => {})
  }, [])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await apiClient.post('/words', { word: form })
      setSuccess(true)
      setForm({
        dutch: '', article: '', grammatical_category: 'verbe',
        french: '', thematic_category: 'justice_procedure',
        example_nl: '', example_fr: '', conjugated_form: '',
        separable: false, lesson_id: '',
      })
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError("Erreur lors de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1" style={{ color: '#1B2A4A' }}>Ajouter un mot</h1>
        <p className="text-sm" style={{ color: '#9BA3AF' }}>Ajout rapide après le cours</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl p-4 md:p-6 w-full" style={{ background: 'white', border: '1px solid #E2E8F4' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <div>
            <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Mot néerlandais</label>
            <input
              type="text"
              value={form.dutch}
              onChange={e => set('dutch', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
              placeholder="ex. neerschieten"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Article</label>
            <select
              value={form.article}
              onChange={e => set('article', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
            >
              {ARTICLES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Catégorie grammaticale</label>
            <select
              value={form.grammatical_category}
              onChange={e => set('grammatical_category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
            >
              {GRAMMATICAL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Catégorie thématique</label>
            <select
              value={form.thematic_category}
              onChange={e => set('thematic_category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
            >
              {THEMATIC_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Traduction française</label>
            <input
              type="text"
              value={form.french}
              onChange={e => set('french', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
              placeholder="ex. abattre (par balle)"
              required
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Forme conjuguée / info</label>
            <input
              type="text"
              value={form.conjugated_form}
              onChange={e => set('conjugated_form', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
              placeholder="ex. ik schiet neer"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Exemple en néerlandais</label>
            <textarea
              value={form.example_nl}
              onChange={e => set('example_nl', e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none transition-colors"
              placeholder="ex. hij werd terstond neergeschoten"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Traduction de l'exemple</label>
            <textarea
              value={form.example_fr}
              onChange={e => set('example_fr', e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none transition-colors"
              placeholder="ex. il fut abattu sur le champ"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Leçon associée</label>
            <select
              value={form.lesson_id}
              onChange={e => set('lesson_id', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
            >
              <option value="">Aucune leçon</option>
              {lessons.map(l => (
                <option key={l.id} value={l.id}>
                  {l.title} {l.date ? `- ${new Date(l.date).toLocaleDateString('fr-BE')}` : ''}
                </option>
              ))}
            </select>
          </div>

          {form.grammatical_category === 'verbe' && (
            <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="separable"
                checked={form.separable}
                onChange={e => set('separable', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="separable" className="text-sm" style={{ color: '#4A5568' }}>
                Verbe séparable (scheidbaar)
              </label>
            </div>
          )}
        </div>

        {error && <p className="mt-4 text-xs px-3 py-2 rounded-lg" style={{ color: '#92400E', background: '#FEF3C7' }}>{error}</p>}
        {success && <p className="mt-4 text-xs px-3 py-2 rounded-lg" style={{ color: '#065F46', background: '#ECFDF5' }}>Mot enregistré avec succès.</p>}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2.5 text-sm rounded-lg border border-gray-200 transition-colors"
            style={{ color: '#4A5568', background: 'none', cursor: 'pointer' }}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: '#1B2A4A', border: 'none', cursor: 'pointer' }}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer le mot'}
          </button>
        </div>
      </form>
    </Layout>
  )
}
