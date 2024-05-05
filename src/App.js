import logo from './logo.svg';
import './App.css';
import { AuthProvider } from './hooks/useAuth';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import ChatPage from './pages/ChatPage';
import ErrorPage from './pages/ErrorPage';

// Firebase
import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./config";


initializeApp(firebaseConfig);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>

              <Route path="/chat" element={<ChatPage />} errorElement={<ErrorPage />} />
              {/* Catch all other routes */}
              <Route path="*" element={<Navigate replace to="/login" />} />
          </Routes>
      </AuthProvider>
  </BrowserRouter>

  );
}

export default App;
