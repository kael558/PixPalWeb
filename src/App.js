
import './App.css';
import { AuthProvider } from './hooks/useAuth';

// Pages
import ChatPage from './pages/ChatPage';

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
