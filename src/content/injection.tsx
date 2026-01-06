import { MicButton } from '@/components/MicButton'
import { ToastRoot } from '@/components/ToastRoot'
import { createRoot } from 'react-dom/client'
import { startDictation, stopDictation } from './speech/commands'
import { getActiveEditor, getComposerRoot } from './twitter/dom'

const PROJECT_NAME = 'HandsFreeTwitter'
const TOAST_ROOT_ID = `${PROJECT_NAME}-toast-root`

function ensureGlobalToastRoot() {
  if (document.getElementById(TOAST_ROOT_ID)) return

  const mount = document.createElement('div')
  mount.id = TOAST_ROOT_ID
  document.body.appendChild(mount)

  const root = createRoot(mount)

  root.render(<ToastRoot />)
}

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
    <MicButton
      onToggle={(isActive) => {
        isActive ? stopDictation() : startDictation()
      }}
    />
  )
}

export function setupObserver() {
  ensureGlobalToastRoot()

  const observer = new MutationObserver(injectMicNearEditor)
  observer.observe(document.body, { childList: true, subtree: true })

  injectMicNearEditor()
}
