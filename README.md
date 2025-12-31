# Hands-Free Twitter (X) - WIP

- Hands-Free Twitter is an experimental Chrome extension that allows you to compose and post tweets using your voice.

- The project was built to solve a real usability problem: using Twitter when typing is inconvenient (wearing gloves, eating, or simply wanting a hands-free experience).

- The long-term goal of this project is to enable full voice-based interaction with Twitter.

## Features

- Voice dictation for composing tweets.
- Automatically opens the tweet composer.
- Inserts dictated text directly into the Twitter editor.
- Injects a microphone (“Dictate”) button into the Twitter UI.
- Popup controls for starting dictation and posting.
- Light and dark theme support.
- Error handling for login and speech recognition issues.

## Tech Stack

- React 19 + TypeScript  
- Vite  
- CRXJS (Chrome Extension tooling)  
- Tailwind CSS  
- Web Speech API  

## Quick Start

1. Clone the repo `git clone https://github.com/shivam-taneja/hands-free-twitter.git`.
2. Change directory `cd hands-free-twitter`.
3. Install dependencies: `pnpm install`.
4. Start development server: `pnpm run dev`.
5. Load the extension in Chrome:
   1. Open `chrome://extensions/`.
   2. Enable Developer mode.
   3. Click Load unpacked.
   4. Select the `dist/` directory generated in `hands-free-twitter` folder.

## Project Structure
```
src/
├── content/        # Content scripts (Twitter integration)
├── popup/          # Extension popup UI
├── components/     # Shared React components
├── theme/          # Theme and color utilities
├── utils/          # Helper utilities
manifest.config.ts  # CRXJS manifest configuration
```

## How It Works
- A content script observes Twitter’s DOM and injects a microphone button into the tweet composer.
- When activated, the browser’s Speech Recognition API converts speech into text.
- The dictated text is inserted directly into Twitter’s editable composer.
- The popup communicates with the active tab to open the composer and start dictation.
  
## Current Limitations
- English (en-US) speech recognition only.
- Limited to composing and posting tweets.
- Relies on Twitter/X DOM structure, which may change.
- No advanced natural language command parsing yet.

## Future Goals
- Full voice navigation across Twitter.
- Voice commands for likes, replies, and retweets.
- Improved speech intent detection.
- Reduced dependency on fragile DOM selectors.

## Disclaimer
- This project is experimental and not affiliated with Twitter/X.

## About Me
- I’m `Shivam Taneja`, a full-stack developer.
- I enjoy building clean user interfaces, smooth user experiences, and robust software solutions.
- Outside of coding, I create content and continue to learn new technologies.
- My Socials:
  - [Website](https://www.shivamtaneja.com/)
  - [GitHub](https://github.com/shivam-taneja)
  - [LinkedIn](https://www.linkedin.com/in/shivam-taneja/)
  - [X (Twitter)](https://twitter.com/codesbyshivam)