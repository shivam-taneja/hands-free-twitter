import { useTheme } from '@/theme/useTheme'
import { sendToActiveTab } from '@/utils/sendToActiveTab'
import { useState } from 'react'
import './index.css'

export default function App() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { isDark, theme, colors } = useTheme()

  async function startDictation() {
    setError(null)
    setIsLoading(true)

    const res = await sendToActiveTab({
      type: 'OPEN_COMPOSER_AND_DICTATE',
    })

    setIsLoading(false)
    if (res?.error === 'NOT_LOGGED_IN') {
      setError('Please log in to X (Twitter) first.')
    }
  }

  async function postNow() {
    setError(null)
    setIsLoading(true)

    const res = await sendToActiveTab({ type: 'POST_TWEET' })

    setIsLoading(false)
    if (res?.error === 'NOT_LOGGED_IN') {
      setError('Please log in to X (Twitter) first.')
    }
  }

  return (
    <div
      className="w-80"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      <div
        className="px-4 py-3"
        style={{
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <h1 className="text-xl font-bold" style={{ color: theme.text }}>
          Hands-Free X
        </h1>
        <p className="text-sm mt-0.5" style={{ color: theme.muted }}>
          Dictate and post without typing
        </p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {error && (
          <div
            className="text-sm py-3 px-3 rounded-lg"
            style={{
              backgroundColor: theme.dangerBg,
              color: theme.danger,
              border: `1px solid ${isDark ? 'rgba(244,33,46,0.3)' : 'rgba(244,33,46,0.2)'
                }`,
            }}
          >
            {error}
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={startDictation}
            disabled={isLoading}
            className="w-full px-4 py-2.5 font-medium text-sm cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.twitterBlue,
              color: '#FFFFFF',
              borderRadius: '9999px',
              border: 'none',
              transition: 'background-color 120ms ease',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#1A8CD8'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.twitterBlue
            }}
          >
            {isLoading ? 'Starting…' : 'Start Dictation'}
          </button>

          <button
            onClick={postNow}
            disabled={isLoading}
            className="w-full px-4 py-2.5 font-medium text-sm cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'transparent',
              color: theme.text,
              borderRadius: '9999px',
              border: `1px solid ${theme.buttonBorder}`,
              transition: 'background-color 120ms ease, border-color 120ms ease',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = isDark
                  ? 'rgba(239,243,244,0.1)'
                  : 'rgba(15,20,25,0.1)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {isLoading ? 'Posting…' : 'Post Now'}
          </button>
        </div>

        <p className="text-xs text-center pt-1" style={{ color: theme.muted }}>
          Ensure you're logged in to X
        </p>
      </div>
    </div>
  )
}
