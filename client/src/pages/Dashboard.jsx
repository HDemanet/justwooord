import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import apiClient from '../api/client'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ due: 0, mastered: 0, learning: 0 })
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiClient.get('/review_cards/due'),
      apiClient.get('/review_cards'),
      apiClient.get('/lessons'),
    ]).then(([due, all, lessonsRes]) => {
      const dueCards = due.data
      const allCards = all.data
      const mastered = allCards.filter(c => c.interval >= 21).length
      const learning = allCards.filter(c => c.interval < 21).length
      setStats({ due: dueCards.length, mastered, learning })
      setLessons(lessonsRes.data.slice(0, 3))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('fr-BE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Bonjour, {user?.name}</h1>
        <p className="text-sm text-gray-400 mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-medium text-teal-600">
            {loading ? '-' : stats.due}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">à réviser aujourd'hui</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-medium text-gray-700">
            {loading ? '-' : stats.mastered}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">mots maîtrisés</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-medium text-gray-700">
            {loading ? '-' : stats.learning}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">en apprentissage</div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 bg-white border border-gray-100 rounded-xl p-5">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Session du jour</div>
          {loading ? (
            <p className="text-sm text-gray-400">Chargement...</p>
          ) : stats.due === 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-4">Tous tes mots sont à jour.</p>
              <button
                onClick={() => navigate('/ajouter')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Ajouter un mot
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-medium text-gray-900">{stats.due} mot{stats.due > 1 ? 's' : ''}</span> à réviser, durée estimée <span className="font-medium text-gray-900">{Math.ceil(stats.due * 0.7)} min</span>
              </p>
              <button
                onClick={() => navigate('/reviser')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Commencer la révision
              </button>
            </>
          )}
        </div>

        <div className="col-span-3 bg-white border border-gray-100 rounded-xl p-5">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Leçons récentes</div>
          {loading ? (
            <p className="text-sm text-gray-400">Chargement...</p>
          ) : lessons.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune leçon pour l'instant.</p>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, i) => (
                <div key={lesson.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 0 ? 'bg-teal-400' : 'bg-gray-200'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate">{lesson.title}</div>
                    <div className="text-xs text-gray-400">
                      {lesson.date && new Date(lesson.date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {lesson.teacher && ` · ${lesson.teacher}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate('/lecons')}
            className="mt-4 text-xs text-teal-600 hover:text-teal-700 transition-colors"
          >
            Voir toutes les leçons
          </button>
        </div>
      </div>
    </Layout>
  )
}
