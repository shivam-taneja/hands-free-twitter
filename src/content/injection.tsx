import { MicButton } from '@/components/MicButton'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { startDictation, stopDictation } from './speech/commands'
import { getActiveEditor, getComposerRoot } from './twitter/dom'

const PROJECT_NAME = 'HandsFreeTwitter'

export function injectMicNearEditor() {
  const editor = getActiveEditor()
  if (!editor) return

  const composerRoot = getComposerRoot(editor)
  if (!composerRoot) return

  if (composerRoot.querySelector(`#${PROJECT_NAME}-mic`)) return

  const mount = document.createElement('div')
  mount.id = `${PROJECT_NAME}-mic`
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

export function setupObserver() {
  const observer = new MutationObserver(injectMicNearEditor)
  observer.observe(document.body, { childList: true, subtree: true })
  injectMicNearEditor()
}