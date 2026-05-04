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
  const [savedSession, setSavedSession] = useState(null)

  useEffect(() => {
    Promise.all([
      apiClient.get('/review_cards/due'),
      apiClient.get('/review_cards'),
      apiClient.get('/lessons'),
    ]).then(([due, all, lessonsRes]) => {
      const allCards = all.data
      setStats({
        due: due.data.length,
        mastered: allCards.filter(c => c.repetitions >= 3).length,
        learning: allCards.filter(c => c.repetitions < 3).length,
      })
      setLessons(lessonsRes.data.slice(0, 3))
      setLoading(false)
    }).catch(() => setLoading(false))

    const saved = sessionStorage.getItem('justwooord_session')
    if (saved) {
      try { setSavedSession(JSON.parse(saved)) } catch {}
    }
  }, [])

  const today = new Date().toLocaleDateString('fr-BE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const navy = '#1B2A4A'
  const blue = '#4A7FCB'
  const lightBlue = '#EEF2FA'

  return (
    <Layout>
      <div className="mb-7">
        <h1 className="text-xl font-semibold mb-1" style={{ color: navy }}>
          Bonjour, {user?.name}.
        </h1>
        <p className="text-sm" style={{ color: '#9BA3AF' }}>{today}</p>
      </div>

      {savedSession && (
        <div className="rounded-xl p-4 mb-5 flex items-center justify-between gap-4" style={{ background: lightBlue, border: '1px solid #D0DCF0' }}>
          <div>
            <div className="text-sm font-medium" style={{ color: navy }}>Session en cours</div>
            <div className="text-xs mt-0.5" style={{ color: '#9BA3AF' }}>
              Mot {savedSession.current + 1} sur {savedSession.cards.length}
            </div>
          </div>
          <button
            onClick={() => navigate('/reviser')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ background: navy, color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Reprendre
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { num: stats.due, label: 'à réviser', sub: "aujourd'hui", accent: true },
          { num: stats.mastered, label: 'mots', sub: 'maîtrisés' },
          { num: stats.learning, label: 'en', sub: 'apprentissage' },
        ].map(({ num, label, sub, accent }) => (
          <div key={label} className="rounded-xl p-5" style={{ background: lightBlue }}>
            <div className="text-3xl font-bold mb-1.5" style={{ color: accent ? blue : navy }}>
              {loading ? '-' : num}
            </div>
            <div className="text-xs" style={{ color: '#7A8494', lineHeight: 1.4 }}>
              {label}<br />{sub}
            </div>
          </div>
        ))}
      </div>

      {!loading && (
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: '#9BA3AF' }}>
            <span>Progression globale</span>
            <span>{Math.round((stats.mastered / (stats.mastered + stats.learning || 1)) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E2E8F4' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.round((stats.mastered / (stats.mastered + stats.learning || 1)) * 100)}%`,
                background: 'linear-gradient(to right, #4A7FCB, #6BA3E8)'
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1.5" style={{ color: '#9BA3AF' }}>
            <span>{stats.mastered} maîtrisés</span>
            <span>{stats.learning} en cours</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:grid gap-4" style={{ gridTemplateColumns: '1fr 1.6fr' }}>
        <div className="rounded-xl p-5" style={{ background: 'white', border: '1px solid #E2E8F4' }}>
          <div className="text-xs font-medium mb-4 tracking-widest uppercase" style={{ color: blue }}>
            Session du jour
          </div>
          {loading ? (
            <p className="text-sm" style={{ color: '#9BA3AF' }}>Chargement...</p>
          ) : stats.due === 0 ? (
            <>
              <p className="text-sm mb-4" style={{ color: '#4A5568' }}>Tous tes mots sont à jour.</p>
              <button
                onClick={() => navigate('/ajouter')}
                className="w-full rounded-lg py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: navy, color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Ajouter un mot
              </button>
            </>
          ) : (
            <>
              <p className="text-sm mb-4" style={{ color: '#4A5568' }}>
                <span className="font-semibold" style={{ color: navy }}>{stats.due} mot{stats.due > 1 ? 's' : ''}</span> à réviser · <span className="font-semibold" style={{ color: navy }}>{Math.ceil(stats.due * 0.7)} min</span>
              </p>
              <button
                onClick={() => navigate('/reviser')}
                className="w-full rounded-lg py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: navy, color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Commencer la révision
              </button>
            </>
          )}
        </div>

        <div className="rounded-xl p-5" style={{ background: 'white', border: '1px solid #E2E8F4' }}>
          <div className="text-xs font-medium mb-4 tracking-widest uppercase" style={{ color: blue }}>
            Leçons récentes
          </div>
          {loading ? (
            <p className="text-sm" style={{ color: '#9BA3AF' }}>Chargement...</p>
          ) : lessons.length === 0 ? (
            <p className="text-sm" style={{ color: '#9BA3AF' }}>Aucune leçon pour l'instant.</p>
          ) : (
            <div>
              {lessons.map((lesson, i) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 py-2.5 cursor-pointer"
                  style={{ borderBottom: i < lessons.length - 1 ? '1px solid #F0F4FA' : 'none' }}
                  onClick={() => navigate(`/lecons/${lesson.id}`)}
                >
                  <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: '30px', height: '30px', background: i === 0 ? lightBlue : '#F5F5F5' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={i === 0 ? blue : '#9BA3AF'} strokeWidth="1.5">
                      <rect x="1" y="1" width="10" height="10" rx="1"/><path d="M1 5h10"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate hover:underline" style={{ color: navy }}>{lesson.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#9BA3AF' }}>
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
            className="mt-3 text-xs transition-opacity hover:opacity-75"
            style={{ color: blue, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Voir toutes les leçons →
          </button>
        </div>
      </div>
    </Layout>
  )
}
