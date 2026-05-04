import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import apiClient from '../api/client'
import AudioButton from '../components/ui/AudioButton'

function TypingCard({ card, onRate, direction }) {
  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [hint, setHint] = useState(null)
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)
  const word = card.word
  const isNLFR = direction === 'nl_fr'

  useEffect(() => {
    setAnswer('')
    setAttempts(0)
    setHint(null)
    setResult(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [card.id])

  const normalize = (str) =>
    str.toLowerCase().trim()
       .replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e')
       .replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o')
       .replace(/[ùûü]/g, 'u').replace(/ç/g, 'c')

  const stripArticle = (str) =>
    str.replace(/^(de|het)\s+/i, '').trim()

  const isCorrect = (input) => {
    const target = normalize(isNLFR ? word.french : stripArticle(word.dutch))
    const given = normalize(isNLFR ? input : stripArticle(input))
    return target === given
  }

  const getHint = (attempt) => {
    const w = isNLFR ? word.french : stripArticle(word.dutch)
    if (attempt === 1) return `Commence par "${w[0].toUpperCase()}" · ${w.length} lettres`
    if (attempt === 2) return `"${w.slice(0, Math.ceil(w.length / 2))}..."`
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (result) return
    if (isCorrect(answer)) {
      setResult('correct')
      setTimeout(() => onRate(card.id, attempts === 0 ? 3 : 2, false), 1200)
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      if (newAttempts >= 3) {
        setResult('incorrect')
        setHint(null)
      } else {
        setHint(getHint(newAttempts))
      }
    }
  }

  const handleGiveUp = () => { setResult('incorrect'); setHint(null) }
  const handleContinue = () => onRate(card.id, 1, true)

  useEffect(() => {
    if (result !== 'incorrect') return
    const handleKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleContinue()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [result])

  const questionText = isNLFR ? word.dutch : word.french
  const answerText = isNLFR ? word.french : word.dutch
  const questionLabel = isNLFR ? 'Néerlandais' : 'Français'
  const placeholder = isNLFR ? 'Tapez la traduction en français...' : 'Tapez le mot en néerlandais...'

  return (
    <>
      <div className="w-full max-w-xl mx-auto">
        <div className={`bg-white border rounded-xl p-5 md:p-8 mb-4 transition-colors ${
          result === 'correct' ? 'border-green-200 bg-green-50' :
          result === 'incorrect' ? 'border-blue-200 bg-blue-50' :
          'border-gray-100'
        }`}>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-3">{questionLabel}</div>
          <div className="text-xl md:text-2xl font-medium text-gray-900 mb-1">{questionText}</div>
          {word.grammatical_category && (
            <div className="text-xs text-gray-400">{word.grammatical_category}</div>
          )}

          {!result && (
            <form onSubmit={handleSubmit} className="mt-6">
              <input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              {hint && (
                <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  Indice : {hint}
                </div>
              )}
              {attempts > 0 && attempts < 3 && (
                <div className="mt-1 text-xs text-gray-400">Tentative {attempts + 1} / 3</div>
              )}
              <div className="mt-3 flex gap-2">
                <button type="submit" className="flex-1 text-white text-sm font-medium py-3 rounded-lg transition-opacity hover:opacity-90" style={{ background: '#1B2A4A', border: 'none', cursor: 'pointer' }}>
                  Valider
                </button>
                <button type="button" onClick={handleGiveUp} className="px-4 py-3 text-sm text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-colors">
                  Voir la réponse
                </button>
              </div>
            </form>
          )}

          {result === 'correct' && (
            <div className="mt-4">
              <div className="text-green-700 font-medium text-sm mb-1">Correct !</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-medium" style={{ color: '#1B2A4A' }}>{answerText}</div>
                {!isNLFR && <AudioButton text={word.dutch} />}
              </div>
              {word.conjugated_form && <div className="text-sm text-gray-400 italic mt-1">{word.conjugated_form}</div>}
            </div>
          )}

          {result === 'incorrect' && (
            <div className="mt-4">
              <div className="text-blue-700 font-medium text-sm mb-2">La bonne réponse :</div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-medium text-gray-900">{answerText}</div>
                {!isNLFR && <AudioButton text={word.dutch} />}
              </div>
              {word.conjugated_form && <div className="text-sm text-gray-400 italic mt-1">{word.conjugated_form}</div>}
              {word.example_nl && (
                <div className="mt-3 pt-3 border-t border-blue-100 text-sm text-gray-500">
                  <div>{word.example_nl}</div>
                  {word.example_fr && <div className="text-gray-400 mt-0.5">{word.example_fr}</div>}
                </div>
              )}
              <button onClick={handleContinue} className="mt-4 w-full text-white text-sm font-medium py-3 rounded-lg transition-opacity hover:opacity-90" style={{ background: '#1B2A4A', border: 'none', cursor: 'pointer' }}>
                J'ai compris, continuer
              </button>
            </div>
          )}
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result === 'correct' && `Correct. La réponse est : ${answerText}`}
        {result === 'incorrect' && `Incorrect. La bonne réponse est : ${answerText}`}
      </div>
    </>
  )
}

function ContextCard({ card, onRate }) {
  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [hint, setHint] = useState(null)
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)
  const word = card.word

  useEffect(() => {
    setAnswer('')
    setAttempts(0)
    setHint(null)
    setResult(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [card.id])

  const normalize = (str) =>
    str.toLowerCase().trim()
       .replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e')
       .replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o')
       .replace(/[ùûü]/g, 'u').replace(/ç/g, 'c')

  const stripArticle = (str) =>
    str.replace(/^(de|het)\s+/i, '').trim()

  const getTarget = () => stripArticle(word.dutch)

  const isCorrect = (input) =>
    normalize(stripArticle(input)) === normalize(getTarget())

  const getSentenceWithBlank = () => {
    if (!word.example_nl) return null
    const target = getTarget()
    const sentence = word.example_nl

    const variants = [target, word.dutch, target.toLowerCase()].filter(Boolean)
    for (const variant of variants) {
      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`\\b${escaped}\\b`, 'i')
      if (regex.test(sentence)) {
        return sentence.replace(regex, '___')
      }
    }

    const firstWord = target.split(' ')[0]
    const escapedFirst = firstWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regexPartial = new RegExp(`\\b${escapedFirst}\\w*\\b`, 'i')
    if (regexPartial.test(sentence)) {
      return sentence.replace(regexPartial, '___')
    }

    return null
  }

  const getHint = (attempt) => {
    const w = getTarget()
    if (attempt === 1) return `Commence par "${w[0].toUpperCase()}" · ${w.length} lettres`
    if (attempt === 2) return `"${w.slice(0, Math.ceil(w.length / 2))}..."`
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (result) return
    if (isCorrect(answer)) {
      setResult('correct')
      setTimeout(() => onRate(card.id, attempts === 0 ? 3 : 2, false), 1200)
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      if (newAttempts >= 3) {
        setResult('incorrect')
        setHint(null)
      } else {
        setHint(getHint(newAttempts))
      }
    }
  }

  const handleGiveUp = () => { setResult('incorrect'); setHint(null) }
  const handleContinue = () => onRate(card.id, 1, true)

  useEffect(() => {
    if (result !== 'incorrect') return
    const handleKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleContinue()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [result])

  const sentenceWithBlank = getSentenceWithBlank()

  return (
    <>
      <div className="w-full max-w-xl mx-auto">
        <div className={`bg-white border rounded-xl p-5 md:p-8 mb-4 transition-colors ${
          result === 'correct' ? 'border-green-200 bg-green-50' :
          result === 'incorrect' ? 'border-blue-200 bg-blue-50' :
          'border-gray-100'
        }`}>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-3">Complète la phrase</div>

          {word.example_fr && (
            <div className="text-sm mb-4 px-3 py-2 rounded-lg italic" style={{ color: '#9BA3AF', background: '#F8F9FC' }}>
              {word.example_fr}
            </div>
          )}

          {sentenceWithBlank ? (
            <div className="text-lg md:text-xl font-medium mb-2" style={{ color: '#1B2A4A' }}>
              {sentenceWithBlank}
            </div>
          ) : (
            <div className="mb-2">
              <div className="text-lg md:text-xl font-medium mb-1" style={{ color: '#1B2A4A' }}>
                {word.example_nl}
              </div>
              <div className="text-xs px-3 py-1.5 rounded-lg inline-block" style={{ background: '#EEF2FA', color: '#4A7FCB' }}>
                Traduction : {word.french}
              </div>
            </div>
          )}

          {word.grammatical_category && (
            <div className="text-xs text-gray-400 mt-1">{word.grammatical_category}</div>
          )}

          {!result && (
            <form onSubmit={handleSubmit} className="mt-6">
              <input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder={sentenceWithBlank ? "Tapez le mot manquant..." : "Tapez le mot en néerlandais..."}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              {hint && (
                <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  Indice : {hint}
                </div>
              )}
              {attempts > 0 && attempts < 3 && (
                <div className="mt-1 text-xs text-gray-400">Tentative {attempts + 1} / 3</div>
              )}
              <div className="mt-3 flex gap-2">
                <button type="submit" className="flex-1 text-white text-sm font-medium py-3 rounded-lg transition-opacity hover:opacity-90" style={{ background: '#1B2A4A', border: 'none', cursor: 'pointer' }}>
                  Valider
                </button>
                <button type="button" onClick={handleGiveUp} className="px-4 py-3 text-sm text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-colors">
                  Voir la réponse
                </button>
              </div>
            </form>
          )}

          {result === 'correct' && (
            <div className="mt-4">
              <div className="text-green-700 font-medium text-sm mb-2">Correct !</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-medium" style={{ color: '#1B2A4A' }}>{word.dutch}</div>
                <AudioButton text={word.dutch} />
              </div>
              {word.example_nl && (
                <div className="mt-2 text-sm" style={{ color: '#4A5568' }}>{word.example_nl}</div>
              )}
            </div>
          )}

          {result === 'incorrect' && (
            <div className="mt-4">
              <div className="text-blue-700 font-medium text-sm mb-2">La bonne réponse :</div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-medium text-gray-900">{word.dutch}</div>
                <AudioButton text={word.dutch} />
              </div>
              {word.example_nl && (
                <div className="mt-2 text-sm" style={{ color: '#4A5568' }}>{word.example_nl}</div>
              )}
              <button onClick={handleContinue} className="mt-4 w-full text-white text-sm font-medium py-3 rounded-lg transition-opacity hover:opacity-90" style={{ background: '#1B2A4A', border: 'none', cursor: 'pointer' }}>
                J'ai compris, continuer
              </button>
            </div>
          )}
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result === 'correct' && `Correct. Le mot est : ${word.dutch}`}
        {result === 'incorrect' && `Incorrect. La bonne réponse est : ${word.dutch}`}
      </div>
    </>
  )
}

function FlipCard({ card, onRate, direction }) {
  const [flipped, setFlipped] = useState(false)
  const word = card.word
  const isNLFR = direction === 'nl_fr'

  useEffect(() => { setFlipped(false) }, [card.id])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); setFlipped(true) }
      if (e.key === '1' && flipped) onRate(card.id, 1, true)
      if (e.key === '2' && flipped) onRate(card.id, 2, false)
      if (e.key === '3' && flipped) onRate(card.id, 3, false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [flipped, card.id, onRate])

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onClick={() => !flipped && setFlipped(true)}
        role="button"
        tabIndex={0}
        aria-label={flipped ? `Réponse : ${isNLFR ? word.french : word.dutch}` : `Mot à traduire : ${isNLFR ? word.dutch : word.french}. Cliquer pour révéler.`}
        onKeyDown={e => e.key === 'Enter' && !flipped && setFlipped(true)}
        className={`bg-white border border-gray-100 rounded-xl p-8 md:p-10 text-center flex flex-col items-center justify-center mb-4 transition-colors ${!flipped ? 'cursor-pointer hover:bg-gray-50' : ''}`}
        style={{ minHeight: '200px' }}
      >
        {!flipped ? (
          <>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">{isNLFR ? 'Néerlandais' : 'Français'}</div>
            <div className="text-xl md:text-2xl font-medium text-gray-900">{isNLFR ? word.dutch : word.french}</div>
            {word.grammatical_category && <div className="text-xs text-gray-400 mt-3">{word.grammatical_category}</div>}
          </>
        ) : (
          <>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">{isNLFR ? 'Français' : 'Néerlandais'}</div>
            <div className="text-xl md:text-2xl font-medium" style={{ color: '#1B2A4A' }}>{isNLFR ? word.french : word.dutch}</div>
            {!isNLFR && <AudioButton text={word.dutch} />}
            {word.conjugated_form && <div className="text-sm text-gray-400 mt-2 italic">{word.conjugated_form}</div>}
            {word.example_nl && (
              <div className="mt-4 pt-4 border-t border-gray-100 w-full text-sm text-gray-500 text-left">
                <div>{word.example_nl}</div>
                {word.example_fr && <div className="text-gray-400 mt-1">{word.example_fr}</div>}
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
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <button onClick={() => onRate(card.id, 1, true)} className="py-3 md:py-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
            Difficile<span className="block text-xs font-normal mt-0.5 opacity-70">revoir</span>
          </button>
          <button onClick={() => onRate(card.id, 2, false)} className="py-3 md:py-4 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors">
            Correct<span className="block text-xs font-normal mt-0.5 opacity-70">3 jours</span>
          </button>
          <button onClick={() => onRate(card.id, 3, false)} className="py-3 md:py-4 rounded-lg bg-green-50 text-green-600 text-sm font-medium hover:bg-green-100 transition-colors">
            Facile<span className="block text-xs font-normal mt-0.5 opacity-70">7 jours</span>
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
  const [mode, setMode] = useState('typing')
  const [direction, setDirection] = useState('fr_nl')
  const [started, setStarted] = useState(false)
  const [limit, setLimit] = useState(20)
  const [totalDue, setTotalDue] = useState(0)
  const [summary, setSummary] = useState({})
  const [savedSession, setSavedSession] = useState(null)
  const [searchParams] = useSearchParams()
  const lessonId = searchParams.get('lesson_id')

  useEffect(() => {
    const url = `/review_cards/due?limit=999${lessonId ? `&lesson_id=${lessonId}` : ''}`
    apiClient.get(url)
      .then(res => { setTotalDue(res.data.length); setLoading(false) })
      .catch(() => setLoading(false))

    const saved = sessionStorage.getItem('justwooord_session')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.lessonId === lessonId) {
          setSavedSession(parsed)
        }
      } catch {}
    }
  }, [lessonId])

  useEffect(() => {
    if (started && cards.length > 0 && !done) {
      sessionStorage.setItem('justwooord_session', JSON.stringify({
        cards, current, mode, direction, limit, summary, lessonId,
      }))
    }
  }, [cards, current, mode, direction, started, done, lessonId, limit, summary])

  const resumeSession = () => {
    if (!savedSession) return
    setCards(savedSession.cards)
    setCurrent(savedSession.current)
    setMode(savedSession.mode || 'typing')
    setDirection(savedSession.direction || 'fr_nl')
    setLimit(savedSession.limit || 20)
    setSummary(savedSession.summary || {})
    setSavedSession(null)
    setStarted(true)
  }

  const clearSavedSession = () => {
    sessionStorage.removeItem('justwooord_session')
    setSavedSession(null)
  }

  const startSession = async () => {
    clearSavedSession()
    setLoading(true)
    try {
      const url = `/review_cards/due?limit=${limit}${lessonId ? `&lesson_id=${lessonId}` : ''}`
      const res = await apiClient.get(url)
      setCards(res.data)
      setSummary({})
      setCurrent(0)
      setStarted(true)
    } catch {}
    setLoading(false)
  }

  const handleRate = useCallback(async (cardId, quality, requeue) => {
    try {
      await apiClient.patch(`/review_cards/${cardId}`, { quality })
    } catch {}

    setCards(prevCards => {
      const newCards = [...prevCards]
      const card = newCards[current]

      setSummary(prev => ({
        ...prev,
        [card.id]: { card, mastered: !requeue, easy: !requeue && quality === 3 }
      }))

      if (requeue) {
        newCards.splice(current, 1)
        const remaining = newCards.length - current
        if (remaining === 0) {
          setDone(true)
          sessionStorage.removeItem('justwooord_session')
          return newCards
        }
        const insertAt = current + 1 + Math.floor(Math.random() * remaining)
        newCards.splice(insertAt, 0, card)
        return newCards
      } else {
        const nextIndex = current + 1
        if (nextIndex >= newCards.length) {
          setDone(true)
          sessionStorage.removeItem('justwooord_session')
        } else {
          setCurrent(nextIndex)
        }
        return newCards
      }
    })
  }, [current])

  if (loading) return (
    <Layout>
      <div className="text-sm text-gray-400 mt-10 text-center">Chargement...</div>
    </Layout>
  )

  if (!started) return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1" style={{ color: '#1B2A4A' }}>
          {lessonId ? 'Révision - leçon' : 'Révision'}
        </h1>
        <p className="text-sm" style={{ color: '#9BA3AF' }}>
          {totalDue} mot{totalDue > 1 ? 's' : ''} disponible{totalDue > 1 ? 's' : ''}
        </p>
      </div>

      {savedSession && (
        <div className="rounded-xl p-4 mb-4 w-full max-w-lg flex items-center justify-between gap-4" style={{ background: '#EEF2FA', border: '1px solid #D0DCF0' }}>
          <div>
            <div className="text-sm font-medium" style={{ color: '#1B2A4A' }}>Session en cours</div>
            <div className="text-xs mt-0.5" style={{ color: '#9BA3AF' }}>
              Mot {savedSession.current + 1} sur {savedSession.cards.length}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={resumeSession} className="text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90" style={{ background: '#1B2A4A', color: 'white', border: 'none', cursor: 'pointer' }}>
              Reprendre
            </button>
            <button onClick={clearSavedSession} className="text-xs px-3 py-1.5 rounded-lg transition-colors" style={{ color: '#9BA3AF', background: 'none', border: '1px solid #E2E8F4', cursor: 'pointer' }}>
              Ignorer
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl p-5 w-full max-w-lg" style={{ background: 'white', border: '1px solid #E2E8F4' }}>
        <div className="text-xs font-medium mb-4 tracking-widest uppercase" style={{ color: '#4A7FCB' }}>
          Combien de mots aujourd'hui ?
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[10, 20, 30].map(n => (
            <button
              key={n}
              onClick={() => setLimit(n)}
              className="py-3 rounded-lg text-sm font-medium transition-all"
              style={{ background: limit === n ? '#1B2A4A' : '#EEF2FA', color: limit === n ? 'white' : '#1B2A4A', border: 'none', cursor: 'pointer' }}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-5">
          {['fr_nl', 'nl_fr'].map(d => (
            <button
              key={d}
              onClick={() => setDirection(d)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: direction === d ? '#1B2A4A' : '#EEF2FA', color: direction === d ? 'white' : '#1B2A4A', border: 'none', cursor: 'pointer' }}
            >
              {d === 'fr_nl' ? 'FR → NL' : 'NL → FR'}
            </button>
          ))}
        </div>

        {limit > totalDue && totalDue > 0 && (
          <p className="text-xs mb-4" style={{ color: '#9BA3AF' }}>
            Seulement {totalDue} mot{totalDue > 1 ? 's' : ''} disponible{totalDue > 1 ? 's' : ''} aujourd'hui.
          </p>
        )}

        <button
          onClick={startSession}
          disabled={totalDue === 0}
          className="w-full rounded-lg py-3 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ background: '#1B2A4A', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Nouvelle session
        </button>

        {totalDue === 0 && (
          <p className="text-xs mt-3 text-center" style={{ color: '#9BA3AF' }}>
            Aucun mot à réviser pour l'instant.
          </p>
        )}
      </div>
    </Layout>
  )

  if (done) {
    const masteredEasy = Object.values(summary).filter(s => s.mastered && s.easy).map(s => s.card)
    const masteredHard = Object.values(summary).filter(s => s.mastered && !s.easy).map(s => s.card)
    const missedCards = Object.values(summary).filter(s => !s.mastered).map(s => s.card)

    return (
      <Layout>
        <div className="max-w-2xl mx-auto mt-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">✓</div>
            <h2 className="text-xl font-semibold mb-1" style={{ color: '#1B2A4A' }}>Session terminée</h2>
            <p className="text-sm" style={{ color: '#9BA3AF' }}>
              {masteredEasy.length + masteredHard.length} mot{(masteredEasy.length + masteredHard.length) > 1 ? 's' : ''} maîtrisé{(masteredEasy.length + masteredHard.length) > 1 ? 's' : ''} · {missedCards.length} à retravailler
            </p>
          </div>

          <div className="rounded-xl p-5 mb-4" style={{ background: 'white', border: '1px solid #E2E8F4' }}>
            {masteredEasy.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: '#4A7FCB' }}>
                  Connus du premier coup ({masteredEasy.length})
                </div>
                <div className="space-y-1.5">
                  {masteredEasy.map(card => (
                    <div key={card.id} className="text-sm flex items-center justify-between gap-4">
                      <span className="font-medium" style={{ color: '#1B2A4A' }}>{card.word?.dutch}</span>
                      <span style={{ color: '#9BA3AF' }}>{card.word?.french}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {masteredHard.length > 0 && (
              <div className={masteredEasy.length > 0 ? 'pt-4 border-t border-gray-100 mb-4' : 'mb-4'}>
                <div className="text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: '#9BA3AF' }}>
                  Trouvés avec effort ({masteredHard.length}) · revu dans 3 j.
                </div>
                <div className="space-y-1.5">
                  {masteredHard.map(card => (
                    <div key={card.id} className="text-sm flex items-center justify-between gap-4">
                      <span className="font-medium" style={{ color: '#1B2A4A' }}>{card.word?.dutch}</span>
                      <span style={{ color: '#9BA3AF' }}>{card.word?.french}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {missedCards.length > 0 && (
              <div className={(masteredEasy.length > 0 || masteredHard.length > 0) ? 'pt-4 border-t border-gray-100' : ''}>
                <div className="text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: '#92400E' }}>
                  À retravailler ({missedCards.length}) · revu demain
                </div>
                <div className="space-y-1.5">
                  {missedCards.map(card => (
                    <div key={card.id} className="text-sm flex items-center justify-between gap-4">
                      <span className="font-medium" style={{ color: '#1B2A4A' }}>{card.word?.dutch}</span>
                      <span style={{ color: '#9BA3AF' }}>{card.word?.french}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={() => { setStarted(false); setDone(false); setCurrent(0); setCards([]); setSummary({}) }}
              className="rounded-lg px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: '#1B2A4A', border: 'none', cursor: 'pointer' }}
            >
              Nouvelle session
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const currentCard = cards[current]
  const hasExample = currentCard?.word?.example_nl

  return (
    <Layout>
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#1B2A4A' }}>
            {lessonId ? 'Révision - leçon' : 'Révision'}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#9BA3AF' }}>
            {direction === 'fr_nl' ? 'FR vers NL' : 'NL vers FR'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg p-1" style={{ background: '#EEF2FA' }}>
            <button
              onClick={() => setMode('typing')}
              className="px-2 md:px-3 py-1.5 text-xs rounded-md transition-colors"
              style={{ background: mode === 'typing' ? 'white' : 'transparent', color: mode === 'typing' ? '#1B2A4A' : '#9BA3AF', border: 'none', cursor: 'pointer' }}
            >
              Frappe
            </button>
            {direction === 'fr_nl' && (
              <button
                onClick={() => setMode('contexte')}
                className="px-2 md:px-3 py-1.5 text-xs rounded-md transition-colors"
                style={{ background: mode === 'contexte' ? 'white' : 'transparent', color: mode === 'contexte' ? '#1B2A4A' : '#9BA3AF', border: 'none', cursor: 'pointer' }}
              >
                Contexte
              </button>
            )}
            <button
              onClick={() => setMode('flashcard')}
              className="px-2 md:px-3 py-1.5 text-xs rounded-md transition-colors"
              style={{ background: mode === 'flashcard' ? 'white' : 'transparent', color: mode === 'flashcard' ? '#1B2A4A' : '#9BA3AF', border: 'none', cursor: 'pointer' }}
            >
              Flashcard
            </button>
          </div>
          <div className="text-sm" style={{ color: '#9BA3AF' }}>{current + 1}/{cards.length}</div>
        </div>
      </div>

      <div className="mb-4 md:mb-6">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: '#EEF2FA' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(current / cards.length) * 100}%`, background: '#4A7FCB' }}
          />
        </div>
      </div>

      {mode === 'typing' && <TypingCard card={currentCard} onRate={handleRate} direction={direction} />}
      {mode === 'contexte' && direction === 'fr_nl' && (
        hasExample
          ? <ContextCard card={currentCard} onRate={handleRate} />
          : <div className="w-full max-w-xl mx-auto">
              <div className="rounded-xl p-3 mb-3 text-center text-xs" style={{ background: '#EEF2FA', color: '#4A7FCB' }}>
                Pas d'exemple pour ce mot - mode frappe activé.
              </div>
              <TypingCard card={currentCard} onRate={handleRate} direction={direction} />
            </div>
      )}
      {mode === 'flashcard' && <FlipCard card={currentCard} onRate={handleRate} direction={direction} />}
    </Layout>
  )
}
