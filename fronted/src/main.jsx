import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App.jsx';
import './styles/tailwind.css';
import './styles/base.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap your App in the router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);