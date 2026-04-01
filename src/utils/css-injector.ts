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
    hideExplore: 'explore',
    hideSearchResults: 'searchFilters',
    disableAutoplay: 'autoplay',
    disableAnnotations: 'annotations'
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
 * Inject CSS styles into the page.
 * Re-uses the existing style tag when possible to avoid triggering
 * the styleWatchdog MutationObserver unnecessarily.
 */
export function injectStyles(settings: Settings): void {
  const cssRules = generateHideRules(settings);
  const existingStyle = document.getElementById(STYLE_TAG_ID);

  if (!cssRules) {
    // No rules needed — remove tag if it exists
    if (existingStyle) existingStyle.remove();
    return;
  }

  if (existingStyle) {
    // Update in-place — no remove/add cycle
    if (existingStyle.textContent !== cssRules) {
      existingStyle.textContent = cssRules;
    }
  } else {
    // First injection — create the tag
    const style = document.createElement('style');
    style.id = STYLE_TAG_ID;
    style.type = 'text/css';
    style.textContent = cssRules;
    document.head.appendChild(style);
  }
}

/**
 * Apply all styles based on settings.
 * Autoplay is handled separately via a DOM observer in content.ts
 * because YouTube's player requires clicking the toggle, not CSS alone.
 */
export function applyAllRules(settings: Settings): void {
  injectStyles(settings);
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
