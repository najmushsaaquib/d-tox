/**
 * Background Service Worker
 * Runs in the background to handle extension initialization and state management
 */

import { defineBackground } from 'wxt/utils/define-background';
import { loadSettings, resetSettings, onSettingsChange } from '../src/utils/storage';

export default defineBackground(() => {
  /**
   * Initialize extension when installed or updated
   */
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      console.log('[D-Tox] Extension installed');

      // Initialize default settings on first install
      try {
        const settings = await loadSettings();
        console.log('[D-Tox] Settings initialized:', settings);
      } catch (error) {
        console.error('[D-Tox] Failed to initialize settings:', error);
        await resetSettings();
      }

      // Open welcome page on first install
      chrome.tabs.create({
        url: 'https://d-tox.najmushsaaquib.com/welcome',
        active: true
      });
    } else if (details.reason === 'update') {
      console.log('[D-Tox] Extension updated');
    }
  });

  /**
   * Handle extension icon click - open options page
   */
  try {
    chrome.action.onClicked.addListener(() => {
      chrome.runtime.openOptionsPage();
    });
  } catch (e) {
    // Silently fail if API not available
  }

  /**
   * Update icon based on extension enabled/disabled state
   */
  async function updateIcon() {
    try {
      const settings = await loadSettings();
      const path = settings.extensionEnabled
        ? { 16: 'icon-16.png', 48: 'icon-48.png', 128: 'icon-128.png' }
        : { 16: 'icon-paused-16.png', 48: 'icon-paused-48.png', 128: 'icon-paused-128.png' };

      chrome.action.setIcon({ path });
    } catch (error) {
      console.error('[D-Tox] Failed to update icon:', error);
    }
  }

  /**
   * Listen for settings changes to update icon
   */
  onSettingsChange((newSettings) => {
    updateIcon();
  });

  /**
   * Set initial icon on startup
   */
  updateIcon();

  /**
   * Message passing for cross-component communication
   */
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
      loadSettings()
        .then((settings) => sendResponse({ settings }))
        .catch((error) => {
          console.error('Failed to load settings:', error);
          sendResponse({ error: error.message });
        });
      return true; // Indicate we'll send response asynchronously
    }

    if (request.action === 'resetSettings') {
      resetSettings()
        .then(() => sendResponse({ success: true }))
        .catch((error) => {
          console.error('Failed to reset settings:', error);
          sendResponse({ error: error.message });
        });
      return true;
    }
  });

  console.log('[D-Tox] Background service worker loaded');
});
