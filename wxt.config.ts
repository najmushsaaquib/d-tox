import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  outDir: 'dist',
  manifest: {
    name: 'D-Tox: YouTube Detox',
    version: '1.0.0',
    description: 'Detox your YouTube. Hide distractions, disable autoplay, and reclaim your attention.',
    permissions: [
      'storage',
      'activeTab'
    ],
    host_permissions: [
      'https://www.youtube.com/*',
      'https://youtube.com/*',
      'https://m.youtube.com/*'
    ],
    icons: {
      16: '/icon-16.png',
      48: '/icon-48.png',
      128: '/icon-128.png'
    },
    action: {
      default_title: 'D-Tox'
    }
  }
});
