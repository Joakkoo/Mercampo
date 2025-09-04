import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Interceptores Axios globales
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      // Redirigir a login conservando la ruta actual
      const currentPath = window.location.pathname + window.location.search;
      window.location.replace(`/login?from=${encodeURIComponent(currentPath)}`);
    }
    return Promise.reject(error);
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
