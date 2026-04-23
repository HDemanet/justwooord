import { useSpeech } from '../../hooks/useSpeech'

export default function AudioButton({ text, className = '' }) {
  const { speak, supported } = useSpeech()

  if (!supported) return null

  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={`Écouter la prononciation de : ${text}`}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${className}`}
      style={{ color: '#9BA3AF', background: 'transparent', border: '2px solid transparent', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.color = '#4A7FCB'; e.currentTarget.style.background = '#EEF2FA' }}
      onMouseLeave={e => { e.currentTarget.style.color = '#9BA3AF'; e.currentTarget.style.background = 'transparent' }}
      onFocus={e => { e.currentTarget.style.outline = '2px solid #4A7FCB'; e.currentTarget.style.outlineOffset = '2px' }}
      onBlur={e => { e.currentTarget.style.outline = 'none' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      </svg>
    </button>
  )
}
