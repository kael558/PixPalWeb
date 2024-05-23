
import './App.css';
import { AuthProvider } from '@hooks/useAuth';
import { OpusMediaRecorder } from 'opus-media-recorder';
import platform from "platform-detect";

// Pages
import ChatPage from './pages/ChatPage';

// Firebase
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
initializeApp(firebaseConfig);


if (!platform.chrome || platform.chromeIos){
  window.MediaRecorder = OpusMediaRecorder;
}

function App() {

  return (
      <AuthProvider>
          <ChatPage />
      </AuthProvider>
  );
}

export default App;
