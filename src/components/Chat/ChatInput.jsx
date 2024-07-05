import { useState, useEffect, useRef, forwardRef } from "react";
import VoiceInput from "../AudioRecorder";
import AudioVisualizer from "../AudioVisualizer";

import { toast } from "react-toastify";

import { useHue } from "@hooks/useHue";

import { FaMicrophoneAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import styles from "../ChatPageComponent.module.css";

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
	borderAnimation,
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

	return (
		<div
			style={{
				position: "fixed",
				bottom: isMobile ? "0" : "10px",
				left: "50%",
				transform: "translateX(-50%)",
				width: "90%",
				maxWidth: "600px",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: 'flex-end',
				padding: "10px 20px",
				height: isMobile ? "140px" : "140px", // Adjusted for extra space
			}}
		>
			{voiceInput.mediaStream && (
				<div style={{ 
					width: "95%", 
					position: "absolute", 
					bottom: isMobile ? "34px" : "44px", // Positioned right above the input area
					left: 0,
					right: 0,
					margin: "auto",
					zIndex: 0, // Ensures visualizer is above the input area
				}}>
					<AudioVisualizer
						mediaStream={voiceInput.mediaStream}
						streamManager={streamManager}
						isRecording={isRecording}
						inputMode={inputMode}
					/>
				</div>
			)}
			<AnimatePresence>
				{inputMode === "text" ? (
					<motion.div
						key="text-input"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						style={{
							width: "100%", 
							zIndex: 1, 
							position: "absolute",
							bottom: isMobile ? "0px" : "10px"
						}}
					>
						<form
					
							onSubmit={handleSubmit}
							className={borderAnimation ? styles.rainbowAnimation : ""}
							
							style={{
								width: "100%", 
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: "20px",
								transition: "all 0.3s ease-in-out",
								transform: borderAnimation ? "scale(1.1)" : "scale(1)",
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
								style={{
									flex: 1,
									padding: "10px",
									border: "1px solid rgba(255, 255, 255, 0.3)",
									borderRadius: "20px 5px 5px 20px",
									background: "rgba(0, 0, 0, 0.4)",
									color: "#FFF",
									resize: "none",
									zIndex: 1,
									transition: "transform 0.5s ease",
			
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSubmit(e);
									}
								}}
							/>
							<button
								type="submit"
								style={{
									background: `rgba(${rgbStr}, 1)`,
									color: "white",
									borderRadius: "5px 20px 20px 5px",
									padding: `10px ${isMobile ? "20px" : "15px"}`,
									fontSize: "14px",
									cursor: "pointer",
									transition: "transform 0.3s, box-shadow 0.3s",
									border: `1px solid rgba(${rgbStr}, 0.3)`,
									boxShadow: `0 0 5px rgba(${rgbStr}, 0.7)`,
		
								}}
								onMouseOver={({ target }) => {
									target.style.transform = "scale(1.1)";
									target.style.boxShadow = `0 0 15px rgba(${rgbStr}, 0.9)`;
								}}
								onMouseOut={({ target }) => {
									target.style.transform = "scale(1)";
									target.style.boxShadow = `0 0 5px rgba(${rgbStr}, 0.7)`;
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
						style={{
							width: "100%", 
							zIndex: 1,
							position: "absolute",
							bottom: isMobile ? "0px" : "10px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<FaMicrophoneAlt
							onClick={() => {
								setIsRecording((prev) => !prev);
							}}
				
							className={borderAnimation ? styles.rainbowAnimation : ""}
							style={{
								fontSize: "40px",
								color: isRecording ? "red" : hue,
								cursor: "pointer",
								transition: "all 0.3s ease",
								borderRadius: "50%",
								padding: "10px",
								border: isRecording ? "2px solid red" : `2px solid ${hue}`,
								boxShadow: isRecording ? "0 0 15px rgba(255, 0, 0, 0.5)" : "none",
								transform: isRecording || borderAnimation ? "scale(1.1)" : "scale(1)",
							}}
							onMouseEnter={(e) => {
								if (isRecording) return;
								e.currentTarget.style.transform = "scale(1.1)";
								e.currentTarget.style.boxShadow = `0 0 15px rgba(${rgbStr}, 0.9)`;
							}}
							onMouseLeave={(e) => {
								if (isRecording) return;
								e.currentTarget.style.transform = "scale(1)";
								e.currentTarget.style.boxShadow = "none";
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
	
	
}

export default ChatInput;
