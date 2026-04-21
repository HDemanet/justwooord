import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import apiClient from '../api/client'

export default function Lessons() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', topic: '', teacher: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  useEffect(() => {
    apiClient.get('/lessons')
      .then(res => { setLessons(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await apiClient.post('/lessons', { lesson: form })
      setLessons(l => [res.data, ...l])
      setForm({ title: '', date: '', topic: '', teacher: '' })
      setShowForm(false)
    } catch {
      setError('Erreur lors de la création.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette leçon ?')) return
    try {
      await apiClient.delete(`/lessons/${id}`)
      setLessons(l => l.filter(x => x.id !== id))
    } catch {}
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Leçons</h1>
          <p className="text-sm text-gray-400 mt-1">{lessons.length} leçon{lessons.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          + Nouvelle leçon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-5 mb-5 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Titre</label>
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
                placeholder="ex. Schietpartijen in Anderlecht"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Professeur</label>
              <input
                type="text"
                value={form.teacher}
                onChange={e => set('teacher', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
                placeholder="ex. Jeanne"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Sujet</label>
              <input
                type="text"
                value={form.topic}
                onChange={e => set('topic', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
                placeholder="ex. Vocabulaire policier et fait divers"
              />
            </div>
          </div>
          {error && <p className="mt-3 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              {saving ? 'Enregistrement...' : 'Créer la leçon'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-sm text-gray-400 text-center mt-10">Chargement...</div>
      ) : lessons.length === 0 ? (
        <div className="text-sm text-gray-400 text-center mt-10">Aucune leçon pour l'instant.</div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          {lessons.map((lesson, i) => (
            <div key={lesson.id}>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {lesson.date && new Date(lesson.date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {lesson.teacher && ` · ${lesson.teacher}`}
                    {lesson.topic && ` · ${lesson.topic}`}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="text-xs text-gray-300 hover:text-red-400 transition-colors ml-4"
                >
                  Supprimer
                </button>
              </div>
              {i < lessons.length - 1 && <div className="border-t border-gray-50 mx-5" />}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
