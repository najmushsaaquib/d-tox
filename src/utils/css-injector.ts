import { Settings } from './types';
import { HIDE_CSS_RULES } from '../constants/youtube-elements';

/**
 * CSS Injector - Manages dynamic CSS injection to hide YouTube elements
 * This creates and maintains a style tag that gets updated whenever settings change
 */

const STYLE_TAG_ID = 'd-tox-styles';

/**
 * Generate CSS rules based on current settings
 */
function generateHideRules(settings: Settings): string {
  const rules: string[] = [];

  // Map setting keys to CSS rule keys
  const settingToCss = {
    hideHomeFeed: 'homeFeeds',
    hideSidebar: 'sidebar',
    hideShorts: 'shorts',
    hidePlaylists: 'playlists',
    hideMixes: 'mixes',
    hideMoreFromYoutube: 'moreFromYoutube',
    hideComments: 'comments',
    hideProfilePhotos: 'profilePhotos',
    hideHeader: 'header',
    hideNotifications: 'notifications',
    hideLiveChat: 'liveChat',
    hideFundraiser: 'fundraiser',
    hideScreenFeed: 'screenFeed',
    hideScreenCards: 'screenCards',
    hideMerchTicketOffers: 'merchTicketOffers',
    hideVideoInfo: 'videoInfo',
    hideExplore: 'explore'
  };

  // Build CSS rules for enabled settings
  Object.entries(settingToCss).forEach(([setting, cssKey]) => {
    const enabled = settings[setting as keyof typeof settingToCss];
    if (enabled && HIDE_CSS_RULES[cssKey]) {
      rules.push(HIDE_CSS_RULES[cssKey]);
    }
  });

  return rules.join('\n\n');
}

/**
 * Generate JavaScript to disable features
 */
function generateDisableScripts(settings: Settings): string {
  const scripts: string[] = [];

  // Disable autoplay
  if (settings.disableAutoplay) {
    scripts.push(`
      (function() {
        // Override autoplay attribute
        Object.defineProperty(HTMLMediaElement.prototype, 'autoplay', {
          set: function() {},
          get: function() { return false; }
        });

        // Disable autoplay button
        const observer = new MutationObserver(() => {
          const autoplayButton = document.querySelector('[aria-label*="Autoplay"]');
          if (autoplayButton) {
            autoplayButton.click?.();
          }
        });

        observer.observe(document.body, {
          subtree: true,
          attributes: true,
          attributeFilter: ['autoplay']
        });
      })();
    `);
  }

  // Disable annotations
  if (settings.disableAnnotations) {
    scripts.push(`
      (function() {
        // Hide interactive cards/annotations
        const style = document.createElement('style');
        style.innerHTML = \`
          ytp-card-container { display: none !important; }
          .ytp-card { display: none !important; }
          .ytp-cards-button { display: none !important; }
        \`;
        document.head.appendChild(style);
      })();
    `);
  }

  return scripts.join('\n');
}

/**
 * Inject CSS styles into the page
 */
export function injectStyles(settings: Settings): void {
  // Remove existing style tag if present
  const existingStyle = document.getElementById(STYLE_TAG_ID);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Generate CSS rules
  const cssRules = generateHideRules(settings);

  if (cssRules) {
    // Create and inject new style tag
    const style = document.createElement('style');
    style.id = STYLE_TAG_ID;
    style.type = 'text/css';
    style.innerHTML = cssRules;
    document.head.appendChild(style);
  }
}

/**
 * Inject disable scripts into the page context
 * Scripts injected this way have access to the page's context
 */
export function injectDisableScripts(settings: Settings): void {
  const scripts = generateDisableScripts(settings);

  if (scripts) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = scripts;
    document.head.appendChild(script);
  }
}

/**
 * Apply all styles and scripts based on settings
 */
export function applyAllRules(settings: Settings): void {
  // Inject CSS for element hiding
  injectStyles(settings);

  // Inject scripts for feature disabling
  injectDisableScripts(settings);

  console.debug('[D-Tox] Rules applied', settings);
}

/**
 * Setup Mutation Observer to re-apply rules when DOM changes
 * YouTube loads content dynamically, so we need to watch for changes
 */
export function setupMutationObserver(settings: Settings): () => void {
  let timeout: ReturnType<typeof setTimeout>;

  const observer = new MutationObserver(() => {
    // Debounce to avoid excessive updates
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      applyAllRules(settings);
    }, 250);
  });

  // Watch for DOM changes
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'aria-label']
  });

  // Return cleanup function
  return () => {
    observer.disconnect();
    clearTimeout(timeout);
  };
}

/**
 * Clean up all injected styles and observers
 */
export function cleanupStyles(): void {
  const style = document.getElementById(STYLE_TAG_ID);
  if (style) {
    style.remove();
  }
}
