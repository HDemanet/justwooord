import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import apiClient from '../api/client'
import AudioButton from '../components/ui/AudioButton'

const CATEGORIES = [
  { value: '', label: 'Toutes les catégories' },
  { value: 'justice_procedure', label: 'Justice - procédure' },
  { value: 'justice_personnes', label: 'Justice - personnes' },
  { value: 'general', label: 'Verbes généraux' },
  { value: 'temps_freq', label: 'Temps et fréquence' },
  { value: 'grammaire', label: 'Grammaire' },
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
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    apiClient.get(`/words?${params.toString()}`)
      .then(res => { setWords(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category])

  const filtered = words.filter(w =>
    w.dutch?.toLowerCase().includes(search.toLowerCase()) ||
    w.french?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Vocabulaire</h1>
        <p className="text-sm text-gray-400 mt-1">{words.length} mot{words.length > 1 ? 's' : ''} au total</p>
      </div>

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un mot..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
        >
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 text-center mt-10">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-400 text-center mt-10">Aucun mot trouvé.</div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          {filtered.map((word, i) => (
            <div key={word.id}>
              <div
                onClick={() => setSelected(selected?.id === word.id ? null : word)}
                className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="font-medium text-sm text-gray-900">
                    {word.article && <span className="text-gray-400 font-normal mr-1">{word.article}</span>}
                    {word.dutch}
                  </div>
                  <div className="text-sm text-gray-400">{word.french}</div>
                </div>
                <div className="flex items-center gap-2">
                  {word.grammatical_category && (
                    <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                      {GRAM_LABELS[word.grammatical_category] || word.grammatical_category}
                    </span>
                  )}
                  <span className="text-gray-300 text-xs">{selected?.id === word.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {selected?.id === word.id && (
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 text-sm space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {word.article && <span className="text-gray-400 font-normal mr-1">{word.article}</span>}
                      {word.dutch}
                    </span>
                    <AudioButton text={word.dutch} />
                  </div>
                  {word.conjugated_form && (
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide">Forme</span>
                      <div className="text-gray-700 italic mt-0.5">{word.conjugated_form}</div>
                    </div>
                  )}
                  {word.example_nl && (
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide">Exemple</span>
                      <div className="text-gray-700 mt-0.5">{word.example_nl}</div>
                      {word.example_fr && <div className="text-gray-400 mt-0.5">{word.example_fr}</div>}
                    </div>
                  )}
                  {word.separable && (
                    <div className="text-xs text-amber-600 bg-amber-50 inline-block px-2 py-0.5 rounded-full">verbe séparable</div>
                  )}
                </div>
              )}

              {i < filtered.length - 1 && <div className="border-t border-gray-50 mx-5" />}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
