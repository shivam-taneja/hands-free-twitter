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

function getActiveEditor(): HTMLElement | null {
  return document.querySelector(
    'div[contenteditable="true"][data-testid^="tweetTextarea_"]'
  )
}

function getComposerRoot(editor: HTMLElement): HTMLElement | null {
  return editor.closest('[data-rbd-droppable-id^="composer-"]')
}

function insertText(text: string) {
  const editor = getActiveEditor()
  if (!editor) {
    toast.error('Focus a tweet editor first')
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

function injectMicNearEditor() {
  const editor = getActiveEditor()
  if (!editor) return

  const composerRoot = getComposerRoot(editor)
  if (!composerRoot) return

  if (composerRoot.querySelector(`#${projectName}-mic`)) return

  const mount = document.createElement('div')
  mount.id = `${projectName}-mic`
  mount.style.marginTop = '6px'
  mount.style.display = 'flex'
  mount.style.alignItems = 'center'

  composerRoot.appendChild(mount)

  const root = createRoot(mount)
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

const observer = new MutationObserver(injectMicNearEditor)
observer.observe(document.body, { childList: true, subtree: true })
injectMicNearEditor()

function isLoggedIn(): boolean {
  return !!document.querySelector('[aria-label="Profile"]')
}

function openComposer(): Promise<boolean> {
  return new Promise((resolve) => {
    const postBtn = document.querySelector(
      'a[data-testid="SideNav_NewTweet_Button"]'
    ) as HTMLElement | null

    if (!postBtn) return resolve(false)

    postBtn.click()

    const start = Date.now()
    const interval = setInterval(() => {
      const editor = getActiveEditor()
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

  if (
    message.type === 'OPEN_COMPOSER_AND_DICTATE' ||
    message.type === 'POST_TWEET'
  ) {
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
