import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// Без StrictMode только в учебной лаборатории, чтобы счётчики render были нагляднее.
// В реальных проектах StrictMode оставлять полезно; он выполняет дополнительные проверки в dev.
createRoot(document.getElementById('root')).render(<App />);
