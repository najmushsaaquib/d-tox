/**
 * YouTube Element Selectors
 * Maps feature settings to CSS selectors that identify elements to hide
 *
 * Note: YouTube frequently changes its DOM structure. These selectors are
 * tested against the current YouTube UI but may need updates as YouTube evolves.
 *
 * Multiple selectors are provided for redundancy in case one fails.
 */

export interface ElementSelector {
  // Primary selector - most likely to work
  primary: string;
  // Alternative selectors as fallbacks
  alternatives?: string[];
  // Additional notes
  notes?: string;
}

export interface SelectorMap {
  [key: string]: ElementSelector;
}

export const YOUTUBE_SELECTORS: SelectorMap = {
  // Feed & Recommendations
  homeFeeds: {
    primary: 'ytd-rich-grid-renderer',
    alternatives: [
      'div[data-yt-client-name="WEB_EMBEDDED_PLAYER"]',
      'ytd-primary-info-renderer'
    ],
    notes: 'Main feed grid on homepage'
  },

  sidebar: {
    primary: 'ytd-watch-next-secondary-results-renderer',
    alternatives: [
      'div#secondary-inner',
      'ytd-compact-video-list-renderer',
      'div[aria-label*="recommended"]'
    ],
    notes: 'Sidebar recommendations on watch page'
  },

  shorts: {
    primary: 'ytd-rich-section-renderer:has(h2:contains("Shorts"))',
    alternatives: [
      'div#rich-shelf-header:contains("Shorts")',
      'a[href="/shorts"]',
      'ytd-large-list-header-renderer:contains("Shorts")'
    ],
    notes: 'Shorts section on homepage'
  },

  playlists: {
    primary: 'ytd-playlist-renderer',
    alternatives: [
      'div[data-content-type="playlist"]',
      'a[href*="/playlist?"]'
    ],
    notes: 'Playlist recommendations'
  },

  mixes: {
    primary: 'ytd-rich-section-renderer:has(h2:contains("Mix"))',
    alternatives: [
      'ytd-video-list-renderer:has(span:contains("Mix"))'
    ],
    notes: 'Mix playlists section'
  },

  moreFromYoutube: {
    primary: 'div[aria-label*="More from YouTube"]',
    alternatives: [
      'ytd-rich-section-renderer:has(span:contains("More from YouTube"))',
      'div[data-section-identifier*="more"]'
    ],
    notes: 'More from YouTube suggestion cards'
  },

  // User Interface
  comments: {
    primary: 'ytd-comments-header-renderer',
    alternatives: [
      'ytd-item-section-renderer[data-section-identifier="comments-section"]',
      'div#comments-section',
      'div[aria-label*="Comments"]'
    ],
    notes: 'Comments section and all comment content'
  },

  profilePhotos: {
    primary: 'img[alt*="Avatar"]',
    alternatives: [
      'ytd-channel-tagline-renderer img',
      'yt-img-shadow img'
    ],
    notes: 'User profile photos/avatars'
  },

  header: {
    primary: 'ytd-topbar-logo-button-renderer',
    alternatives: [
      'div#topbar',
      'div[aria-label="YouTube"]',
      'ytd-masthead-ad-vtm-renderer'
    ],
    notes: 'Top navigation header'
  },

  notifications: {
    primary: 'ytd-notification-topbar-button-renderer',
    alternatives: [
      'button[aria-label*="Notifications"]',
      'button[aria-label*="notifications"]'
    ],
    notes: 'Notifications bell and dropdown'
  },

  // Content & Ads
  liveChat: {
    primary: 'div[id*="chat"]',
    alternatives: [
      'yt-live-chat-renderer',
      'div[aria-label="Live chat"]'
    ],
    notes: 'Live chat in streams'
  },

  fundraiser: {
    primary: 'ytd-donation-shelf-renderer',
    alternatives: [
      'div[data-content-type="fundraising"]',
      'div[aria-label*="fundraiser"]'
    ],
    notes: 'Fundraiser banners and widgets'
  },

  screenFeed: {
    primary: 'div[aria-label*="Suggested for you"]',
    alternatives: [
      'ytd-compact-suggested-results-renderer'
    ],
    notes: 'On-screen feed suggestions'
  },

  screenCards: {
    primary: 'div[data-a11y-skip-to*="skip-to-main-content"]',
    alternatives: [
      'ytd-card-renderer',
      'div[aria-label*="Card"]'
    ],
    notes: 'Overlay cards during playback'
  },

  merchTicketOffers: {
    primary: 'ytd-merch-shelf-renderer',
    alternatives: [
      'div[data-content-type="merch"]',
      'div[aria-label*="Shop"]'
    ],
    notes: 'Merch and ticket offers'
  },

  videoInfo: {
    primary: 'ytd-video-primary-info-renderer',
    alternatives: [
      'div#meta-contents',
      'ytd-video-secondary-info-renderer'
    ],
    notes: 'Video description, title, and metadata'
  },

  // Discovery
  explore: {
    primary: 'ytd-browse-endpoint[browse-id="FEexplore"]',
    alternatives: [
      'a[href*="/feed/explore"]',
      'a[aria-label*="Explore"]'
    ],
    notes: 'Explore page link and Trending section'
  },

  searchResults: {
    primary: 'ytd-video-renderer',
    alternatives: [
      'ytd-grid-video-renderer',
      'ytd-shelf-renderer'
    ],
    notes: 'Search result items (use with caution)'
  }
};

