import { useTheme } from '@/theme/useTheme'
import { ToastContainer } from 'react-toastify'

export function ToastRoot() {
  const { isDark } = useTheme()

  return (
    <ToastContainer
      position="bottom-center"
      autoClose={3000}
      hideProgressBar
      closeButton={false}
      newestOnTop
      pauseOnHover={false}
      theme={isDark ? 'dark' : 'light'}
    />
  )
}
