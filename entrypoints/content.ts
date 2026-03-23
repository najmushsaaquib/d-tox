import { defineContentScript } from 'wxt/utils/define-content-script';
import { loadSettings, onSettingsChange } from '../src/utils/storage';
import { applyAllRules, cleanupStyles } from '../src/utils/css-injector';
import type { Settings } from '../src/utils/types';

export default defineContentScript({
  matches: ['https://*.youtube.com/*', 'https://youtube.com/*'],
  async main() {
    let current: Settings | null = null;

    function apply(settings: Settings) {
      current = settings;
      if (settings.extensionEnabled) {
        applyAllRules(settings);
      } else {
        cleanupStyles();
      }
    }

    // Load and apply initial settings
    try {
      const settings = await loadSettings();
      apply(settings);
    } catch (e) {
      console.error('[YouTube Detox] Init error:', e);
    }

    // React to setting changes from popup
    onSettingsChange(apply);

    // Re-apply on SPA navigation (YouTube is a SPA)
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        if (current?.extensionEnabled) {
          setTimeout(() => apply(current!), 500);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
});
