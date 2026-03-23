import React, { useEffect, useState, useCallback } from 'react';
import { Settings, FEATURE_METADATA, CATEGORY_INFO } from '../../src/utils/types';
import {
  loadSettings, saveSettings, loadCurrentPreset,
  applyPreset, exportSettings, importSettings,
  resetSettings, onSettingsChange
} from '../../src/utils/storage';
import { PRESETS } from '../../src/utils/presets';

type Tab = 'toggles' | 'presets' | 'more';

const DONATE_UPI = 'upi://pay?pa=yesnajmush@ybl&pn=Najmush&cu=INR';
const FEATURE_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSe_PLACEHOLDER/viewform';
const GITHUB_URL = 'https://github.com/najmushsaaquib/d-tox';

export default function Popup() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [currentPreset, setCurrentPreset] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('toggles');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(['feed']));
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const s = await loadSettings();
      const p = await loadCurrentPreset();
      setSettings(s);
      setCurrentPreset(p);
    })();
  }, []);

  useEffect(() => {
    if (!settings) return;
    return onSettingsChange(setSettings);
  }, [!!settings]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  }, []);

  const handleToggle = async (key: keyof Settings) => {
    if (!settings) return;
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await saveSettings(next);
    setCurrentPreset(null);
  };

  const handleMasterToggle = async () => {
    if (!settings) return;
    const next = { ...settings, extensionEnabled: !settings.extensionEnabled };
    setSettings(next);
    await saveSettings(next);
    showToast(next.extensionEnabled ? 'D-Tox enabled' : 'D-Tox paused');
  };

  const handlePreset = async (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    await applyPreset(preset);
    setCurrentPreset(presetId);
    const s = await loadSettings();
    setSettings(s);
    showToast(`Applied "${preset.name}"`);
  };

  const toggleCat = (cat: string) => {
    const next = new Set(expandedCats);
    next.has(cat) ? next.delete(cat) : next.add(cat);
    setExpandedCats(next);
  };

  const handleExport = () => {
    if (!settings) return;
    const json = exportSettings(settings);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'd-tox-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Settings exported');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      await importSettings(text);
      const s = await loadSettings();
      setSettings(s);
      showToast('Settings imported');
    } catch {
      showToast('Invalid file');
    }
    e.target.value = '';
  };

  const handleReset = async () => {
    if (!confirm('Reset all settings to defaults?')) return;
    await resetSettings();
    const s = await loadSettings();
    setSettings(s);
    setCurrentPreset(null);
    showToast('Settings reset');
  };

  if (!settings) {
    return <div className="popup"><div className="loading">Loading...</div></div>;
  }

  const grouped: Record<string, typeof FEATURE_METADATA> = {};
  FEATURE_METADATA.forEach(f => {
    if (!grouped[f.category]) grouped[f.category] = [];
    grouped[f.category].push(f);
  });

  const countActive = (cat: string) => {
    const features = grouped[cat] || [];
    return features.filter(f => settings[f.key] as boolean).length;
  };

  return (
    <div className={`popup ${!settings.extensionEnabled ? 'disabled' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" fill="#ff4444"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8"/>
            </svg>
            <span className="brand">D-Tox</span>
          </div>
          <span className="version">v1.0</span>
        </div>
        <button
          className={`master-toggle ${settings.extensionEnabled ? 'on' : 'off'}`}
          onClick={handleMasterToggle}
          title={settings.extensionEnabled ? 'Pause D-Tox' : 'Enable D-Tox'}
        >
          <span className="master-track">
            <span className="master-thumb" />
          </span>
        </button>
      </header>

      {/* Tab Bar */}
      <nav className="tab-bar">
        {(['toggles', 'presets', 'more'] as Tab[]).map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'toggles' && 'Toggles'}
            {tab === 'presets' && 'Presets'}
            {tab === 'more' && 'More'}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="tab-content">

        {/* Toggles Tab */}
        {activeTab === 'toggles' && (
          <div className="toggles-tab">
            {Object.entries(grouped).map(([cat, features]) => {
              const info = CATEGORY_INFO[cat];
              const active = countActive(cat);
              const expanded = expandedCats.has(cat);
              return (
                <div key={cat} className="category">
                  <button className="cat-header" onClick={() => toggleCat(cat)}>
                    <span className="cat-left">
                      <span className="cat-icon">{info?.icon}</span>
                      <span className="cat-name">{info?.label}</span>
                      <span className={`cat-count ${active > 0 ? 'has-active' : ''}`}>{active}/{features.length}</span>
                    </span>
                    <span className={`cat-arrow ${expanded ? 'open' : ''}`}>›</span>
                  </button>
                  {expanded && (
                    <div className="cat-items">
                      {features.map(f => {
                        const on = settings[f.key] as boolean;
                        return (
                          <label
                            key={f.key}
                            className="toggle-row"
                            title={f.description}
                          >
                            <span className="toggle-label">
                              {f.label.replace('Hide ', '').replace('Disable ', '')}
                            </span>
                            <button
                              className={`switch ${on ? 'on' : 'off'}`}
                              onClick={(e) => { e.preventDefault(); handleToggle(f.key); }}
                              role="switch"
                              aria-checked={on}
                              aria-label={f.description}
                            >
                              <span className="switch-thumb" />
                            </button>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Presets Tab */}
        {activeTab === 'presets' && (
          <div className="presets-tab">
            <div className="presets-grid">
              {PRESETS.map(preset => (
                <button
                  key={preset.id}
                  className={`preset-card ${currentPreset === preset.id ? 'active' : ''}`}
                  onClick={() => handlePreset(preset.id)}
                >
                  <span className="preset-icon">{preset.icon}</span>
                  <span className="preset-name">{preset.name}</span>
                  <span className="preset-desc">{preset.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* More Tab */}
        {activeTab === 'more' && (
          <div className="more-tab">
            <div className="more-section">
              <h3 className="more-heading">Settings</h3>
              <button className="more-btn" onClick={handleExport}>
                <span>💾</span> Export Settings
              </button>
              <label className="more-btn">
                <span>📥</span> Import Settings
                <input type="file" accept=".json" onChange={handleImport} hidden />
              </label>
              <button className="more-btn danger" onClick={handleReset}>
                <span>🔄</span> Reset to Defaults
              </button>
            </div>
            <div className="more-divider" />
            <div className="more-section">
              <h3 className="more-heading">Support</h3>
              <a className="more-btn" href={DONATE_UPI}>
                <span>💸</span> Donate via UPI
              </a>
              <a className="more-btn" href={FEATURE_FORM} target="_blank" rel="noopener noreferrer">
                <span>💡</span> Request a Feature
              </a>
              <a className="more-btn" href={GITHUB_URL + '/issues'} target="_blank" rel="noopener noreferrer">
                <span>🐛</span> Report a Bug
              </a>
              <a className="more-btn" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <span>⭐</span> Star on GitHub
              </a>
            </div>
            <div className="more-footer">
              <p>D-Tox v1.0</p>
              <p className="more-subtle">Made with ❤️ by Najmush</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <a href={DONATE_UPI}>💸 Donate</a>
        <span className="footer-dot">·</span>
        <a href={FEATURE_FORM} target="_blank" rel="noopener noreferrer">💡 Request Feature</a>
        <span className="footer-dot">·</span>
        <span className="footer-love">Made with ❤️ by Najmush</span>
      </footer>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
