# Anti-work Screamer 🔊

A Chrome extension that screams at you using AI-generated voices when you open a non-work related tab during a Pomodoro timer session.

## What it does

- Starts a 25 minute Pomodoro timer from the popup
- Monitors every tab you open while the timer is running
- If you navigate to a distraction site (YouTube, Reddit, Netflix, etc.) it automatically closes the tab and plays a random AI voice message yelling at you to get back to work
- Shows all your open tabs in the popup with the ability to close them individually

## Files

```
anti-work-screamer/
├── manifest.json       # Extension configuration
├── background.js       # Service worker — runs the timer and monitors tabs
├── popup.html          # The UI shown when you click the extension icon
├── popup.js            # Logic for the popup — tab list and timer display
├── offscreen.html      # Hidden page used to play audio
├── offscreen.js        # Receives audio data and plays it
├── options.html        # Settings page for entering your API key
└── options.js          # Saves and loads the API key from local storage
```

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/anti-work-screamer.git
```

### 2. Load the extension in Chrome
1. Open Chrome and go to `chrome://extensions`
2. Toggle **Developer mode** on (top right)
3. Click **Load unpacked**
4. Select the `anti-work-screamer` folder

### 3. Add your ElevenLabs API key
1. Right-click the extension icon in your toolbar
2. Click **Options**
3. Paste your ElevenLabs API key and click **Save**

Your API key is stored locally on your machine only and is never committed to the repo.

### 4. Get an ElevenLabs API key
Sign up at [elevenlabs.io](https://elevenlabs.io) and grab your API key from the dashboard.

## How to use

1. Click the extension icon in your toolbar
2. Press **Start** to begin the 25 minute Pomodoro session
3. Try to open YouTube — we dare you
4. Press **Stop** to end the session and disable blocking

## Blocked sites

The extension blocks 60+ sites across these categories:

- Video — YouTube, Netflix, Twitch, TikTok, Disney+, and more
- Social media — Instagram, Facebook, Twitter, Reddit, and more
- Gaming — Steam, Epic Games, Chess.com, and more
- Shopping — Amazon, eBay, Etsy, and more
- Sports, Music, Memes, Dating, Gambling

To add or remove sites, edit the `nonWorkSites` array in `background.js`.

## Voice messages

The extension picks from 35 randomised messages across 6 different AI voices. Categories include disappointed, aggressive, sarcastic, motivational, threatening, and guilt-tripping.

To add your own messages, edit the `messages` array in the `screamAtUser` function in `background.js`.

## Privacy

- Your API key is stored using `chrome.storage.local` — it never leaves your machine
- No data is collected or sent anywhere except to the ElevenLabs API to generate audio
- The `.env` file (if used locally) is gitignored and never committed

## Requirements

- Google Chrome
- An ElevenLabs account (free tier works)
