import "./App.css";
import { AuthProvider } from "@hooks/useAuth";
import { OpusMediaRecorder } from "opus-media-recorder";
import platform from "platform-detect";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";

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

// Initialize Firebase
initializeApp(firebaseConfig);

function App() {
    window.gtag("event", "device_details", {
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
