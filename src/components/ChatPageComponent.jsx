import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ChatPageComponent.module.css";
import { MicVAD } from '@ricky0123/vad';

import Toolbar from "../components/toolbar/Toolbar";
import Chat from "../components/Chat/Chat";

import AuthenticationComponent from "../components/Popups/AuthComponent";
import TokensComponent from "../components/Popups/TokensComponent";
import OnboardingComponent from "../components/Popups/OnboardingComponent";
import PrivacyPolicyComponent from "../components/Popups/PrivacyPolicyComponent";
import ReleaseNotesComponent from "../components/Popups/ReleaseNotesComponent";
import FeedbackPopup from "../components/Popups/FeedbackPopup";

import SplashHeader from "./Popups/SplashComponent";

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



	const [showChatLog, setShowChatLog] = useLocalStorage("showChatLog", true);

	
	const [gender, setGender] = useLocalStorage("gender", "Female");
	const genderRef = useRef(gender);

	const [role, setRole] = useLocalStorage("role", "Friend");
	const roleRef = useRef(role);


	const [voiceQuality, setVoiceQuality] = useLocalStorage(
		"voiceQuality",
		"Low"
	);
	const voiceQualityRef = useRef(voiceQuality);


	const [chatQuality, setChatQuality] = useLocalStorage(
		"chatQuality",
		"Medium"
	);
	const chatQualityRef = useRef(chatQuality);

	const [narration, setNarration] = useLocalStorage("narration", false);
	const narrationRef = useRef(narration);

	const [characterName, setCharacterName] = useState("Viona");
	const characterNameRef = useRef(characterName);

	const [scene, setScene] = useLocalStorage("scene", "");
	const sceneRef = useRef(scene);

	const [isLoginVisible, setLoginVisible] = useState(false);
	const [isTokensPanelVisible, setTokensPanelVisible] = useState(false);
	const [isOnboardingVisible, setOnboardingVisible] = useState(name === "");
	const [isPrivacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);
	const [isReleaseNotesVisible, setReleaseNotesVisible] = useState(
		version !== CURRENT_VERSION && version !== "0.0.0"
	);

	const vadRef = useRef(null);
	const [useVAD, setUseVAD] = useLocalStorage("useVAD", false);
	const [inputMode, setInputMode] = useLocalStorage("inputMode", "text");
	const [isRecording, setIsRecording] = useState(false);

	const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

	const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

	const [tokens, setTokens] = useState("Loading...");

	const [isSplashVisible, setSplashVisible] = useState(true);
	const [borderAnimation, setBorderAnimation] = useState(false);
	const [isThinking, setIsThinking] = useState(false);

	const audioRef = useRef(null);

	const { getAccessToken, auth } = useAuth();

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 800);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (streamManager && streamManager.onmessage) {
			streamManager.onmessage({
				name: "change_yPosition",
				data: { yPosition: isMobile && !isSplashVisible ? 0.7 : 0.0 },
			});
		}
	}, [isMobile, streamManager.onmessage]);

	useEffect(() => {
		if (gender === "Female") {
			setCharacterName("Viona");
		} else {
			setCharacterName("Blake");
		}
		genderRef.current = gender;
	}, [gender]);

	useEffect(() => {
		roleRef.current = role;
	}, [role]);

	useEffect(() => {
		voiceQualityRef.current = voiceQuality;
	}, [voiceQuality]);

	useEffect(() => {
		chatQualityRef.current = chatQuality;
	}, [chatQuality]);

	useEffect(() => {
		narrationRef.current = narration;
	}, [narration]);

	useEffect(() => {
		characterNameRef.current = characterName;
	}, [characterName]);

	useEffect(() => {
		sceneRef.current = scene;
	}, [scene]);

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

	const playOnboarding = async (input_mode) => {
		if (name === "") {
			toast.error("Please enter a name");
			return;
		}

		setOnboardingVisible(false);
		setInputMode(input_mode);
		streamManager.playAudioFile(`hello_${input_mode}.wav`).catch(console.error);

		setTimeout(() => {
			setBorderAnimation(true);
		}, 6000);

		setTimeout(() => {
			setBorderAnimation(false);
		}, 9000);
	};

	const continueSplash = () => {
		if (isMobile) {
			streamManager.onmessage({
				name: "change_yPosition",
				data: { yPosition: 0.7 },
			});
		}
		setSplashVisible(false);
	};

	const acceptPrivacyPolicy = () => {
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
					let tokens =
						data?.tokenCount
							?.toString()
							?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;
					setTokens(tokens);
				});
			})
			.catch((error) => {
				console.error("Error getting ID token:", error);
			});
	};

	const addMessage = (role, content) => {
		if (content === "") return;

		if (role === "assistant") {
			setIsThinking(false);
		}

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

		// if 8 messages have been sent, then set feedback popup to true
		if (messages.length === 8 && !showFeedbackPopup) {
			audioRef.current.play();
			setShowFeedbackPopup(true);
		}
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


	useEffect(() => {
		const initializeVAD = async () => {
			try {
				if (typeof window.vadit === 'function') {
					window.vadit(() => setIsRecording(true), () => setIsRecording(false)).then(vad => {
						console.log('VAD initialized');
						vadRef.current = vad;
					  });
					}
		  
			} catch (error) {
			  console.error("Error initializing VAD:", error);
			  // Handle the error (e.g., show an error message to the user)
			}
		  };

		initializeVAD();

		return () => {
			if (vadRef.current) {
				vadRef.current.pause();
			}
		};
	}, []);

	useEffect(() => {
		console.log("useVAD:", useVAD);
		if (vadRef.current) {
			if (useVAD) {
				console.log("Starting VAD");
				vadRef.current.start();
			} else {
				console.log("Stopping VAD");
				vadRef.current.pause();
			}
		}
	}, [useVAD]);

	const triggerOutOfTokens = () => {
		toast.error(
			"You have run out of tokens. Please purchase more to continue."
		);

		tokensBarRef.current.style.transform = "scale(1.2)";
		tokensBarRef.current.style.animation = "";
		tokensBarRef.current.className = styles.rainbowAnimation;

		setTimeout(() => {
			tokensBarRef.current.style.transform = "scale(1)";
			tokensBarRef.current.style.animation = "none";
		}, 2000);
	};

	const onMessageSend = async (content) => {
		const accessToken = await getAccessToken();
		if (!accessToken) {
			toast.error("Please log in to send messages");
			return;
		}

		if (
			parseInt(tokens) <= 0 &&
			messages.filter((msg) => msg.role === "user").length >= 10
		) {
			triggerOutOfTokens();
			return;
		}

		streamManager.stop(); // interrupt any ongoing audio playback

		const updatedMessages = [...messagesRef.current, { role: "user", content }];
		setMessages(updatedMessages);

		setIsThinking(true);

		window.gtag("event", "spend_virtual_currency", {
			value: content.length,
			virtual_currency_name: "tokens",
			item_name: "text",
		});

		try {
			const voice = genderRef.current === "Female" ? "female3" : "male1";
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
					role: roleRef.current,
					languageModelQuality: chatQualityRef.current,
					narration: narrationRef.current,
					voiceQuality: voiceQualityRef.current,
					voice,
					scene: sceneRef.current,
				}),
			};

			const response = await streamManager.fetchData(url, options);

			await streamManager.parseStream(
				response,
				addMessage,
				showComponent,
				setScene,
				voiceQuality
			);

			updateTokens();
		} catch (error) {
			setIsThinking(false);
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

		if (
			parseInt(tokens) <= 0 &&
			messages.filter((msg) => msg.role === "user").length >= 10
		) {
			triggerOutOfTokens();
			return;
		}

		setIsThinking(true);

		try {
			window.gtag("event", "spend_virtual_currency", {
				value: duration,
				virtual_currency_name: "tokens",
				item_name: "audio",
			});

			//const blob = new Blob(chunks, { type: 'audio/webm' });
			const voice = genderRef.current === "Female" ? "female1" : "male1";

			const fd = new FormData();
			fd.append("messages", JSON.stringify(messagesRef.current.slice(-5)));
			fd.append("username", name);
			fd.append("role", roleRef.current);
			fd.append("languageModelQuality", chatQualityRef.current);
			fd.append("voiceQuality", voiceQualityRef.current);
			fd.append("narration", narrationRef.current);
			fd.append("voice", voice);
			fd.append("duration", duration);
			fd.append("file", blob, "speech.webm");
			fd.append("scene", sceneRef.current);

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
				setScene,
				voiceQuality,
				true
			);

			updateTokens();
		} catch (error) {
			// check for abort error
			setIsThinking(false);
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

	//console.log(isRecording);
	return (
		<HueProvider>
			<audio
				ref={audioRef}
				src="./feedback_notif.mp3"
				style={{ display: "none" }}
			/>
			{!isSplashVisible ? (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						boxShadow: isRecording
							? "inset 0 0 40px rgba(255,40,69,0.8)"
							: "none",
						userSelect: "none",
					}}
				>
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
						borderAnimation={borderAnimation}
						isThinking={isThinking}
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
						useVAD={useVAD}
						setUseVAD={setUseVAD}
						role={role}
						setRole={setRole}
						voiceQuality={voiceQuality}
						setVoiceQuality={setVoiceQuality}
						chatQuality={chatQuality}
						setChatQuality={setChatQuality}
						visualQuality={visualQuality}
						setVisualQuality={setVisualQuality}
						narration={narration}
						setNarration={setNarration}
						tokens={tokens}
						isMobile={isMobile}
						setShowChatLog={setShowChatLog}
						showChatLog={showChatLog}
						tokensBarRef={tokensBarRef}
						showPrivacyPolicy={() => setPrivacyPolicyVisible(true)}
						showReleaseNotes={() => setReleaseNotesVisible(true)}
						showFeedbackPopup={() => setShowFeedbackPopup(true)}
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
						showLoginUI={() => setLoginVisible(true)}
					/>

					<OnboardingComponent
						isVisible={isOnboardingVisible}
						onClose={() => setOnboardingVisible(false)}
						name={name}
						setName={setName}
						playOnboarding={playOnboarding}
					/>

					<FeedbackPopup
						isVisible={showFeedbackPopup}
						onClose={() => setShowFeedbackPopup(false)}
					/>
				</div>
			) : (
				<SplashHeader
					chatWithEla={continueSplash}
					showPrivacyPolicy={() => setPrivacyPolicyVisible(true)}
					showReleaseNotes={() => setReleaseNotesVisible(true)}
					isMobile={isMobile}
				/>
			)}

			<ReleaseNotesComponent
				isVisible={isReleaseNotesVisible}
				onClose={acceptNewVersion}
				version={version}
			/>

			<PrivacyPolicyComponent
				isVisible={isPrivacyPolicyVisible}
				onClose={acceptPrivacyPolicy}
			/>
		</HueProvider>
	);
}

export default ChatPageComponent;
