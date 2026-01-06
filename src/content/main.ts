import 'react-toastify/dist/ReactToastify.css'
import { setupObserver } from './injection'
import { setupMessageListener } from './messaging'

const projectName = 'HandsFreeTwitter'

console.log(`[${projectName}] content script loaded`)

// Initialize
setupObserver()
setupMessageListener()

export { subscribeRecorder } from './speech/recorder'

