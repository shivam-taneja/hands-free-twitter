export function sendToActiveTab(message: any): Promise<any> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab?.id) return resolve({ ok: false })

      chrome.tabs.sendMessage(tab.id, message, (response) => {
        resolve(response)
      })
    })
  })
}
