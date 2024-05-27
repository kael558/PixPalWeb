import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Toolbar from "../components/toolbar/Toolbar";
import ChatInput from "../components/ChatInput";

import AuthenticationComponent from "../components/Popups/AuthComponent";
import TokensComponent from "../components/Popups/TokensComponent";
import OnboardingComponent from "../components/Popups/OnboardingComponent";
import PrivacyPolicyComponent from "../components/Popups/PrivacyPolicyComponent";
import ReleaseNotesComponent from "../components/Popups/ReleaseNotesComponent";
import StartComponent from "../components/Popups/StartComponent";

import { CURRENT_VERSION } from "../Constants";

import { useAuth } from "@hooks/useAuth";
import { useLocalStorage } from "@hooks/useLocalStorage";

function ChatPageComponent({ streamManager }) {



	const [messages, setMessages] = useLocalStorage("messages", []);
	const messagesRef = useRef(messages);

	const [name, setName] = useLocalStorage("name", "");
	const [version, setVersion] = useLocalStorage("appVersion", "0.0.0");
	const [isPrivacyPolicyAccepted, setPrivacyPolicyAccepted] = useLocalStorage(
		"privacyPolicyAccepted",
		false
	);

	const [gender, setGender] = useLocalStorage("gender", "Female");
	const [role, setRole] = useLocalStorage("role", "Friend");
	const [voiceQuality, setVoiceQuality] = useLocalStorage("voiceQuality", "Low");
	const [chatQuality, setChatQuality] = useLocalStorage("chatQuality", "Low");

	const [isLoginVisible, setLoginVisible] = useState(false);
	const [isTokensPanelVisible, setTokensPanelVisible] = useState(false);
	const [isOnboardingVisible, setOnboardingVisible] = useState(name === "");
	const [isPrivacyPolicyVisible, setPrivacyPolicyVisible] = useState(
		!isPrivacyPolicyAccepted
	);
	const [isReleaseNotesVisible, setReleaseNotesVisible] = useState(
		version !== CURRENT_VERSION
	);
	const [isStartVisible, setStartVisible] = useState(true);
	const [isStartFinished, setStartFinished] = useState(false);

	const [inputMode, setInputMode] = useState("text");
	const [isRecording, setIsRecording] = useState(false);

	const { getAccessToken } = useAuth();

	const showComponent = (component) => {
		switch (component) {
			case "Token Shop":
				setTokensPanelVisible(true);
				break;
			case "Privacy Policy":
				setPrivacyPolicyVisible(true);
				break;
			default:
				break;
		}
	};

	const acceptPrivacyPolicy = () => {
		setPrivacyPolicyAccepted(true);
		setPrivacyPolicyVisible(false);
	};

	const acceptNewVersion = () => {
		setVersion(CURRENT_VERSION);
		setReleaseNotesVisible(false);
	};

	const addMessage = (role, content) => {
		if (content === "") return;

		setMessages((prevMessages) => {
			if (prevMessages.length > 100) {
				// remove the 10 oldest messages
				const sliced = prevMessages.slice(10);
				sliced.push({ role, content });
				return sliced;
			}
			
			return [...prevMessages, { role, content }]
		});
	};

	const onMessageSend = async (content) => {
		const accessToken = await getAccessToken();
		if (!accessToken) {
			toast.error("Please log in to send messages");
			return;
		}

		streamManager.stop(); // interrupt any ongoing audio playback

		const updatedMessages = [...messagesRef.current, { role: "user", content }];
		setMessages(updatedMessages);

		try {
			const url =
				"https://lg5m7pmkstz3ims7qkmh7u4xfi0gjebf.lambda-url.us-east-1.on.aws/";
			const options = {
				method: "POST",
				headers: {
					Authorization: "Bearer " + accessToken,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: updatedMessages.slice(-5),
					username: name,
					role: role,
					languageModelQuality: chatQuality,
					gender: gender
				}),
			};

			const response = await streamManager.fetchData(url, options);
			await streamManager.parseStream(response, addMessage, showComponent);
		} catch (error) {
			console.error(error);
			const message = error.message || "There was an error with the server";
			toast.error(message);
		}
	};

	const onAudioSend = async (blob) => {
		const accessToken = await getAccessToken();
		if (!accessToken) {
			toast.error("Please log in to send messages");
			return;
		}

		try {
			//const blob = new Blob(chunks, { type: 'audio/webm' });

			const fd = new FormData();
			fd.append("messages", JSON.stringify(messagesRef.current.slice(-5)));
			fd.append("username", name);
			fd.append("role", role);
			fd.append("languageModelQuality", chatQuality);
			fd.append("gender", gender);
			fd.append("file", blob, "speech.webm");

			const url =
				"https://jfjrhqljjddvfemmcwbtn6fvmi0wndeu.lambda-url.us-east-1.on.aws/";
			const options = {
				method: "POST",
				headers: {
					Authorization: "Bearer " + accessToken,
				},
				body: fd,
			};

			const response = await streamManager.fetchData(url, options);
			await streamManager.parseStream(
				response,
				addMessage,
				showComponent,
				true
			);
			//await getAudioStreamFromAudioInput(blob, messages, name, accessToken, audioWorkletNode, addMessage, showComponent, abortController);
		} catch (error) {
			console.error(error);
			const message = error.message || "There was an error with the server";
			toast.error(message);
		}
	};

	useEffect(() => {
		messagesRef.current = messages;
	}, [messages]);

	useEffect(() => {
		if (!role) return;
		if (!isStartFinished) return;

		setStartVisible(false);
	}, [role, isStartFinished]);

    //console.log(isRecording);

	return (
		<div>
			<div
				onMouseDown={
					inputMode === "audio" ? () => {
                        //console.log("mouseDown");
                        setIsRecording(true)} : () => {}
				}
				onMouseUp={
					inputMode === "audio" ? () => setIsRecording(false) : () => {}
				}
				onTouchStart={
					inputMode === "audio" ? () => setIsRecording(true) : () => {}
				}
				onTouchEnd={
					inputMode === "audio" ? () => setIsRecording(false) : () => {}
				}
				style={{
					position: "absolute", // Correct property for positioning
					top: 0, // Position at the top of the parent
					left: 0, // Position at the left of the parent
					width: "100vw", // Full viewport width
					height: "100vh", // Full viewport height (corrected from 100vw)
					boxShadow: isRecording
						? "inset 0 0 40px rgba(255,40,69,0.8)"
						: "none",
				}}
			/>

			<Toolbar
				showLoginUI={() => setLoginVisible(true)}
				showTokensPanel={() => setTokensPanelVisible(true)}
				streamManager={streamManager}
				setMessages={setMessages}
				inputMode={inputMode}
				setInputMode={setInputMode}
				gender={gender}
				setGender={setGender}
				role={role}
				setRole={setRole}
				voiceQuality={voiceQuality}
				setVoiceQuality={setVoiceQuality}
				chatQuality={chatQuality}
				setChatQuality={setChatQuality}
			/>

			<ChatInput
				onSend={onMessageSend}
				onAudio={onAudioSend}
				streamManager={streamManager}
				inputMode={inputMode}
				setIsRecording={setIsRecording}
				isRecording={isRecording}
			/>
			<AuthenticationComponent
				isVisible={isLoginVisible}
				onClose={() => setLoginVisible(false)}
			/>
			<TokensComponent
				isVisible={isTokensPanelVisible}
				onClose={() => setTokensPanelVisible(false)}
			/>

			<StartComponent
				isVisible={isStartVisible}
				setRole={setRole}
				onMessageSend={onMessageSend}
				setStartFinished={setStartFinished}
			/>
			<PrivacyPolicyComponent
				isVisible={isPrivacyPolicyVisible}
				onClose={acceptPrivacyPolicy}
			/>
			<ReleaseNotesComponent
				isVisible={isReleaseNotesVisible}
				onClose={acceptNewVersion}
				version={version}
			/>
			<OnboardingComponent
				isVisible={isOnboardingVisible}
				onClose={() => setOnboardingVisible(false)}
				streamManager={streamManager}
				name={name}
				setName={setName}
			/>
		</div>
	);
}

export default ChatPageComponent;
