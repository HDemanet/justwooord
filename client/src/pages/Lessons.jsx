import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import apiClient from '../api/client'

export default function Lessons() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', topic: '', teacher: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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
          <h1 className="text-xl font-semibold mb-1" style={{ color: '#1B2A4A' }}>Leçons</h1>
          <p className="text-sm" style={{ color: '#9BA3AF' }}>
            {lessons.length} leçon{lessons.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="text-sm font-medium px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90"
          style={{ background: '#1B2A4A', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          + Nouvelle leçon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl p-5 mb-5 max-w-xl" style={{ background: 'white', border: '1px solid #E2E8F4' }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Titre</label>
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                placeholder="ex. Schietpartijen in Anderlecht"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Professeur</label>
              <input
                type="text"
                value={form.teacher}
                onChange={e => set('teacher', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                placeholder="ex. Jeanne"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#9BA3AF' }}>Sujet</label>
              <input
                type="text"
                value={form.topic}
                onChange={e => set('topic', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                placeholder="ex. Vocabulaire policier et fait divers"
              />
            </div>
          </div>
          {error && <p className="mt-3 text-xs px-3 py-2 rounded-lg" style={{ color: '#92400E', background: '#FEF3C7' }}>{error}</p>}
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 text-sm rounded-lg border border-gray-200 transition-colors"
              style={{ color: '#4A5568', background: 'none', cursor: 'pointer' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-medium rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: '#1B2A4A', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              {saving ? 'Enregistrement...' : 'Créer la leçon'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-sm text-center mt-10" style={{ color: '#9BA3AF' }}>Chargement...</div>
      ) : lessons.length === 0 ? (
        <div className="text-sm text-center mt-10" style={{ color: '#9BA3AF' }}>Aucune leçon pour l'instant.</div>
      ) : (
        <div className="space-y-2 max-w-2xl">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="rounded-xl px-5 py-4 flex items-center justify-between" style={{ background: 'white', border: '1px solid #E2E8F4' }}>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: '#1B2A4A' }}>{lesson.title}</div>
                <div className="text-xs mt-0.5" style={{ color: '#9BA3AF' }}>
                  {lesson.date && new Date(lesson.date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {lesson.teacher && ` · ${lesson.teacher}`}
                  {lesson.topic && ` · ${lesson.topic}`}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <button
                  onClick={() => navigate(`/reviser?lesson_id=${lesson.id}`)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{ background: '#EEF2FA', color: '#4A7FCB', border: 'none', cursor: 'pointer' }}
                >
                  Réviser
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="text-xs transition-colors"
                  style={{ color: '#D1D5DB', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#D1D5DB'}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
