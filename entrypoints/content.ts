import { defineContentScript } from 'wxt/utils/define-content-script';
import { loadSettings, onSettingsChange } from '../src/utils/storage';
import { applyAllRules, cleanupStyles } from '../src/utils/css-injector';
import type { Settings } from '../src/utils/types';

// ─── Autoplay Observer ───────────────────────────────────────────────
let autoplayObserver: MutationObserver | null = null;

function disableAutoplayToggle() {
  const btn = document.querySelector<HTMLElement>('.ytp-autonav-toggle-button');
  if (btn && btn.getAttribute('aria-checked') === 'true') {
    btn.click();
  }
}

function startAutoplayObserver() {
  disableAutoplayToggle();
  if (autoplayObserver) return;
  autoplayObserver = new MutationObserver(() => disableAutoplayToggle());
  autoplayObserver.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-checked'],
  });
}

function stopAutoplayObserver() {
  autoplayObserver?.disconnect();
  autoplayObserver = null;
}

// ─── Element Markers ────────────────────────────────────────────────
// Marks elements that CSS alone cannot target (text-based matching).
// Runs on a lightweight interval — no MutationObserver cascade.

let markerInterval: ReturnType<typeof setInterval> | null = null;

function markElements(settings: Settings) {
  // Mark "Shorts" chip in search filter bar (CSS can't match by text)
  if (settings.hideShorts) {
    document.querySelectorAll('yt-chip-cloud-chip-renderer:not([dtox-checked])').forEach(chip => {
      chip.setAttribute('dtox-checked', '');
      const text = chip.textContent?.trim();
      if (text === 'Shorts') {
        chip.setAttribute('dtox-shorts-chip', '');
      }
    });
  }

  // Mark Explore guide section (CSS :has can be unreliable on dynamic sidebar)
  if (settings.hideExplore) {
    document.querySelectorAll('ytd-guide-section-renderer:not([dtox-checked])').forEach(section => {
      section.setAttribute('dtox-checked', '');
      const links = section.querySelectorAll('a');
      for (const link of links) {
        const title = link.getAttribute('title') || '';
        const href = link.getAttribute('href') || '';
        if (
          title === 'Trending' || title === 'Shopping' || title === 'Gaming' ||
          href.includes('/feed/trending') || href.includes('/feed/explore')
        ) {
          section.setAttribute('dtox-explore-section', '');
          break;
        }
      }
    });
  }
}

function clearMarkers() {
  document.querySelectorAll('[dtox-checked]').forEach(el => {
    el.removeAttribute('dtox-checked');
    el.removeAttribute('dtox-shorts-chip');
    el.removeAttribute('dtox-explore-section');
  });
}

function startMarkers(settings: Settings) {
  markElements(settings);
  if (!markerInterval) {
    markerInterval = setInterval(() => markElements(settings), 2000);
  }
}

function stopMarkers() {
  if (markerInterval) {
    clearInterval(markerInterval);
    markerInterval = null;
  }
}

// ─── Main Content Script ────────────────────────────────────────────
export default defineContentScript({
  matches: ['https://*.youtube.com/*', 'https://youtube.com/*'],
  async main() {
    let current: Settings | null = null;

    function apply(settings: Settings) {
      current = settings;
      if (settings.extensionEnabled) {
        // Clear old markers so toggled-off features don't leave stale attrs
        clearMarkers();
        applyAllRules(settings);
        startMarkers(settings);

        // Force synchronous layout reflow so CSS changes (like sidebar
        // centering or header removal) apply visually without page reload.
        void document.body.offsetHeight;

        if (settings.disableAutoplay) {
          startAutoplayObserver();
        } else {
          stopAutoplayObserver();
        }
      } else {
        cleanupStyles();
        stopAutoplayObserver();
        stopMarkers();
        clearMarkers();
        void document.body.offsetHeight;
      }
    }

    // Load and apply initial settings
    try {
      const settings = await loadSettings();
      apply(settings);
    } catch (e) {
      console.error('[D-Tox] Init error:', e);
    }

    // React to setting changes from popup (via storage)
    onSettingsChange(apply);

    // React to direct message from popup (faster than storage events)
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg?.type === 'dtox-settings-changed' && msg.settings) {
        apply(msg.settings);
      }
    });

    // Re-apply on YouTube SPA navigation using YouTube's own event
    document.addEventListener('yt-navigate-finish', () => {
      if (current?.extensionEnabled) {
        apply(current);
      }
    });

    // Fallback: also detect URL changes for edge cases
    let lastUrl = location.href;
    const navCheck = setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        if (current?.extensionEnabled) {
          setTimeout(() => apply(current!), 300);
        }
      }
    }, 1000);

    // Style tag watchdog — re-inject only if YouTube actually removed it
    const styleWatchdog = new MutationObserver((mutations) => {
      const wasRemoved = mutations.some(m =>
        Array.from(m.removedNodes).some(
          n => (n as HTMLElement).id === 'd-tox-styles'
        )
      );
      if (wasRemoved && current?.extensionEnabled) {
        applyAllRules(current);
      }
    });
    styleWatchdog.observe(document.head, { childList: true });
  }
});
