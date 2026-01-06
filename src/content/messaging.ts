import { startDictation } from './speech/commands'
import { isLoggedIn } from './twitter/auth'
import { openComposer } from './twitter/composer'

export function setupMessageListener() {
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
}