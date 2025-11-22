import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import App from './App.jsx';
import Dashboard from './pages/Dashboard.jsx';
import './index.css';

function AppRoutes() {
  const location = useLocation();
  
  return (
    <Routes key={location.pathname}>
      <Route path="/" element={<App />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
