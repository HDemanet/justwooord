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
  { value: 'justice_procedure', label: 'Justice - procédure' },
  { value: 'justice_personnes', label: 'Justice - personnes' },
  { value: 'general', label: 'Verbes généraux' },
  { value: 'temps_freq', label: 'Temps et fréquence' },
  { value: 'grammaire', label: 'Grammaire' },
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
      setError('Erreur lors de l\'enregistrement.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Ajouter un mot</h1>
        <p className="text-sm text-gray-400 mt-1">Ajout rapide après le cours</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Mot néerlandais</label>
            <input
              type="text"
              value={form.dutch}
              onChange={e => set('dutch', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
              placeholder="ex. neerschieten"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Article</label>
            <select
              value={form.article}
              onChange={e => set('article', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
            >
              {ARTICLES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Catégorie grammaticale</label>
            <select
              value={form.grammatical_category}
              onChange={e => set('grammatical_category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
            >
              {GRAMMATICAL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Catégorie thématique</label>
            <select
              value={form.thematic_category}
              onChange={e => set('thematic_category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
            >
              {THEMATIC_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Traduction française</label>
            <input
              type="text"
              value={form.french}
              onChange={e => set('french', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
              placeholder="ex. abattre (par balle)"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Forme conjuguée / info</label>
            <input
              type="text"
              value={form.conjugated_form}
              onChange={e => set('conjugated_form', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
              placeholder="ex. ik schiet neer"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Exemple en néerlandais</label>
            <textarea
              value={form.example_nl}
              onChange={e => set('example_nl', e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors resize-none"
              placeholder="ex. hij werd terstond neergeschoten"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Traduction de l'exemple</label>
            <textarea
              value={form.example_fr}
              onChange={e => set('example_fr', e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors resize-none"
              placeholder="ex. il fut abattu sur le champ"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Leçon associée</label>
            <select
              value={form.lesson_id}
              onChange={e => set('lesson_id', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
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
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="separable"
                checked={form.separable}
                onChange={e => set('separable', e.target.checked)}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="separable" className="text-sm text-gray-600">Verbe séparable (scheidbaar)</label>
            </div>
          )}
        </div>

        {error && <p className="mt-4 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">{error}</p>}
        {success && <p className="mt-4 text-xs text-teal-700 bg-teal-50 px-3 py-2 rounded-lg">Mot enregistré avec succès.</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer le mot'}
          </button>
        </div>
      </form>
    </Layout>
  )
}
