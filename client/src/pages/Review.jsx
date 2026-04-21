import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import apiClient from '../api/client'

function FlipCard({ card, onRate }) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setFlipped(false)
  }, [card.id])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); setFlipped(true) }
      if (e.key === '1' && flipped) onRate(card.id, 1)
      if (e.key === '2' && flipped) onRate(card.id, 2)
      if (e.key === '3' && flipped) onRate(card.id, 3)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [flipped, card.id, onRate])

  return (
    <div className="max-w-xl mx-auto">
      <div
        onClick={() => !flipped && setFlipped(true)}
        className={`bg-white border border-gray-100 rounded-xl p-10 text-center min-h-56 flex flex-col items-center justify-center mb-4 transition-colors ${!flipped ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      >
        {!flipped ? (
          <>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Français</div>
            <div className="text-2xl font-medium text-gray-900">{card.word.french}</div>
            {card.word.grammatical_category && (
              <div className="text-xs text-gray-400 mt-3">{card.word.grammatical_category}</div>
            )}
          </>
        ) : (
          <>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Néerlandais</div>
            <div className="text-2xl font-medium text-teal-700">
              {card.word.article ? `${card.word.article} ` : ''}{card.word.dutch}
            </div>
            {card.word.conjugated_form && (
              <div className="text-sm text-gray-400 mt-2 italic">{card.word.conjugated_form}</div>
            )}
            {card.word.example_nl && (
              <div className="mt-4 pt-4 border-t border-gray-100 w-full text-sm text-gray-500 text-left">
                <div>{card.word.example_nl}</div>
                {card.word.example_fr && (
                  <div className="text-gray-400 mt-1">{card.word.example_fr}</div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {!flipped ? (
        <p className="text-center text-xs text-gray-400">
          Cliquer ou appuyer sur <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Espace</kbd> pour révéler
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onRate(card.id, 1)}
            className="py-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Difficile
            <span className="block text-xs font-normal mt-0.5 opacity-70">revu demain</span>
          </button>
          <button
            onClick={() => onRate(card.id, 2)}
            className="py-3 rounded-lg bg-amber-50 text-amber-600 text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            Correct
            <span className="block text-xs font-normal mt-0.5 opacity-70">revu dans 3 j.</span>
          </button>
          <button
            onClick={() => onRate(card.id, 3)}
            className="py-3 rounded-lg bg-green-50 text-green-600 text-sm font-medium hover:bg-green-100 transition-colors"
          >
            Facile
            <span className="block text-xs font-normal mt-0.5 opacity-70">revu dans 7 j.</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default function Review() {
  const [cards, setCards] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    apiClient.get('/review_cards/due')
      .then(res => {
        setCards(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleRate = useCallback(async (cardId, quality) => {
    try {
      await apiClient.patch(`/review_cards/${cardId}`, { quality })
    } catch {}
    if (current + 1 >= cards.length) {
      setDone(true)
    } else {
      setCurrent(c => c + 1)
    }
  }, [current, cards.length])

  if (loading) return (
    <Layout>
      <div className="text-sm text-gray-400 mt-10 text-center">Chargement...</div>
    </Layout>
  )

  if (done || cards.length === 0) return (
    <Layout>
      <div className="max-w-xl mx-auto mt-16 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          {cards.length === 0 ? 'Aucun mot à réviser' : 'Session terminée'}
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          {cards.length === 0
            ? 'Tous tes mots sont à jour. Reviens plus tard ou ajoute du nouveau vocabulaire.'
            : `${cards.length} mot${cards.length > 1 ? 's' : ''} révisé${cards.length > 1 ? 's' : ''}.`
          }
        </p>
        <a href="/ajouter" className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
          Ajouter un mot
        </a>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Révision</h1>
          <p className="text-sm text-gray-400 mt-1">FR vers NL · session du jour</p>
        </div>
        <div className="text-sm text-gray-400">
          {current + 1} / {cards.length}
        </div>
      </div>

      <div className="mb-6">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all"
            style={{ width: `${((current) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <FlipCard card={cards[current]} onRate={handleRate} />
    </Layout>
  )
}
