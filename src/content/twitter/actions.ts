import { toast } from 'react-toastify'
import { insertText } from './composer'
import { getActiveEditor, getLikeButton, getReplyButton, getRetweetButton } from './dom'

export function likeCurrentTweet(): boolean {
  const likeButton = getLikeButton()

  if (!likeButton) {
    toast.error('No tweet found to like')
    return false
  }

  const isCurrentlyLiked =
    likeButton.getAttribute('data-testid') === 'unlike'

  likeButton.click()

  if (isCurrentlyLiked) {
    toast.success('✓ Tweet unliked')
  } else {
    toast.success('✓ Tweet liked')
  }

  return true
}

export function openReplyAndInsert(text: string): boolean {
  const replyButton = getReplyButton()

  if (!replyButton) {
    toast.error('No tweet found to reply to')
    return false
  }

  replyButton.click()

  // Wait for reply composer to open
  setTimeout(() => {
    const editor = getActiveEditor()

    if (editor) {
      insertText(text)
      toast.success('✓ Reply composed')
    }
  }, 500)

  return true
}

export function retweetCurrent(): boolean {
  const retweetButton = getRetweetButton()

  if (!retweetButton) {
    toast.error('No tweet found to repost')
    return false
  }

  const testId = retweetButton.dataset.testid
  const isCurrentlyReposted = testId === 'unretweet'

  retweetButton.click()

  setTimeout(() => {
    const confirmSelector = isCurrentlyReposted
      ? '[data-testid="unretweetConfirm"]'
      : '[data-testid="retweetConfirm"]'

    const confirmButton = document.querySelector<HTMLElement>(
      confirmSelector
    )

    if (!confirmButton) {
      toast.error('Failed to change repost state')
      return
    }

    confirmButton.click()

    toast.success(
      isCurrentlyReposted ? '✓ Repost undone' : '✓ Reposted'
    )
  }, 300)

  return true
}