/**
 * CSS rules for hiding elements
 * These are applied dynamically by the content script
 */
export const HIDE_CSS_RULES: Record<string, string> = {
  homeFeeds: `
    ytd-rich-grid-renderer { display: none !important; }
  `,

  sidebar: `
    ytd-watch-next-secondary-results-renderer { display: none !important; }
    div#secondary-inner { display: none !important; }
    #secondary { display: none !important; }
    #related { display: none !important; }
    #columns { justify-content: center !important; }
    #primary.ytd-watch-flexy { max-width: 1280px !important; width: 100% !important; }
    #primary-inner { max-width: 1280px !important; }
    ytd-watch-flexy[flexy][is-two-columns_] #primary { max-width: 1280px !important; }
  `,

  shorts: `
    /* === Individual Shorts in search/feed — pure CSS, instant === */
    ytd-video-renderer:has(a#thumbnail[href^="/shorts/"]) { display: none !important; }

    /* === Shorts shelf (horizontal carousel) — YouTube 2025+ === */
    grid-shelf-view-model:has(ytm-shorts-lockup-view-model) { display: none !important; }
    grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2) { display: none !important; }
    grid-shelf-view-model:has(a[href^="/shorts/"]) { display: none !important; }
    ytm-shorts-lockup-view-model { display: none !important; }
    ytm-shorts-lockup-view-model-v2 { display: none !important; }

    /* === Legacy Shorts shelf === */
    ytd-reel-shelf-renderer { display: none !important; }
    ytd-reel-item-renderer { display: none !important; }
    ytd-rich-section-renderer[is-shorts] { display: none !important; }
    ytd-rich-shelf-renderer[is-shorts] { display: none !important; }
    ytd-rich-section-renderer:has(ytd-reel-shelf-renderer) { display: none !important; }
    ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]) { display: none !important; }
    ytd-item-section-renderer:has(ytd-reel-shelf-renderer) { display: none !important; }
    ytd-shelf-renderer[is-shorts-shelf] { display: none !important; }

    /* === Shorts chip in search filter bar (JS-marked by text match) === */
    yt-chip-cloud-chip-renderer[dtox-shorts-chip] { display: none !important; }

    /* === Shorts nav links (sidebar + mini guide) === */
    a[title="Shorts"] { display: none !important; }
    a[href="/shorts"] { display: none !important; }
    ytd-mini-guide-entry-renderer[aria-label="Shorts"] { display: none !important; }
    ytd-mini-guide-entry-renderer:has(a[title="Shorts"]) { display: none !important; }
    ytd-mini-guide-entry-renderer:has(a[href="/shorts"]) { display: none !important; }
    ytd-guide-entry-renderer:has(a[title="Shorts"]) { display: none !important; }
    ytd-guide-entry-renderer:has(a[href="/shorts"]) { display: none !important; }
  `,

  playlists: `
    ytd-playlist-renderer { display: none !important; }
    ytd-radio-renderer { display: none !important; }
  `,

  mixes: `
    ytd-radio-renderer { display: none !important; }
  `,

  moreFromYoutube: `
    div[aria-label*="More from YouTube"] { display: none !important; }
    ytd-horizontal-card-list-renderer { display: none !important; }
  `,

  comments: `
    ytd-comments#comments { display: none !important; }
    ytd-item-section-renderer#sections { display: none !important; }
    #comments { display: none !important; }
  `,

  profilePhotos: `
    #author-thumbnail { visibility: hidden !important; width: 0 !important; }
    yt-img-shadow.ytd-comment-renderer { display: none !important; }
  `,

  header: `
    #masthead-container { display: none !important; }
    ytd-masthead { display: none !important; }
    ytd-page-manager { margin-top: 0 !important; }
  `,

  notifications: `
    ytd-notification-topbar-button-renderer { display: none !important; }
    button[aria-label*="Notifications"] { display: none !important; }
  `,

  liveChat: `
    div[id*="chat"] { display: none !important; }
    yt-live-chat-renderer { display: none !important; }
  `,

  fundraiser: `
    ytd-donation-shelf-renderer { display: none !important; }
  `,

  screenFeed: `
    div[aria-label*="Suggested for you"] { display: none !important; }
    ytd-compact-suggested-results-renderer { display: none !important; }
  `,

  screenCards: `
    ytd-card-renderer { display: none !important; }
    div[aria-label*="Card"] { display: none !important; }
  `,

  merchTicketOffers: `
    ytd-merch-shelf-renderer { display: none !important; }
  `,

  videoInfo: `
    ytd-video-primary-info-renderer { display: none !important; }
    ytd-video-secondary-info-renderer { display: none !important; }
  `,

  explore: `
    /* === JS-marked explore section (most reliable) === */
    ytd-guide-section-renderer[dtox-explore-section] { display: none !important; }

    /* === Whole section by content — :has() targets the section containing these links === */
    ytd-guide-section-renderer:has(a[title="Trending"]) { display: none !important; }
    ytd-guide-section-renderer:has(a[title="Shopping"]) { display: none !important; }
    ytd-guide-section-renderer:has(a[title="Gaming"]) { display: none !important; }
    ytd-guide-section-renderer:has(a[href*="/feed/trending"]) { display: none !important; }
    ytd-guide-section-renderer:has(a[href*="/feed/explore"]) { display: none !important; }

    /* === Individual entries fallback === */
    ytd-guide-entry-renderer:has(a[href*="/feed/trending"]) { display: none !important; }
    ytd-guide-entry-renderer:has(a[href*="/feed/explore"]) { display: none !important; }
    ytd-mini-guide-entry-renderer:has(a[href*="/feed/trending"]) { display: none !important; }
    ytd-mini-guide-entry-renderer:has(a[href*="/feed/explore"]) { display: none !important; }

    /* === Direct link targets === */
    a[href*="/feed/explore"] { display: none !important; }
    a[href*="/feed/trending"] { display: none !important; }
    a[aria-label*="Explore"] { display: none !important; }

    /* === Trending/Explore page content (if user navigates directly) === */
    ytd-browse[page-subtype="trending"] ytd-rich-grid-renderer { display: none !important; }
    ytd-browse[page-subtype="trending"] ytd-section-list-renderer { display: none !important; }
    ytd-browse[page-subtype="explore"] #content { display: none !important; }
  `,

  searchFilters: `
    ytd-search-sub-menu-renderer { display: none !important; }
    ytd-search-filter-group-renderer { display: none !important; }
    #filter-menu { display: none !important; }
  `,

  autoplay: `
    .ytp-ce-element { display: none !important; }
    .ytp-endscreen-content { display: none !important; }
    .ytp-autonav-endscreen { display: none !important; }
    .ytp-ce-covering-overlay { display: none !important; }
    .ytp-autonav-toggle-button-container { opacity: 0.35 !important; filter: grayscale(1) !important; pointer-events: none !important; }
  `,

  annotations: `
    .ytp-ce-element { display: none !important; }
    .ytp-cards-teaser { display: none !important; }
    .ytp-ce-expanding-overlay { display: none !important; }
    .ytp-cards-button { display: none !important; }
    .ytp-card { display: none !important; }
    ytp-card-container { display: none !important; }
    .ytp-ce-covering-overlay { display: none !important; }
  `
};
