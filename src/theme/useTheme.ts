import { useEffect, useState } from 'react'
import { colors } from './tokens'

export function useTheme() {
  const [isDark, setIsDark] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)

    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const theme = isDark ? colors.dark : colors.light

  return {
    isDark,
    theme,
    colors,
  }
}
