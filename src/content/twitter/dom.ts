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

export function getReplyButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(
    'button[data-testid="reply"]'
  )
}

export function getRetweetButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(
    'button[data-testid="retweet"], button[data-testid="unretweet"]'
  )
}

export function getLikeButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(
    'button[data-testid="like"], button[data-testid="unlike"]'
  )
}