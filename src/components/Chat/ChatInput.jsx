import { useState, useEffect, useRef } from "react";
import VoiceInput from "../AudioRecorder";
import AudioVisualizer from "../AudioVisualizer";

import { toast } from "react-toastify";

import { useAuth } from "@hooks/useAuth";
import { useHue } from "@hooks/useHue";

import { FaMicrophoneAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const voiceInput = new VoiceInput();
voiceInput.setup();

function ChatInput({
	onSend,
	onAudio,
	streamManager,
	inputMode,
	setInputMode,
	isRecording,
	setIsRecording,
	isMobile,
}) {
	const [message, setMessage] = useState("");
	const timeoutRef = useRef(null);

	const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();

	//const voiceInputRef = useRef(null);

	useEffect(() => {
		voiceInput.next = onAudio;
	}, []);

	useEffect(() => {
		if (isRecording) {
			console.log("Starting recording...");
			if (timeoutRef.current) clearTimeout(timeoutRef.current);

			streamManager.audioContext.resume();
			streamManager.stop(); // interrupt any ongoing audio playback
			voiceInput.startRecording();
		} else {
			timeoutRef.current = setTimeout(() => {
				streamManager.audioContext.suspend();
			}, 1000);

			voiceInput.stopRecording();
		}
	}, [isRecording]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const userMessage = message.trim();
		if (!userMessage) {
			toast.error("Please enter a message to send");
			return;
		}

		streamManager.stop(); // interrupt any ongoing audio playback
		onSend(userMessage);
		setMessage("");
	};

	//console.log("inputMode", inputMode);

	/*if (inputMode === "audio" && voiceInput.mediaStream) {
		return (
			<div
				style={{
					position: "fixed",
					bottom: isMobile ? "0px" : "10px",
					width: "100%",
					alignItems: "center",
					justifyContent: "space-between",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					height: "160px",
				}}
			>
				<AudioVisualizer
					mediaStream={voiceInput.mediaStream}
					streamManager={streamManager}
					isRecording={isRecording}
				/>

			
			</div>
		);
	}*/

	return (
		<div
			style={{
				position: "fixed",
				bottom: isMobile ? "0px" : "10px",
				left: "50%",
				transform: "translateX(-50%)",

				width: "95%",
				maxWidth: "600px",
				display: "flex",

				padding: "10px 20px",

				alignItems: "center",
				justifyContent: 'center',
				height: "160px",
			}}
		>
			{voiceInput.mediaStream && (
				<AudioVisualizer
					mediaStream={voiceInput.mediaStream}
					streamManager={streamManager}
					isRecording={isRecording}
				/>
			)}

			<AnimatePresence>
				
					{inputMode === "text" ? (
						<motion.div
						key="text-input"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<form
							onSubmit={handleSubmit}
							style={{
								position: "fixed", // Fixed position at the bottom
								bottom: "0px", // At the bottom of the viewport
								left: "50%", // Centered horizontally
								transform: "translateX(-50%)", // Keeps it centered
								width: "95%", // Taking the full width with some margin
								maxWidth: "600px", // Maximum width
								display: "flex",
								padding: "10px 20px",
								alignItems: "center",
								justifyContent: "space-between",
								borderRadius: "20px", // Rounded corners
								transition: "all 0.3s ease-in-out",
							}}
						>
							<textarea
								id="message"
								placeholder="Type a message..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								autoComplete="off"
								required
								rows="1"
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSubmit(e);
									}
								}}
								style={{
									flex: 1,
									marginRight: "10px",
									padding: "10px",
									border: "1px solid rgba(255, 255, 255, 0.3)",
									borderRadius: "20px",
									fontSize: isMobile ? "14px" : "16px",
									background: "rgba(0, 0, 0, 0.4)",
									color: "#FFF",
									resize: "none",
									boxSizing: "border-box",
									scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.3)",
									fontFamily: "Menlo, monospace",
								}}
							/>
							<button
								type="submit"
								style={{
									background: `rgba(${rgbStr}, 1)`,
									color: "white",
									border: "none",
									borderRadius: "20px",
									padding: "10px 20px",
									fontSize: "16px",
									cursor: "pointer",
									transition: "transform 0.3s, box-shadow 0.3s",
									boxShadow: `0 0 5px rgba(${rgbStr}, 0.7)`,
								}}
								onMouseOver={({ target }) => {
									target.style.transform = "scale(1.1)";
									target.style.boxShadow = `0 0 30px rgba(${rgbStr}, 0.9)`;
								}}
								onMouseOut={({ target }) => {
									target.style.transform = "scale(1)";
									target.style.boxShadow = `0 0 20px rgba(${rgbStr}, 0.7)`;
								}}
							>
								{isMobile ? ">" : "Send"}
							</button>
						</form>
						</motion.div>
					) : (
						<motion.div
						key="audio-input"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					
					>
						<FaMicrophoneAlt
							onClick={() => {
								setIsRecording((prev) => !prev);
							}}
							style={{
								position: "fixed",
								bottom: "10px",
								left: "50%",

								fontSize: "40px",
								color: isRecording ? "red" : hue,
								cursor: "pointer",
								transition: "all 0.3s ease", // Broadened to include all properties
								background: isRecording
									? "rgba(255, 0, 0, 0.4)"
									: "transparent", // Increased opacity
								borderRadius: "50%",
								padding: "10px",
								border: isRecording ? "2px solid red" : `2px solid ${hue}`, // Conditional border color
								boxShadow: isRecording
									? "0 0 15px rgba(255, 0, 0, 0.5)"
									: "none", // Conditional shadow
								transform: isRecording
									? "translateX(-50%) scale(1.1)"
									: "translateX(-50%) scale(1)", // Scaling effect
							}}
						/>
						</motion.div>
					)}
			
			</AnimatePresence>
		</div>
	);
}

export default ChatInput;
