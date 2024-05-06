import logo from './logo.svg';
import './App.css';
import { AuthProvider } from './hooks/useAuth';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import ChatPage from './pages/ChatPage';
import ErrorPage from './pages/ErrorPage';

// Firebase
import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./config";

initializeApp(firebaseConfig);

function App() {

  return (
      <AuthProvider>
          <ChatPage />
      </AuthProvider>
  );
}

export default App;
