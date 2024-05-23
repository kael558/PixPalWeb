import Scene from "../components/AnimatedSphere/Scene";

import ChatPageComponent from "../components/ChatPageComponent";
import StreamManager from "../components/AudioPlayer/StreamManager";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "@hooks/useAuth";
import { useLocalStorage } from "@hooks/useLocalStorage";

//const audioContext = new AudioContext({ sampleRate: 48000 });
const streamManager = new StreamManager();
streamManager.setupAudioWorkletNode();


function ChatPage() {
	const [name, _] = useLocalStorage("name", "");

	const { loginAnonymously, isAuthenticated } = useAuth();


	useEffect(() => {
		// first time user is signed in anonymously
		if (!isAuthenticated() && name === "") {
			//
			loginAnonymously();
		}
	}, []);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100vh",
				backgroundColor: "black",
			}}
		>
			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				pauseOnHover={false}
				draggable
				theme="dark"
			/>
			<Scene streamManager={streamManager} />
			<ChatPageComponent streamManager={streamManager}  />
		</div>
	);
}

export default ChatPage;
