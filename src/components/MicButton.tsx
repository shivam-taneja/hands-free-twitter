import { subscribeRecorder } from '@/content/main'
import { RecorderState } from '@/content/speech/recorder'
import { useTheme } from '@/theme/useTheme'
import { useEffect, useState } from 'react'
import '../popup/index.css'

type MicButtonProps = {
  onToggle: (isActive: boolean) => void
}

export function MicButton({ onToggle }: MicButtonProps) {
  const [state, setState] = useState<RecorderState>('idle')

  useEffect(() => {
    return subscribeRecorder(setState)
  }, [])

  const { isDark, theme, colors } = useTheme()

  const isActive = state === 'listening'

  const borderColor = isActive
    ? colors.twitterBlue
    : theme.buttonBorder

  const bgColor = isActive
    ? isDark
      ? 'rgba(29,155,240,0.15)'
      : 'rgba(29,155,240,0.12)'
    : 'transparent'

  return (
    <button
      type="button"
      title={isActive ? 'Stop dictation' : 'Start dictation'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle(isActive)
      }}
      className="h-8 px-3 border cursor-pointer select-none"
      style={{
        borderColor,
        backgroundColor: bgColor,
        borderRadius: '9999px',
        fontWeight: 500,
        fontSize: '14px',
        transition: 'background-color 120ms ease, border-color 120ms ease',
        lineHeight: '0px',
      }}
    >
      <span
        style={{
          color: colors.twitterBlue,
        }}
      >
        {isActive ? 'Listening…' : 'Dictate'}
      </span>
    </button>
  )
}
