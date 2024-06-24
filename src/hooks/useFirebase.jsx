import React, { createContext, useContext } from "react";

/*import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, setUserId } from "firebase/analytics";
import { firebaseConfig } from "../config";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics();



logEvent(analytics, "notification_received");

// Create a React Context for Firebase Analytics
const FirebaseContext = createContext(null);

// Custom logEvent function
const _logEvent = (eventName, params) => {
	if (analytics) {
		console.log("Logging event:", eventName, params);
		logEvent(analytics, eventName, params);
	}
};

const _setUserId = (userId) => {
	if (analytics) {
		console.log("Setting user ID:", userId);
		logEvent(analytics, "login");

		setUserId(analytics, userId);
	}
};*/
const FirebaseContext = createContext(null);
const _logEvent = (eventName, params) => {
	console.log("Logging event:", eventName, params);
};

const _setUserId = (userId) => {
	console.log("Setting user ID:", userId);
};

export const FirebaseProvider = ({ children }) => {
	return (
		<FirebaseContext.Provider
			value={{ logEvent: _logEvent, setUserId: _setUserId }}
		>
			{children}
		</FirebaseContext.Provider>
	);
};

export const useFirebase = () => useContext(FirebaseContext);
