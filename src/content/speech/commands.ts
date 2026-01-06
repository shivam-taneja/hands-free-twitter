import { toast } from 'react-toastify'
import { insertText } from '../twitter/composer'
import { recognition, SpeechRecognitionEvent } from './recognition'
import { getRecorderState, setRecorderState } from './recorder'

export type VoiceCommand =
  | { type: 'like' }
  | { type: 'reply'; text?: string }
  | { type: 'retweet' }
  | { type: 'compose'; text: string }

export function parseVoiceCommand(transcript: string): VoiceCommand | null {
  const lower = transcript.toLowerCase().trim()

  // Like commands
  if (lower.includes('like this') || lower === 'like') {
    return { type: 'like' }
  }

  // Reply commands
  if (lower.startsWith('reply') || lower.startsWith('respond')) {
    const text = transcript.replace(/^(reply|respond)\s*/i, '').trim()
    return { type: 'reply', text: text || undefined }
  }

  // Retweet commands
  if (lower.includes('retweet') || lower.includes('re tweet')) {
    return { type: 'retweet' }
  }

  // Default: compose new tweet
  return { type: 'compose', text: transcript }
}

export function executeCommand(command: VoiceCommand) {
  switch (command.type) {
    case 'like':
      break
    case 'reply':
      if (command.text) {
      } else {
        toast.info('Say "reply [your message]" to compose')
      }
      break
    case 'retweet':
      break
    case 'compose':
      insertText(command.text)
      break
  }
}

export function startDictation() {
  if (getRecorderState() === 'listening') return

  setRecorderState('listening')

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript

    // Try to parse as command first
    const command = parseVoiceCommand(transcript)

    if (command) {
      executeCommand(command)
    } else {
      insertText(transcript)
    }

    stopDictation()
  }

  recognition.onerror = (e: any) => {
    toast.error(e.error || 'Speech recognition failed')
    stopDictation()
  }

  recognition.onend = () => setRecorderState('idle')

  try {
    recognition.start()
  } catch {
    setRecorderState('idle')
  }
}

export function stopDictation() {
  try {
    recognition.stop()
  } catch { }
  setRecorderState('idle')
}