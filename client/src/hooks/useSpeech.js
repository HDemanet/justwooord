export function useSpeech() {
  const speak = (text, lang = 'nl-NL') => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  const cancel = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  }

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  return { speak, cancel, supported }
}
