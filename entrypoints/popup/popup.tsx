import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Settings, FEATURE_METADATA, CATEGORY_INFO } from '../../src/utils/types';
import {
  loadSettings, saveSettings, loadCurrentPreset,
  applyPreset, exportSettings, importSettings,
  resetSettings, onSettingsChange
} from '../../src/utils/storage';
import { PRESETS } from '../../src/utils/presets';

type Tab = 'toggles' | 'presets' | 'more';

const UPI_ID         = 'yesnajmush@ybl';
const PAYPAL_URL     = 'https://paypal.me/hanjinajmush';
const FEATURE_FORM   = 'https://forms.gle/B1eb14KJGTRoiS179';
const BUG_FORM       = 'https://forms.gle/dLTobfdskRPJ6poY6';
const GITHUB_URL     = 'https://github.com/najmushsaaquib/d-tox';
const GITHUB_PROFILE = 'https://github.com/najmushsaaquib';

// ── Support Modal ─────────────────────────────────────────────────────────────
function SupportModal({ onClose, showToast }: { onClose: () => void; showToast: (msg: string) => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const copyUPI = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    showToast('UPI ID copied');
  };

  return (
    <div
      className="modal-backdrop"
      ref={backdropRef}
      onClick={e => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label="Support D-Tox">

        {/* Header */}
        <div className="modal-header">
          <span className="modal-title">Support D-Tox</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Section 1 — Share */}
        <div className="modal-section">
          <p className="modal-lead">
            The best way to support D-Tox is to <strong>share it</strong> — with a friend, a colleague, anyone
            who deserves a cleaner YouTube. Help them reclaim their attention too.
          </p>
          <a
            className="modal-share-btn"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share the extension →
          </a>
        </div>

        <div className="modal-divider" />

        {/* Section 2 — Financial */}
        <div className="modal-section">
          <p className="modal-sublabel">Want to support financially? No pressure — but it means a lot.</p>

          {/* PayPal */}
          <a
            className="modal-pay-row"
            href={PAYPAL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="modal-pay-logo">
              {/* PayPal wordmark SVG */}
              <svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal">
                <text x="0" y="16" fontFamily="-apple-system,sans-serif" fontSize="15" fontWeight="700" fill="#003087">Pay</text>
                <text x="28" y="16" fontFamily="-apple-system,sans-serif" fontSize="15" fontWeight="700" fill="#009cde">Pal</text>
              </svg>
            </span>
            <span className="modal-pay-text">Pay via PayPal</span>
            <span className="modal-pay-arrow">↗</span>
          </a>

          {/* UPI */}
          <div className="modal-pay-row modal-upi-row">
            <span className="modal-pay-logo">
              {/* UPI wordmark */}
              <svg viewBox="0 0 44 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="UPI">
                <text x="0" y="15" fontFamily="-apple-system,sans-serif" fontSize="13" fontWeight="800" fill="#097939">U</text>
                <text x="11" y="15" fontFamily="-apple-system,sans-serif" fontSize="13" fontWeight="800" fill="#FF6B35">P</text>
                <text x="22" y="15" fontFamily="-apple-system,sans-serif" fontSize="13" fontWeight="800" fill="#097939">I</text>
              </svg>
            </span>
            <div className="modal-upi-body">
              <span className="modal-upi-id">{UPI_ID}</span>
              <span className="modal-upi-hint">GPay · PhonePe · Paytm · any UPI app</span>
            </div>
            <button className="modal-copy-btn" onClick={copyUPI}>Copy</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Popup ─────────────────────────────────────────────────────────────────────
export default function Popup() {
  const [settings, setSettings]         = useState<Settings | null>(null);
  const [currentPreset, setCurrentPreset] = useState<string | null>(null);
  const [activeTab, setActiveTab]       = useState<Tab>('toggles');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(['feed']));
  const [toast, setToast]               = useState<string | null>(null);
  const [showSupport, setShowSupport]   = useState(false);

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

  const countActive = (cat: string) =>
    (grouped[cat] || []).filter(f => settings[f.key] as boolean).length;

  return (
    <div className={`popup ${!settings.extensionEnabled ? 'disabled' : ''}`}>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <svg width="22" height="22" viewBox="0 0 128 128" fill="none">
              <clipPath id="logo-clip">
                <path d="M36,26 L36,102 C36,104 38,105 41,103 L102,69 C105,67 105,61 102,59 L41,25 C38,23 36,24 36,26 Z"/>
              </clipPath>
              <g clipPath="url(#logo-clip)">
                <rect x="0" y="0" width="128" height="128" fill={settings.extensionEnabled ? '#e53e3e' : '#60a5fa'}/>
                <circle cx="102" cy="64" r="26" fill={settings.extensionEnabled ? '#60a5fa' : '#e53e3e'}/>
              </g>
            </svg>
            <span className="brand">D-Tox</span>
          </div>
          <span className="version">v{chrome.runtime?.getManifest?.()?.version ?? '1.1.0'}</span>
        </div>
        <button
          className={`master-toggle ${settings.extensionEnabled ? 'on' : 'off'}`}
          onClick={handleMasterToggle}
          title={settings.extensionEnabled ? 'Pause D-Tox' : 'Enable D-Tox'}
        >
          <span className="master-track"><span className="master-thumb" /></span>
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
            {tab === 'more'    && 'More'}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="tab-content">

        {/* Toggles Tab */}
        {activeTab === 'toggles' && (
          <div className="toggles-tab">
            {Object.entries(grouped).map(([cat, features]) => {
              const info     = CATEGORY_INFO[cat];
              const active   = countActive(cat);
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
                          <div key={f.key} className="toggle-row">
                            <div className="toggle-text">
                              <span className="toggle-label">
                                {f.label.replace('Hide ', '').replace('Disable ', '')}
                              </span>
                              <span className="toggle-desc">{f.description}</span>
                            </div>
                            <button
                              className={`switch ${on ? 'on' : 'off'}`}
                              onClick={e => { e.preventDefault(); handleToggle(f.key); }}
                              role="switch"
                              aria-checked={on}
                              aria-label={f.label}
                            >
                              <span className="switch-thumb" />
                            </button>
                          </div>
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
              <button className="more-btn" onClick={() => setShowSupport(true)}>
                <span>🤝</span> Support D-Tox
              </button>
              <a className="more-btn" href={FEATURE_FORM} target="_blank" rel="noopener noreferrer">
                <span>💡</span> Request a Feature
              </a>
              <a className="more-btn" href={BUG_FORM} target="_blank" rel="noopener noreferrer">
                <span>🐛</span> Report a Bug
              </a>
              <a className="more-btn" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <span>⭐</span> Star on GitHub
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <button className="footer-btn" onClick={() => setShowSupport(true)}>🤝 Support</button>
        <span className="footer-dot">·</span>
        <a href={FEATURE_FORM} target="_blank" rel="noopener noreferrer">💡 Request Feature</a>
        <span className="footer-dot">·</span>
        <span className="footer-love">Made with ❤️ by <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="author-link">Najmush</a></span>
      </footer>

      {/* Support Modal */}
      {showSupport && (
        <SupportModal onClose={() => setShowSupport(false)} showToast={showToast} />
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
