interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

const SpeechRecognition =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition

export const recognition = new SpeechRecognition()
recognition.lang = 'en-US'
recognition.interimResults = false
recognition.continuous = false

export type { SpeechRecognitionEvent }
