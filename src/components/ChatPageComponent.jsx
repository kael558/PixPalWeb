import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./toolbar/TokensBar.module.css";

import Toolbar from "../components/toolbar/Toolbar";
import Chat from "../components/Chat/Chat";

import AuthenticationComponent from "../components/Popups/AuthComponent";
import TokensComponent from "../components/Popups/TokensComponent";
import OnboardingComponent from "../components/Popups/OnboardingComponent";
import PrivacyPolicyComponent from "../components/Popups/PrivacyPolicyComponent";
import ReleaseNotesComponent from "../components/Popups/ReleaseNotesComponent";
import StartComponent from "../components/Popups/StartComponent";

import { CURRENT_VERSION } from "../Constants";

import { HueProvider } from "@hooks/useHue";
import { useAuth } from "@hooks/useAuth";
import { useLocalStorage } from "@hooks/useLocalStorage";


async function get_tokens(accessToken) {
	//console.log("Bearer " + accessToken);
	if (!accessToken) {
		console.error("No access token provided");
		return { tokenCount: 0 };
	}

	return fetch(
		"https://0xlgvmu6h4.execute-api.us-east-1.amazonaws.com/tokens",
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)
		.then((response) => {
			if (response.ok) {
				return response.json(); // Return the promise to be handled by the next .then()
			} else {
				throw new Error("Failed to fetch tokens");
			}
		})
		.then((data) => {
			//console.log("Data:", data);
			return data; // Return data for subsequent handling
		})
		.catch((error) => {
			console.error("Error:", error);
			return { tokenCount: 0 }; // Return default object in case of error
		});
}

