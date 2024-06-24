import "./App.css";
import { useFirebase } from "@hooks/useFirebase";
import { AuthProvider } from "@hooks/useAuth";
import { OpusMediaRecorder } from "opus-media-recorder";
import platform from "platform-detect";

import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, setUserId } from "firebase/analytics";
//import { firebaseConfig } from "./config";

// Pages
import ChatPage from "./pages/ChatPage";

// Use OpusMediaRecorder on all browsers except Chrome on iOS
if (!platform.chrome || platform.chromeIos) {
	window.MediaRecorder = OpusMediaRecorder;
}

function detectOS(env) {
    if (env.windows) return "Windows";
    if (env.macos) return "macOS";
    if (env.linux || env.linuxBased) return "Linux";
    if (env.android) return "Android";
    if (env.ios) return "iOS";
    if (env.chromeos) return "Chrome OS";
    if (env.tizen) return "Tizen";
    return "Unknown OS";
}

function detectBrowser(env) {
    if (env.chrome) return "Chrome";
    if (env.edge) return "Edge";
    if (env.safari) return "Safari";
    if (env.firefox) return "Firefox";
    if (env.opera) return "Opera";
    if (env.ie) return "Internet Explorer";
    if (env.samsungBrowser) return "Samsung Internet";
    return "Unknown Browser";
}



const firebaseConfig = {
    apiKey: "AIzaSyDi6kPY5HbcwH6KKJzV2MOfjsEWDymG_q4",
    authDomain: "pixpal-1707752767387.firebaseapp.com",
    projectId: "pixpal-1707752767387",
    storageBucket: "pixpal-1707752767387.appspot.com",
    messagingSenderId: "42814286164",
    appId: "1:42814286164:web:2a6e4a0bca587a9b6780c1",
    measurementId: "G-TCVKJK942W"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


logEvent(analytics, "login");

function App() {
	const { logEvent } = useFirebase();

	logEvent("device_details", {
		os: detectOS(platform),
		browser: detectBrowser(platform)
	});

	return (
		<AuthProvider>
			<ChatPage />
		</AuthProvider>
	);
}

export default App;
