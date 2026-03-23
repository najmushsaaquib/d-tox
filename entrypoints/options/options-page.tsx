import React from 'react';

export default function OptionsPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh',
      background: '#0d0d0d', color: '#e8e8e8', fontFamily: 'system-ui, sans-serif',
      textAlign: 'center', padding: '40px'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧪</div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>D-Tox</h1>
      <p style={{ color: '#999', fontSize: '14px', maxWidth: '320px', lineHeight: 1.5 }}>
        All settings are available directly in the extension popup.
        Click the D-Tox icon in your browser toolbar to configure.
      </p>
    </div>
  );
}
