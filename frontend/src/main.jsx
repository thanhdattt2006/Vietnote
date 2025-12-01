import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// --- THÊM ĐOẠN NÀY ---
// Xóa class preload để kích hoạt lại transition sau khi load xong
window.addEventListener('load', () => {
  document.body.classList.remove('preload');
});
// --------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
