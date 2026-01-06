export type RecorderState = 'idle' | 'listening'

let recorderState: RecorderState = 'idle'
const listeners = new Set<(state: RecorderState) => void>()

export function getRecorderState(): RecorderState {
  return recorderState
}

export function setRecorderState(state: RecorderState) {
  recorderState = state
  listeners.forEach((l) => l(state))
}

export function subscribeRecorder(listener: (state: RecorderState) => void) {
  listeners.add(listener)
  listener(recorderState)

  return () => {
    listeners.delete(listener)
  }
}