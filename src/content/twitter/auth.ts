import { getProfileButton } from './dom'

export function isLoggedIn(): boolean {
  return !!getProfileButton()
}