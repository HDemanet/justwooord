import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import apiClient from '../api/client'
import AudioButton from '../components/ui/AudioButton'

const GRAM_LABELS = {
  verbe: 'Verbe',
  nom: 'Nom',
  adjectif: 'Adjectif',
  adverbe: 'Adverbe',
  expression: 'Expression',
  regle_grammaire: 'Règle de grammaire',
}

export default function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    Promise.all([
      apiClient.get(`/lessons/${id}`),
      apiClient.get(`/words?lesson_id=${id}`),
    ]).then(([lessonRes, wordsRes]) => {
      setLesson(lessonRes.data)
      setWords(wordsRes.data.sort((a, b) => {
        const stripA = a.dutch?.replace(/^(de|het)\s+/i, '').toLowerCase() || ''
        const stripB = b.dutch?.replace(/^(de|het)\s+/i, '').toLowerCase() || ''
        return stripA.localeCompare(stripB, 'nl')
      }))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <Layout>
      <div className="text-sm text-center mt-10" style={{ color: '#9BA3AF' }}>Chargement...</div>
    </Layout>
  )

  if (!lesson) return (
    <Layout>
      <div className="text-sm text-center mt-10" style={{ color: '#9BA3AF' }}>Leçon introuvable.</div>
    </Layout>
  )

  return (
    <Layout>
      <div className="mb-6">
        <button
          onClick={() => navigate('/lecons')}
          className="text-xs mb-3 flex items-center gap-1 transition-opacity hover:opacity-75"
          style={{ color: '#9BA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          ← Toutes les leçons
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold mb-1" style={{ color: '#1B2A4A' }}>{lesson.title}</h1>
            <p className="text-sm" style={{ color: '#9BA3AF' }}>
              {lesson.date && new Date(lesson.date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
              {lesson.teacher && ` · ${lesson.teacher}`}
              {lesson.topic && ` · ${lesson.topic}`}
            </p>
          </div>
          <button
            onClick={() => navigate(`/reviser?lesson_id=${id}`)}
            className="text-sm font-medium px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90 self-start sm:self-auto"
            style={{ background: '#1B2A4A', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Réviser cette leçon
          </button>
        </div>
      </div>

      <div className="mb-4 text-sm" style={{ color: '#9BA3AF' }}>
        {words.length} mot{words.length > 1 ? 's' : ''} dans cette leçon
      </div>

      {words.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: 'white', border: '1px solid #E2E8F4' }}>
          <p className="text-sm mb-4" style={{ color: '#9BA3AF' }}>
            Aucun mot associé à cette leçon.
          </p>
          <button
            onClick={() => navigate('/ajouter')}
            className="text-sm font-medium px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: '#1B2A4A', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Ajouter un mot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
          {words.map(word => (
            <div key={word.id} className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid #E2E8F4' }}>
              <div
                onClick={() => setSelectedId(selectedId === word.id ? null : word.id)}
                className="flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = '#F8F9FC'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="font-medium text-sm truncate" style={{ color: '#1B2A4A' }}>
                    {word.article && (
                      <span className="font-normal mr-1" style={{ color: '#9BA3AF' }}>{word.article}</span>
                    )}
                    {word.dutch}
                  </div>
                  <div className="text-sm flex-shrink-0" style={{ color: '#9BA3AF' }}>{word.french}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {word.grammatical_category && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EEF2FA', color: '#4A7FCB' }}>
                      {GRAM_LABELS[word.grammatical_category] || word.grammatical_category}
                    </span>
                  )}
                  <span className="text-xs" style={{ color: '#D1D5DB' }}>
                    {selectedId === word.id ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {selectedId === word.id && (
                <div className="px-5 py-4 text-sm space-y-3" style={{ background: '#F8F9FC', borderTop: '1px solid #E2E8F4' }}>
                  <AudioButton text={word.dutch} />
                  {word.conjugated_form && (
                    <div>
                      <div className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#9BA3AF' }}>Forme</div>
                      <div className="italic" style={{ color: '#4A5568' }}>{word.conjugated_form}</div>
                    </div>
                  )}
                  {word.example_nl && (
                    <div>
                      <div className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#9BA3AF' }}>Exemple</div>
                      <div style={{ color: '#4A5568' }}>{word.example_nl}</div>
                      {word.example_fr && (
                        <div className="mt-0.5" style={{ color: '#9BA3AF' }}>{word.example_fr}</div>
                      )}
                    </div>
                  )}
                  {word.separable && (
                    <span className="text-xs px-2 py-0.5 rounded-full inline-block" style={{ background: '#FEF3C7', color: '#92400E' }}>
                      verbe séparable
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
