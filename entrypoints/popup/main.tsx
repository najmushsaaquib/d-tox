import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './popup';
import '../styles/popup.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Popup />);
}
