# D-Tox: YouTube Detox

Reclaim your attention. D-Tox is a browser extension that strips away YouTube's addictive elements so you only see what you intentionally search for.

## Why

YouTube's algorithm is designed to keep you scrolling. Home feed, Shorts, sidebar recommendations, autoplay - they all exist to maximize your watch time, not your well-being. D-Tox puts you back in control.

## Features

**20 toggle controls** across 5 categories:

| Category | Controls |
|----------|----------|
| Feed | Home Feed, Sidebar, Shorts, Playlists, Mixes, More From YouTube |
| Interface | Comments, Profile Photos, Header, Notifications |
| Content | Live Chat, Fundraiser, Screen Feed, Screen Cards, Merch/Tickets, Video Info |
| Discovery | Explore/Trending, Search Filters |
| Controls | Autoplay, Annotations |

**4 presets** for quick setup:
- **Minimal** - Only search + player. Maximum focus.
- **Focus** - Keep sidebar, hide distractions.
- **Light** - Subtle tweaks, mostly untouched.
- **Custom** - You decide what stays.

**Master toggle** - Pause/enable D-Tox instantly from the header.

**Cross-browser** - Works on Chrome, Brave, Edge, and Firefox.

## Install

### From source

```bash
git clone https://github.com/najmushsaaquib/d-tox.git
cd d-tox
npm install
npm run build
```

Then load the extension:

- **Chrome/Brave/Edge**: Go to `chrome://extensions/` > Enable Developer Mode > Load Unpacked > Select `dist/chrome-mv3/`
- **Firefox**: Go to `about:debugging` > This Firefox > Load Temporary Add-on > Select `dist/chrome-mv3/manifest.json`

### Development

```bash
npm run dev          # Dev server with HMR
npm run build        # Production build (Chrome)
npm run build:firefox # Production build (Firefox)
```

## Project Structure

```
d-tox/
├── entrypoints/           # WXT entry points
│   ├── popup/             # Extension popup (main UI)
│   ├── options/           # Options page (redirect)
│   ├── content.ts         # YouTube DOM manipulation
│   ├── background.ts      # Service worker
│   └── styles/            # CSS
├── src/
│   ├── utils/             # Storage, CSS injection, types
│   └── constants/         # YouTube element selectors
├── public/                # Icons
├── dist/                  # Build output (load this in browser)
├── wxt.config.ts          # WXT configuration
└── package.json
```

## How It Works

1. **Content script** runs on youtube.com pages
2. Reads your toggle settings from Chrome Storage
3. Injects CSS rules to hide selected elements (`display: none !important`)
4. Uses a MutationObserver to handle YouTube's dynamic content loading
5. Master toggle can pause all rules instantly

## Contributing

Contributions welcome! Fork, create a branch, make your changes, and submit a PR.

### Adding a new toggle

1. Add the field to `Settings` in `src/utils/types.ts`
2. Add metadata to `FEATURE_METADATA` in the same file
3. Add CSS selector to `HIDE_CSS_RULES` in `src/constants/youtube-elements.ts`
4. Add mapping in `settingToCss` in `src/utils/css-injector.ts`

## Tech Stack

- **WXT** - Cross-browser extension framework
- **React 19** - UI
- **TypeScript** - Type safety
- **Chrome Storage API** - Settings persistence

## Support

- **Donate**: UPI `yesnajmush@ybl`
- **Feature Request**: [Google Form](https://docs.google.com/forms)
- **Bug Report**: [GitHub Issues](https://github.com/najmushsaaquib/d-tox/issues)

## License

MIT

---

Made with love by [Najmush](https://najmushsaaquib.com)
