/**
 * D-Tox Welcome Page
 *
 * Displayed on first install via chrome.runtime.onInstalled.
 *
 * FUTURE: When your domain is live, replace the chrome.tabs.create call in
 * background.ts with: chrome.tabs.create({ url: 'https://dtox.app/welcome' });
 * This component works as-is in Next.js / Astro — design transfers 1:1.
 */

import React from 'react';

// ── Brand constants ──────────────────────────────────────────────────────────
const DONATE_PAYPAL = 'https://paypal.me/hanjinajmush';
const FEATURE_FORM  = 'https://forms.gle/B1eb14KJGTRoiS179';
const GITHUB_URL    = 'https://github.com/najmushsaaquib/d-tox';

// ── Store URLs ───────────────────────────────────────────────────────────────
// Set to null until published. Once live, paste the store listing URL.
// Chrome/Brave : https://chromewebstore.google.com/detail/d-tox/<extension-id>
// Firefox      : https://addons.mozilla.org/en-US/firefox/addon/d-tox/
// Edge         : https://microsoftedge.microsoft.com/addons/detail/d-tox/<extension-id>
const STORE_URLS = {
  chrome:  null as string | null,
  firefox: null as string | null,
  edge:    null as string | null,
};

// ── Browser detection ────────────────────────────────────────────────────────
type BrowserKey = 'chrome' | 'firefox' | 'edge';

interface BrowserStore {
  key:       BrowserKey;
  name:      string;       // display name in badge
  storeUrl:  string | null;
  icon:      React.ReactNode;
}

function detectBrowser(): BrowserKey {
  const ua = navigator.userAgent;
  if (ua.includes('Edg/'))     return 'edge';
  if (ua.includes('Firefox/')) return 'firefox';
  return 'chrome'; // Chrome, Brave, Opera, and everything else → Chrome Web Store
}

// Simple flat SVG icons for each store
const ChromeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4.5" fill="currentColor" opacity="0.9"/>
    <path d="M12 7.5h8.66A9 9 0 1 0 5.4 19.5L9.73 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M12 7.5H3.34" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M15.87 14.5L19.66 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const FirefoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M12 3C12 3 8 6 8 12s4 9 4 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const EdgeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 16.5C5 16.5 6 20 12 20c5 0 8-3.5 8-7 0-2-1-3.5-3-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M19 9.5C19 5.9 15.9 3 12 3 7.6 3 4 6.6 4 11c0 2.5 1.1 4.7 2.9 6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M8 13.5c0-2.5 2-4 4-4 1.5 0 3 .8 3 2.5S13.5 15 11 15H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function getBrowserStore(): BrowserStore {
  const key = detectBrowser();
  const stores: Record<BrowserKey, BrowserStore> = {
    chrome:  { key: 'chrome',  name: 'Chrome',  storeUrl: STORE_URLS.chrome,  icon: <ChromeIcon /> },
    firefox: { key: 'firefox', name: 'Firefox', storeUrl: STORE_URLS.firefox, icon: <FirefoxIcon /> },
    edge:    { key: 'edge',    name: 'Edge',    storeUrl: STORE_URLS.edge,    icon: <EdgeIcon /> },
  };
  return stores[key];
}

// ── D-Tox logo — play-triangle clipped, red body + blue tip ─────────────────
const DToxLogo = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="logo-clip">
      <path d="M36,26 L36,102 C36,104 38,105 41,103 L102,69 C105,67 105,61 102,59 L41,25 C38,23 36,24 36,26 Z"/>
    </clipPath>
    <g clipPath="url(#logo-clip)">
      <rect x="0" y="0" width="128" height="128" fill="#e53e3e"/>
      <circle cx="102" cy="64" r="26" fill="#60a5fa"/>
    </g>
  </svg>
);

// ── Store badge component ─────────────────────────────────────────────────────
function StoreBadge() {
  const store = getBrowserStore();
  const isLive = !!store.storeUrl;

  return (
    <a
      className={`store-badge ${isLive ? '' : 'store-badge--soon'}`}
      href={store.storeUrl ?? undefined}
      target="_blank"
      rel="noreferrer"
      aria-disabled={!isLive}
      onClick={e => { if (!isLive) e.preventDefault(); }}
    >
      <span className="store-badge__icon">{store.icon}</span>
      <span className="store-badge__text">
        {isLive
          ? `Add to ${store.name} — it's free`
          : `${store.name} Web Store — coming soon`}
      </span>
      {!isLive && <span className="store-badge__pill">Soon</span>}
    </a>
  );
}

// ── Welcome page ─────────────────────────────────────────────────────────────
export default function Welcome() {
  return (
    <main className="page">

      {/* ── TOP: logo + headline, full-width centered ── */}
      <div className="top-section reveal">
        <div className="logo-pill">
          <div className="logo-icon-wrap">
            <DToxLogo size={26} />
          </div>
          <span className="logo-name">D-Tox</span>
        </div>

        <h1 className="hero-headline">
          <span className="headline-welcome">Welcome.</span>
          <span className="headline-choice">You just made a choice.</span>
        </h1>

        <StoreBadge />
      </div>

      {/* ── BOTTOM: two columns, no borders ── */}
      <div className="bottom-grid">

        {/* LEFT — text, each block staggered in */}
        <div className="text-col">

          <div className="block reveal" style={{ animationDelay: '120ms' }}>
            <span className="block-title">Pin to toolbar</span>
            <div className="pin-steps">
              <div className="pin-step">
                <span className="step-num">1</span>
                <span>Click 🧩 extensions icon in your browser</span>
              </div>
              <div className="pin-step">
                <span className="step-num">2</span>
                <span>Find <strong>D-Tox</strong> in the list</span>
              </div>
              <div className="pin-step">
                <span className="step-num">3</span>
                <span>Click 📌 to pin — it stays in your toolbar</span>
              </div>
            </div>
          </div>

          <div className="block reveal" style={{ animationDelay: '200ms' }}>
            <span className="block-title">What it does</span>
            <p className="block-body">
              YouTube is a machine built to steal your attention. D-Tox strips
              everything it uses to pull you somewhere you didn't choose to go.
              <strong> You search. It plays. Nothing else.</strong>
            </p>
          </div>

          <div className="block reveal" style={{ animationDelay: '280ms' }}>
            <span className="block-title">From the maker</span>
            <p className="block-body">
              I kept opening YouTube for one video — and waking up 45 minutes
              later, three rabbit holes deep. One hour saved each week is{' '}
              <strong>52 hours a year</strong>. Use it well.
            </p>
          </div>

          <div className="action-row reveal" style={{ animationDelay: '360ms' }}>
            <a className="action-btn primary"   href={DONATE_PAYPAL} target="_blank" rel="noreferrer">☕ Support</a>
            <a className="action-btn secondary" href={FEATURE_FORM}  target="_blank" rel="noreferrer">💡 Suggest</a>
            <a className="action-btn ghost"     href={GITHUB_URL}    target="_blank" rel="noreferrer">⭐ GitHub</a>
          </div>

          <p className="sign-off reveal" style={{ animationDelay: '440ms' }}>
            Enjoy YouTube on your own terms.
            <span className="signature">— Najmush</span>
            <span className="tagline">Made with intention, not algorithms.</span>
          </p>

        </div>

        {/* RIGHT — image */}
        <div className="image-col reveal" style={{ animationDelay: '160ms' }}>
          <img src="/hands.png" alt="The choice is yours" className="hands-img" />
          <p className="ps-label">P.S. — You always have a choice.</p>
        </div>

      </div>
    </main>
  );
}
