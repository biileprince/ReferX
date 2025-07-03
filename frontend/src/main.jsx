import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import QueryProvider from './providers/QueryProvider';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
  
        <App />
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>
);