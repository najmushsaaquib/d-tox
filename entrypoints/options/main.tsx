import React from 'react';
import { createRoot } from 'react-dom/client';
import OptionsPage from './options-page';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<OptionsPage />);
}
