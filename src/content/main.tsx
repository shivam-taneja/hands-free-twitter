import { createRoot } from 'react-dom/client'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { MicButton } from '@/components/MicButton'

const projectName = 'HandsFreeTwitter'

console.log(`[${projectName}] content script loaded`)

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

const SpeechRecognition =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition

const recognition = new SpeechRecognition()
recognition.lang = 'en-US'
recognition.interimResults = false
recognition.continuous = false

type RecorderState = 'idle' | 'listening'
let recorderState: RecorderState = 'idle'

const listeners = new Set<(state: RecorderState) => void>()

function emit(state: RecorderState) {
  recorderState = state
  listeners.forEach((l) => l(state))
}

export function subscribeRecorder(listener: (state: RecorderState) => void) {
  listeners.add(listener)
  listener(recorderState)
  return () => {
    listeners.delete(listener)
  }
}

function getReplyEditor(): HTMLElement | null {
  return document.querySelector(
    'div[data-testid^="tweetTextarea_"][contenteditable="true"]'
  )
}

function insertText(text: string) {
  const editor = getReplyEditor()
  if (!editor) {
    toast.error('Open the composer first')
    return
  }

  editor.focus()
  document.execCommand('insertText', false, text)

  editor.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: text,
    })
  )
}

function startDictation() {
  if (recorderState === 'listening') return

  emit('listening')

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript
    insertText(transcript)
    stopDictation()
  }

  recognition.onerror = (e: any) => {
    toast.error(e.error || 'Speech recognition failed')
    stopDictation()
  }

  recognition.onend = () => emit('idle')

  try {
    recognition.start()
  } catch {
    emit('idle')
  }
}

function stopDictation() {
  try {
    recognition.stop()
  } catch { }
  emit('idle')
}

function injectMicIntoComposer() {
  const audienceButton = document.querySelector(
    'button[aria-label="Choose audience"]'
  )

  if (!audienceButton) return

  const container = audienceButton.parentElement
  if (!container) return

  if (container.querySelector(`#${projectName}-mic`)) return

  container.style.display = 'flex'
  container.style.flexDirection = 'row'
  container.style.gap = '4px'

  const reactMount = document.createElement('div')
  reactMount.id = `${projectName}-mic`
  container.appendChild(reactMount)

  const root = createRoot(reactMount)

  root.render(
    <>
      <MicButton
        onToggle={(isActive) => {
          isActive ? stopDictation() : startDictation()
        }}
      />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        closeButton={false}
        newestOnTop
        pauseOnHover={false}
        theme="dark"
      />
    </>
  )
}

const observer = new MutationObserver(injectMicIntoComposer)
observer.observe(document.body, { childList: true, subtree: true })
injectMicIntoComposer()

/* ---------- NEW LOGIC BELOW ---------- */

function isLoggedIn(): boolean {
  return !!document.querySelector('[aria-label="Profile"]')
}

function openComposer(): Promise<boolean> {
  return new Promise((resolve) => {
    const postBtn = document.querySelector(
      'a[data-testid="SideNav_NewTweet_Button"]'
    ) as HTMLElement | null

    if (!postBtn) {
      resolve(false)
      return
    }

    postBtn.click()

    const start = Date.now()
    const interval = setInterval(() => {
      const editor = getReplyEditor()
      if (editor) {
        clearInterval(interval)
        editor.focus()
        resolve(true)
      }

      if (Date.now() - start > 3000) {
        clearInterval(interval)
        resolve(false)
      }
    }, 100)
  })
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!isLoggedIn()) {
    sendResponse({ ok: false, error: 'NOT_LOGGED_IN' })
    return true
  }

  if (message.type === 'OPEN_COMPOSER_AND_DICTATE' || message.type === 'POST_TWEET') {
    openComposer().then((ok) => {
      if (!ok) {
        sendResponse({ ok: false })
        return
      }

      startDictation()
      sendResponse({ ok: true })
    })
    return true
  }

  return true
})
