export function getActiveEditor(): HTMLElement | null {
  return document.querySelector(
    'div[contenteditable="true"][data-testid^="tweetTextarea_"]'
  )
}

export function getComposerRoot(editor: HTMLElement): HTMLElement | null {
  return editor.closest('[data-rbd-droppable-id^="composer-"]')
}

export function getPostButton(): HTMLElement | null {
  return document.querySelector('a[data-testid="SideNav_NewTweet_Button"]')
}

export function getProfileButton(): HTMLElement | null {
  return document.querySelector('[aria-label="Profile"]')
}