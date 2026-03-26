import React from 'react';
import { createRoot } from 'react-dom/client';
import Welcome from './Welcome';
import './welcome.css';

createRoot(document.getElementById('root')!).render(<Welcome />);
