import { Preset } from './types';

export const PRESETS: Preset[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Only search + player. Maximum focus.',
    icon: '🛡️',
    settings: {
      hideHomeFeed: true, hideSidebar: true, hideShorts: true,
      hidePlaylists: true, hideMixes: true, hideMoreFromYoutube: true,
      hideComments: true, hideProfilePhotos: true, hideHeader: false,
      hideNotifications: true, hideLiveChat: true, hideFundraiser: true,
      hideScreenFeed: true, hideScreenCards: true, hideMerchTicketOffers: true,
      hideVideoInfo: false, hideExplore: true, hideSearchResults: false,
      disableAutoplay: true, disableAnnotations: true
    }
  },
  {
    id: 'focus',
    name: 'Focus',
    description: 'Keep sidebar, hide distractions.',
    icon: '🎯',
    settings: {
      hideHomeFeed: true, hideSidebar: false, hideShorts: true,
      hidePlaylists: true, hideMixes: true, hideMoreFromYoutube: true,
      hideComments: true, hideProfilePhotos: true, hideHeader: false,
      hideNotifications: true, hideLiveChat: true, hideFundraiser: true,
      hideScreenFeed: true, hideScreenCards: true, hideMerchTicketOffers: true,
      hideVideoInfo: false, hideExplore: true, hideSearchResults: false,
      disableAutoplay: true, disableAnnotations: false
    }
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Subtle tweaks, mostly untouched.',
    icon: '🌿',
    settings: {
      hideHomeFeed: true, hideSidebar: false, hideShorts: true,
      hidePlaylists: false, hideMixes: false, hideMoreFromYoutube: false,
      hideComments: false, hideProfilePhotos: false, hideHeader: false,
      hideNotifications: false, hideLiveChat: false, hideFundraiser: true,
      hideScreenFeed: false, hideScreenCards: false, hideMerchTicketOffers: true,
      hideVideoInfo: false, hideExplore: false, hideSearchResults: false,
      disableAutoplay: true, disableAnnotations: false
    }
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'You decide what stays.',
    icon: '✏️',
    settings: {
      hideHomeFeed: false, hideSidebar: false, hideShorts: false,
      hidePlaylists: false, hideMixes: false, hideMoreFromYoutube: false,
      hideComments: false, hideProfilePhotos: false, hideHeader: false,
      hideNotifications: false, hideLiveChat: false, hideFundraiser: false,
      hideScreenFeed: false, hideScreenCards: false, hideMerchTicketOffers: false,
      hideVideoInfo: false, hideExplore: false, hideSearchResults: false,
      disableAutoplay: false, disableAnnotations: false
    }
  }
];

export function getPresetById(id: string): Preset | undefined {
  return PRESETS.find(p => p.id === id);
}