function ChatPageComponent({ streamManager, visualQuality, setVisualQuality }) {
	const [messages, setMessages] = useLocalStorage("messages", []);
	const messagesRef = useRef(messages);
	const tokensBarRef = useRef(null);

	const [name, setName] = useLocalStorage("name", "");
	const [version, setVersion] = useLocalStorage("appVersion", "0.0.0");
	const [isPrivacyPolicyAccepted, setPrivacyPolicyAccepted] = useLocalStorage("privacyPolicyAccepted",false);

	const [showChatLog, setShowChatLog] = useLocalStorage("showChatLog", true);
	const [gender, setGender] = useLocalStorage("gender", "Female");
	const [role, setRole] = useLocalStorage("role", "Friend");
	const [voiceQuality, setVoiceQuality] = useLocalStorage(
		"voiceQuality",
		"Low"
	);
	const [chatQuality, setChatQuality] = useLocalStorage(
		"chatQuality",
		"Medium"
	);
	const [characterName, setCharacterName] = useState("Ela");

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

	const [inputMode, setInputMode] = useLocalStorage("inputMode", "text");
	const [isRecording, setIsRecording] = useState(false);

	const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

	const [tokens, setTokens] = useState("Loading...");

	const { getAccessToken, auth } = useAuth();

	useEffect(() => {
		if (gender === "Female") {
			setCharacterName("Ela");
		} else {
			setCharacterName("Blake");
		}
	}, [gender]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 800);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

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

	const updateTokens = () => {
		getAccessToken()
			.then((token) => {
				get_tokens(token).then((data) => {
					let tokens = data?.tokenCount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;
					setTokens(tokens);
				});
			})
			.catch((error) => {
				console.error("Error getting ID token:", error);
			});
	};


	const addMessage = (role, content) => {
		if (content === "") return;

		setMessages((prevMessages) => {
			// Check if there are any previous messages and if the last message's role matches the current role
			if (
				prevMessages.length > 0 &&
				prevMessages[prevMessages.length - 1].role === role
			) {
				return prevMessages.map((msg, index) => {
					if (index === prevMessages.length - 1) {
						// Append content to the last message
						return { ...msg, content: msg.content + " " + content };
					}
					return msg;
				});
			} else if (prevMessages.length > 100) {
				// remove the 10 oldest messages
				const sliced = prevMessages.slice(10);
				sliced.push({ role, content });
				return sliced;
			}

			return [...prevMessages, { role, content }];
		});
	};

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				updateTokens();
			} else {
				setTokens(0);
			}
		});
	}, []);

	const triggerOutOfTokens = () => {
		toast.error("You have run out of tokens. Please purchase more to continue.");

		tokensBarRef.current.style.transform = 'scale(1.2)';
		tokensBarRef.current.style.animation = '';
		tokensBarRef.current.className = styles.rainbowAnimation;

        // Set timeout to revert styles back to normal after 3 seconds
        setTimeout(() => {
            tokensBarRef.current.style.transform = 'scale(1)';
            tokensBarRef.current.style.animation = 'none';
        }, 2000);
	};

	const onMessageSend = async (content) => {
		const accessToken = await getAccessToken();
		if (!accessToken) {
			toast.error("Please log in to send messages");
			return;
		}


		if (parseInt(tokens) <= 0 && messages.filter((msg) => msg.role === "user").length >= 10){
			triggerOutOfTokens();
			return;
		}

		streamManager.stop(); // interrupt any ongoing audio playback

		const updatedMessages = [...messagesRef.current, { role: "user", content }];
		setMessages(updatedMessages);

		window.gtag("event", "spend_virtual_currency", {
			value: content.length,
			virtual_currency_name: "tokens",
			item_name: "text",
		 });

		try {
			const voice = gender === "Female" ? "female3" : "male1";
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
					voice,
				}),
			};

			const response = await streamManager.fetchData(url, options);
			await streamManager.parseStream(response, addMessage, showComponent);

			updateTokens();
		} catch (error) {
			if (error.name === "AbortError") {
				console.log("Request aborted");
				return;
			}

			console.error(error);
			const message = error.message || "There was an error with the server";
			toast.error(message);
		}
	};

	const onAudioSend = async (blob, duration) => {
		const accessToken = await getAccessToken();
		if (!accessToken) {
			toast.error("Please log in to send messages");
			return;
		}

		if (parseInt(tokens) <= 0 && messages.filter((msg) => msg.role === "user").length >= 10){
			triggerOutOfTokens();
			return;
		}

		try {
			window.gtag("event", "spend_virtual_currency", {
				value: duration,
				virtual_currency_name: "tokens",
				item_name: "audio",
			 });



			//const blob = new Blob(chunks, { type: 'audio/webm' });
			const voice = gender === "Female" ? "female1" : "male1";

			const fd = new FormData();
			fd.append("messages", JSON.stringify(messagesRef.current.slice(-5)));
			fd.append("username", name);
			fd.append("role", role);
			fd.append("languageModelQuality", chatQuality);
			fd.append("voice", voice);
			fd.append("duration", duration);
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

			updateTokens();
		} catch (error) {
			// check for abort error
			if (error.name === "AbortError") {
				console.log("Request aborted");
				return;
			}


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
		<HueProvider>
			<div>
				<div
			
					style={{
						position: "absolute", // Correct property for positioning
						top: 0, // Position at the top of the parent
						left: 0, // Position at the left of the parent
						width: "100vw", // Full viewport width
						height: "100vh", // Full viewport height (corrected from 100vw)
						boxShadow: isRecording
							? "inset 0 0 40px rgba(255,40,69,0.8)"
							: "none",
						userSelect: "none", // Prevent text selection
				
					}}
				/>

				<Chat
					name={name}
					messages={messages}
					characterName={characterName}
					isMobile={isMobile}
					onSend={onMessageSend}
					onAudio={onAudioSend}
					streamManager={streamManager}
					inputMode={inputMode}
					setIsRecording={setIsRecording}
					isRecording={isRecording}
					showChatLog={showChatLog}
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
					visualQuality={visualQuality}
					setVisualQuality={setVisualQuality}
					tokens={tokens}
					isMobile={isMobile}
					setShowChatLog={setShowChatLog}
					showChatLog={showChatLog}
					tokensBarRef={tokensBarRef}
				/>

				<AuthenticationComponent
					isVisible={isLoginVisible}
					onClose={() => setLoginVisible(false)}
				/>
				<TokensComponent
					isVisible={isTokensPanelVisible}
					onClose={() => setTokensPanelVisible(false)}
					updateTokens={updateTokens}
					isMobile={isMobile}
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
					setInputMode={setInputMode}
				/>
			</div>
		</HueProvider>
	);
}

export default ChatPageComponent;
