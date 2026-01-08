import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ExamPage from './pages/ExamPage';
import CompletePage from './pages/CompletePage';
import GuidePage from './pages/GuidePage';
import './index.css';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/complete" element={<CompletePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
