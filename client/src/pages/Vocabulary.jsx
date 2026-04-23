import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import apiClient from '../api/client'
import AudioButton from '../components/ui/AudioButton'

const CATEGORIES = [
  { value: '', label: 'Toutes les catégories' },
  { value: 'noms_generaux', label: 'Noms généraux' },
  { value: 'verbes_generaux', label: 'Verbes généraux' },
  { value: 'adj_adv_expr', label: 'Adj. / Adv. / Expressions' },
  { value: 'temps_freq', label: 'Temps et fréquence' },
  { value: 'justice_personnes', label: 'Justice - personnes' },
  { value: 'justice_procedure', label: 'Justice - procédure' },
]

const GRAM_LABELS = {
  verbe: 'Verbe',
  nom: 'Nom',
  adjectif: 'Adjectif',
  adverbe: 'Adverbe',
  expression: 'Expression',
  regle_grammaire: 'Règle de grammaire',
}

export default function Vocabulary() {
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    apiClient.get(`/words?${params.toString()}`)
      .then(res => { setWords(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category])

  const filtered = words
    .filter(w =>
      w.dutch?.toLowerCase().includes(search.toLowerCase()) ||
      w.french?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const stripA = a.dutch?.replace(/^(de|het)\s+/i, '').toLowerCase() || ''
      const stripB = b.dutch?.replace(/^(de|het)\s+/i, '').toLowerCase() || ''
      return stripA.localeCompare(stripB, 'nl')
    })

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1" style={{ color: '#1B2A4A' }}>Vocabulaire</h1>
        <p className="text-sm" style={{ color: '#9BA3AF' }}>
          {words.length} mot{words.length > 1 ? 's' : ''} au total
        </p>
      </div>

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un mot..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
        >
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-sm text-center mt-10" style={{ color: '#9BA3AF' }}>Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-center mt-10" style={{ color: '#9BA3AF' }}>Aucun mot trouvé.</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
          {filtered.map((word) => (
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
