import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
// Здесь намеренно нет StrictMode, чтобы счётчики рендеров были нагляднее.
// В обычных проектах StrictMode полезен; его дополнительные рендеры в dev — ожидаемы.
createRoot(document.getElementById('root')).render(<App />);
