import { toast } from 'react-toastify'
import { getActiveEditor, getPostButton } from './dom'

export function insertText(text: string) {
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

export function openComposer(): Promise<boolean> {
  return new Promise((resolve) => {
    const postBtn = getPostButton()
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