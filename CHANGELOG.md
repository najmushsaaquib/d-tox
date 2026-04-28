# Changelog

All notable changes to D-Tox will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.1] - 2026-04-28

### Added
- **Privacy link in popup footer** — every popup now shows a Privacy link pointing to `https://d-tox.najmushsaaquib.com/privacy`
- **homepage_url in manifest** — surfaces `https://d-tox.najmushsaaquib.com` on the Chrome Web Store listing and in `chrome://extensions`

### Changed
- Version bumped to `1.4.1`

---

## [1.4.0] - 2026-04-28

### Fixed
- **Sidebar layout misalignment** — text and metadata no longer bleed outside the video width when Sidebar Recommendations is enabled. Root cause was `max-width: none` removing YouTube's own constraint; replaced with `max-width: 1280px; width: 100%` so content stays centered and bounded to the player width (#7)
- **Toggle performance lag** — removed `void document.body.offsetHeight` forced synchronous reflow that was called on every toggle. Updating a `<style>` tag does not need a manual reflow trigger, making toggles instant and jank-free (#7)
- **Occasional "needs reload" after navigation** — added a second `apply()` call 600 ms after `yt-navigate-finish` to catch YouTube polymer elements that finish upgrading after the event fires. Eliminates most cases where a toggle appeared to do nothing until reload (#7)
- **Shorts/Explore toggle needs two clicks** — `startMarkers()` was guarded with `if (!markerInterval)` causing it to keep a stale settings closure when re-toggled. Now always restarts the interval so the latest settings are captured (#7)
- **Unhandled promise rejection in popup** — `chrome.tabs.sendMessage` was not awaited; added `.catch(() => {})` to silence the "Receiving end does not exist" rejection when the content script hasn't loaded yet

### Changed
- **Welcome page** — on first install, opens `https://d-tox.najmushsaaquib.com/welcome` instead of the bundled `welcome.html`
- **Navigation fallback removed** — 1-second `setInterval` URL polling used as nav fallback is removed; `yt-navigate-finish` + the 600 ms delayed re-apply is sufficient and eliminates constant background timer load

---

## [1.3.0] - 2026-03-31

### Added
- **Pure CSS Shorts blocking** — `ytd-video-renderer:has(a#thumbnail[href^="/shorts/"])` hides individual Shorts in search results instantly, no JS scanning needed
- **New YouTube DOM support** — targets `grid-shelf-view-model`, `ytm-shorts-lockup-view-model`, `ytm-shorts-lockup-view-model-v2` (YouTube 2025+ elements)
- **Shorts filter chip hiding** — the "Shorts" chip in search filter bar is now hidden via JS marker + CSS
- **Instant toggle feedback** — popup sends `chrome.tabs.sendMessage()` directly to content script; no waiting for storage events
- **Layout reflow guarantee** — `void document.body.offsetHeight` after every CSS update forces immediate visual changes
- **YouTube SPA event listener** — uses native `yt-navigate-finish` event instead of heavy MutationObserver for page navigation detection
- **Style tag watchdog** — monitors `<head>` for removal of D-Tox style tag and re-injects immediately
- **Explore section JS marker** — marks guide sections containing Trending/Shopping/Gaming for reliable hiding

### Fixed
- **Shorts reload loop** — removed blanket `grid-shelf-view-model` and `[is-shorts]` selectors that hid all search content, causing infinite scroll cascade
- **Sidebar not centering on toggle** — added `#primary { max-width: none !important }` to override YouTube's locked two-column width
- **Header toggle leaving gap** — added `ytd-page-manager { margin-top: 0 !important }` to remove 56px placeholder
- **Style tag removal loop** — `injectStyles` now updates `textContent` in-place instead of remove+recreate cycle
- **Explore section not hiding** — replaced individual link targeting with whole `ytd-guide-section-renderer` targeting via `:has()` and JS marker

### Changed
- Shorts hiding moved from JS marker approach to pure CSS `:has()` selectors for zero-latency hiding
- Navigation detection changed from `MutationObserver(body, subtree)` to `yt-navigate-finish` event + lightweight `setInterval(1000)` fallback
- Element marker interval reduced from aggressive MutationObserver to calm `setInterval(2000)`
- Annotations description updated to "Hides info cards, end screens and clickable overlay links that appear during videos"

### Removed
- Broken `[is-shorts]` blanket CSS selector
- Heavy `MutationObserver` on `document.body` with `subtree: true`
- JS-based Shorts marking for search results (replaced by pure CSS)

---

## [1.2.0] - 2026-03-31

### Added
- **Support modal** — replaces bare UPI link with a polished slide-up modal containing two clear sections:
  - *Share* — prompts users to share the extension with friends/family as the primary form of support
  - *Financial* — PayPal (clickable, opens in new tab) and UPI ID (`yesnajmush@ybl`) displayed inline with a one-click copy button
- **Bug Report Google Form** — accessible to all users regardless of technical ability; replaces direct GitHub Issues link. Form includes browser, page context, frequency, and optional screenshot link fields. GitHub Issues link added at the bottom of the form itself for developers.
- UPI hint text ("GPay · PhonePe · Paytm · any UPI app") shown inline — no tooltip friction

### Changed
- "Donate" renamed to "Support" throughout (footer + More tab) with 🤝 icon to avoid conflict with ❤️ in "Made with love" sign-off
- Support footer button no longer links directly to UPI — opens modal instead

### Fixed
- Removed broken hover tooltip on UPI hint that was obscuring the UPI ID and rendering outside the modal bounds

---

## [1.1.1] - 2026-03-26

### Added
- "Made with ❤️ by Najmush" in footer and More tab now links to GitHub profile
- Welcome page: D-Tox logo pill is now fully non-selectable (`user-select: none`, `cursor: default`) — behaves as a single atomic logo unit

### Fixed
- Version label in More tab was hardcoded to `v1.0.1` — now reads dynamically from manifest
- Text cursor appearing on hover over logo pill text in welcome page

### Changed
- Welcome page store badge detects browser at runtime (Chrome/Brave, Firefox, Edge) and shows the correct store name

---

## [1.1.0] - 2026-03-25

### Added
- New D-Tox brand icon: play-button triangle shape, red body + blue tip (active), colors swap fully when paused
- Dynamic toolbar icon swap via `chrome.action.setIcon()` — reflects active/paused state in real time
- Welcome page shown on first install (Matrix red/blue pill concept, hands image, store badge)
- Browser store badge auto-detects Chrome/Firefox/Edge and links to the appropriate store listing
- Brand tokens documented in `assets/brand.md`

### Changed
- Replaced hover tooltips with always-visible subtitle descriptions under each toggle (iOS Settings pattern)
- Extension renamed from `youtube-declutter` to `D-Tox` throughout codebase, manifest, and GitHub

### Fixed
- Popup logo now correctly reflects paused state (red↔blue color swap)

---

## [1.0.1] - 2026-03-24

### Fixed
- Tooltip overlap: tooltips on toggle items were covering adjacent rows
- Request Feature button now opens Google Form directly

---

## [1.0.0] - 2026-03-23

### Added
- 20 toggle controls across 5 categories (Feed, Interface, Content, Discovery, Controls)
- 4 preset profiles: Minimal, Focus, Light, Custom
- Master on/off toggle to pause/resume the extension
- Tab-based popup UI (Toggles, Presets, More)
- Tooltip descriptions on hover for each toggle
- Export/Import settings as JSON
- Reset to defaults
- Donate via UPI support
- Request a Feature (Google Form)
- Report a Bug (GitHub Issues)
- Star on GitHub link
- Cross-browser support (Chrome, Brave, Edge, Firefox via WXT)
- Content script with MutationObserver for YouTube's dynamic DOM
- localStorage fallback for development/testing outside extension context
