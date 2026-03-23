import {
  DEFAULT_SETTINGS,
  Settings,
  Preset,
  STORAGE_KEYS
} from './types';

/**
 * Storage management utility
 * Uses chrome.storage.local when in extension context,
 * falls back to localStorage for standalone preview/testing.
 */

const isChromeExtension =
  typeof chrome !== 'undefined' &&
  typeof chrome.storage !== 'undefined' &&
  typeof chrome.storage.local !== 'undefined';

// --- localStorage fallback helpers ---

function localGet(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function localSet(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Public API ---

/**
 * Load settings from storage, with fallback to defaults
 */
export async function loadSettings(): Promise<Settings> {
  try {
    let settings: unknown;

    if (isChromeExtension) {
      const stored = await chrome.storage.local.get(STORAGE_KEYS.settings);
      settings = stored[STORAGE_KEYS.settings];
    } else {
      settings = localGet(STORAGE_KEYS.settings);
    }

    if (settings && typeof settings === 'object') {
      return { ...DEFAULT_SETTINGS, ...(settings as Partial<Settings>) };
    }

    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to storage
 */
export async function saveSettings(settings: Settings): Promise<void> {
  try {
    if (isChromeExtension) {
      await chrome.storage.local.set({
        [STORAGE_KEYS.settings]: settings
      });
    } else {
      localSet(STORAGE_KEYS.settings, settings);
    }
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}

/**
 * Update a single setting
 */
export async function updateSetting<K extends keyof Settings>(
  key: K,
  value: Settings[K]
): Promise<void> {
  const settings = await loadSettings();
  settings[key] = value;
  await saveSettings(settings);
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(): Promise<void> {
  await saveSettings(DEFAULT_SETTINGS);
}

/**
 * Load current preset selection
 */
export async function loadCurrentPreset(): Promise<string | null> {
  try {
    if (isChromeExtension) {
      const stored = await chrome.storage.local.get(STORAGE_KEYS.currentPreset);
      return stored[STORAGE_KEYS.currentPreset] || null;
    } else {
      return (localGet(STORAGE_KEYS.currentPreset) as string) || null;
    }
  } catch (error) {
    console.error('Failed to load current preset:', error);
    return null;
  }
}

/**
 * Save current preset selection
 */
export async function saveCurrentPreset(presetId: string): Promise<void> {
  try {
    if (isChromeExtension) {
      await chrome.storage.local.set({
        [STORAGE_KEYS.currentPreset]: presetId
      });
    } else {
      localSet(STORAGE_KEYS.currentPreset, presetId);
    }
  } catch (error) {
    console.error('Failed to save current preset:', error);
    throw error;
  }
}

/**
 * Apply a preset to settings
 */
export async function applyPreset(preset: Preset): Promise<void> {
  const settings = await loadSettings();
  const updated = {
    ...settings,
    ...preset.settings
  };
  await saveSettings(updated);
  await saveCurrentPreset(preset.id);
}

/**
 * Export settings as JSON for backup/sharing
 */
export function exportSettings(settings: Settings): string {
  return JSON.stringify(settings, null, 2);
}

/**
 * Import settings from JSON
 */
export async function importSettings(json: string): Promise<void> {
  try {
    const imported = JSON.parse(json);

    if (typeof imported !== 'object' || imported === null) {
      throw new Error('Invalid settings format');
    }

    const settings: Settings = {
      ...DEFAULT_SETTINGS,
      ...imported
    };

    await saveSettings(settings);
  } catch (error) {
    console.error('Failed to import settings:', error);
    throw error;
  }
}

/**
 * Listen for settings changes across all extension components
 */
export function onSettingsChange(
  callback: (settings: Settings) => void
): () => void {
  if (isChromeExtension) {
    const listener = (changes: Record<string, chrome.storage.StorageChange>) => {
      if (STORAGE_KEYS.settings in changes) {
        const newSettings = changes[STORAGE_KEYS.settings].newValue;
        if (newSettings) {
          callback(newSettings);
        }
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }

  // Fallback: listen for storage events (cross-tab only)
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEYS.settings && e.newValue) {
      try {
        callback(JSON.parse(e.newValue));
      } catch { /* ignore parse errors */ }
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

/**
 * Get all storage data (for debugging)
 */
export async function getAllStorage(): Promise<Record<string, unknown>> {
  try {
    if (isChromeExtension) {
      return await chrome.storage.local.get(null);
    }
    const result: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) result[key] = localGet(key);
    }
    return result;
  } catch (error) {
    console.error('Failed to get all storage:', error);
    return {};
  }
}

/**
 * Clear all extension storage
 */
export async function clearAllStorage(): Promise<void> {
  try {
    if (isChromeExtension) {
      await chrome.storage.local.clear();
    } else {
      localStorage.clear();
    }
  } catch (error) {
    console.error('Failed to clear storage:', error);
    throw error;
  }
}
