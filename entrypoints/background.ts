/**
 * Background Service Worker
 * Runs in the background to handle extension initialization and state management
 */

import { defineBackground } from 'wxt/utils/define-background';
import { loadSettings, resetSettings } from '../src/utils/storage';

export default defineBackground(() => {
  /**
   * Initialize extension when installed or updated
   */
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      console.log('[YouTube Declutter] Extension installed');

      // Initialize default settings on first install
      try {
        const settings = await loadSettings();
        console.log('[YouTube Declutter] Settings initialized:', settings);
      } catch (error) {
        console.error('[YouTube Declutter] Failed to initialize settings:', error);
        await resetSettings();
      }

      // Open options page on first install
      chrome.runtime.openOptionsPage();
    } else if (details.reason === 'update') {
      console.log('[YouTube Declutter] Extension updated');
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

  console.log('[YouTube Declutter] Background service worker loaded');
});
