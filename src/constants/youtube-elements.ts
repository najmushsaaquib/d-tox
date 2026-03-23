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
  `,

  shorts: `
    ytd-reel-shelf-renderer { display: none !important; }
    ytd-rich-section-renderer[is-shorts] { display: none !important; }
    ytd-rich-shelf-renderer[is-shorts] { display: none !important; }
    a[title="Shorts"] { display: none !important; }
    a[href="/shorts"] { display: none !important; }
    ytd-mini-guide-entry-renderer a[title="Shorts"] { display: none !important; }
    ytd-guide-entry-renderer a[title="Shorts"] { display: none !important; }
    [is-shorts] { display: none !important; }
    ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]) { display: none !important; }
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
    a[href*="/feed/explore"] { display: none !important; }
    a[aria-label*="Explore"] { display: none !important; }
  `
};
