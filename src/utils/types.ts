/**
 * Settings interface defining all toggle features
 */
export interface Settings {
  // Master toggle
  extensionEnabled: boolean;

  // Feed & Recommendations
  hideHomeFeed: boolean;
  hideSidebar: boolean;
  hideShorts: boolean;
  hidePlaylists: boolean;
  hideMixes: boolean;
  hideMoreFromYoutube: boolean;

  // User Interface
  hideComments: boolean;
  hideProfilePhotos: boolean;
  hideHeader: boolean;
  hideNotifications: boolean;

  // Content & Ads
  hideLiveChat: boolean;
  hideFundraiser: boolean;
  hideScreenFeed: boolean;
  hideScreenCards: boolean;
  hideMerchTicketOffers: boolean;
  hideVideoInfo: boolean;

  // Discovery
  hideExplore: boolean;
  hideSearchResults: boolean;

  // Functionality
  disableAutoplay: boolean;
  disableAnnotations: boolean;
}

/**
 * Default settings - all features disabled (user must enable what they want)
 */
export const DEFAULT_SETTINGS: Settings = {
  extensionEnabled: true,
  hideHomeFeed: false,
  hideSidebar: false,
  hideShorts: false,
  hidePlaylists: false,
  hideMixes: false,
  hideMoreFromYoutube: false,
  hideComments: false,
  hideProfilePhotos: false,
  hideHeader: false,
  hideNotifications: false,
  hideLiveChat: false,
  hideFundraiser: false,
  hideScreenFeed: false,
  hideScreenCards: false,
  hideMerchTicketOffers: false,
  hideVideoInfo: false,
  hideExplore: false,
  hideSearchResults: false,
  disableAutoplay: false,
  disableAnnotations: false
};

/**
 * Feature metadata for UI display
 */
export interface FeatureMetadata {
  key: keyof Settings;
  label: string;
  description: string;
  category: 'feed' | 'ui' | 'content' | 'discovery' | 'functionality';
}

/**
 * Preset profile definition
 */
export interface Preset {
  id: string;
  name: string;
  description: string;
  settings: Partial<Settings>;
  icon?: string;
}

/**
 * Feature categories for organizing settings page
 */
export const FEATURE_METADATA: FeatureMetadata[] = [
  // Feed & Recommendations
  {
    key: 'hideHomeFeed',
    label: 'Hide Home Feed',
    description: 'Hide the main feed on the YouTube homepage',
    category: 'feed'
  },
  {
    key: 'hideSidebar',
    label: 'Hide Sidebar Recommendations',
    description: 'Hide related videos and recommendations in the sidebar',
    category: 'feed'
  },
  {
    key: 'hideShorts',
    label: 'Hide Shorts',
    description: 'Hide YouTube Shorts section and button',
    category: 'feed'
  },
  {
    key: 'hidePlaylists',
    label: 'Hide Playlists',
    description: 'Hide playlist recommendations and widgets',
    category: 'feed'
  },
  {
    key: 'hideMixes',
    label: 'Hide Mixes',
    description: 'Hide mix playlists section',
    category: 'feed'
  },
  {
    key: 'hideMoreFromYoutube',
    label: 'Hide More From YouTube',
    description: 'Hide "More from YouTube" suggestion cards',
    category: 'feed'
  },

  // User Interface
  {
    key: 'hideComments',
    label: 'Hide Comments',
    description: 'Hide the comments section',
    category: 'ui'
  },
  {
    key: 'hideProfilePhotos',
    label: 'Hide Profile Photos',
    description: 'Hide user thumbnails in comments and recommendations',
    category: 'ui'
  },
  {
    key: 'hideHeader',
    label: 'Hide Top Header',
    description: 'Hide navigation header (logo, search, user menu)',
    category: 'ui'
  },
  {
    key: 'hideNotifications',
    label: 'Hide Notifications',
    description: 'Hide notifications bell and dropdown',
    category: 'ui'
  },

  // Content & Ads
  {
    key: 'hideLiveChat',
    label: 'Hide Live Chat',
    description: 'Hide live chat in streams',
    category: 'content'
  },
  {
    key: 'hideFundraiser',
    label: 'Hide Fundraiser',
    description: 'Hide fundraiser banners and widgets',
    category: 'content'
  },
  {
    key: 'hideScreenFeed',
    label: 'Hide Screen Feed',
    description: 'Hide on-screen feed suggestions',
    category: 'content'
  },
  {
    key: 'hideScreenCards',
    label: 'Hide Screen Cards',
    description: 'Hide overlay cards during video playback',
    category: 'content'
  },
  {
    key: 'hideMerchTicketOffers',
    label: 'Hide Merch & Ticket Offers',
    description: 'Hide shop items and ticket offers',
    category: 'content'
  },
  {
    key: 'hideVideoInfo',
    label: 'Hide Video Info',
    description: 'Hide video description and metadata',
    category: 'content'
  },

  // Discovery
  {
    key: 'hideExplore',
    label: 'Hide Explore & Trending',
    description: 'Hide Explore page and trending section',
    category: 'discovery'
  },
  {
    key: 'hideSearchResults',
    label: 'Hide Search Result Filters',
    description: 'Show only basic search results',
    category: 'discovery'
  },

  // Functionality
  {
    key: 'disableAutoplay',
    label: 'Disable Autoplay',
    description: 'Prevent automatic video playback',
    category: 'functionality'
  },
  {
    key: 'disableAnnotations',
    label: 'Disable Annotations',
    description: 'Hides info cards, end screens and clickable overlay links that appear during videos',
    category: 'functionality'
  }
];

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  settings: 'yt_detox_settings',
  currentPreset: 'yt_detox_preset',
  version: 'yt_detox_version'
} as const;

export const CATEGORY_INFO: Record<string, { label: string; icon: string }> = {
  feed: { label: 'Feed', icon: '📡' },
  ui: { label: 'Interface', icon: '🖥' },
  content: { label: 'Content', icon: '📺' },
  discovery: { label: 'Discovery', icon: '🔍' },
  functionality: { label: 'Controls', icon: '⚙️' }
};
