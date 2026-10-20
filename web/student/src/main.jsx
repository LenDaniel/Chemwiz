import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/responsive.css';
import { startStudentPwa } from './utils/studentPwa.mjs';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Never delay rendering or register a production worker during Vite development.
if (document.readyState === 'complete') startStudentPwa();
else window.addEventListener('load', () => startStudentPwa(), { once: true });
