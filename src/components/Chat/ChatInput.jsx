import { useState, useEffect, useRef } from "react";
import VoiceInput from "../AudioRecorder";
import AudioVisualizer from "../AudioVisualizer";

import { toast } from "react-toastify";

import { useAuth } from "@hooks/useAuth";
import { useHue } from "@hooks/useHue";

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
	isMobile
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

	if (inputMode === "audio") {
		return (
			<div
				style={{
					position: "fixed",
					bottom: isMobile ? "0px": "10px",
					width: "100%",
					alignItems: "center",
					justifyContent: "space-between",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				
				}}
			>
				<AudioVisualizer
					mediaStream={voiceInput.mediaStream}
					streamManager={streamManager}
					isRecording={isRecording}
				/>

				<p
					style={{
						color: "white",
						fontSize: "16px",
						textAlign: "center",
						marginTop: "10px",
					}}
				>
					{isRecording ? "TAP ANYWHERE TO FINISH" : "TAP ANYWHERE TO RECORD"}
				</p>
			</div>
		);
	}
	return (
		<div
			style={{
				position: "fixed",
				bottom: isMobile ? "0px": "10px",
				left: "50%",
				transform: "translateX(-50%)",
				width: "95%",
				maxWidth: "600px",
				display: "flex",

				padding: "10px 20px",

				alignItems: "center",
				justifyContent: "space-between",
		
	
			}}
		>
			<form
				onSubmit={handleSubmit}
				style={{
					alignItems: "center",
					justifyContent: "space-between",
					display: "flex",
					width: "100%",
				}}
			>
				<textarea
					id="message"
					placeholder="Type a message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					autoComplete="off"
					required
					rows="1" // Initial number of visible rows
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault(); // Prevent the default action to stop from creating a new line
							handleSubmit(e); // Call the handleSubmit function to submit the form
						}
					}}
					style={{
						flex: 1,
						marginRight: "10px",
						padding: "10px",
						border: "1px solid rgba(255, 255, 255, 0.3)", // Light white border
						borderRadius: "20px", // Rounded corners
						fontSize: isMobile ? "14px" : "16px", // Smaller font size on mobile
						background: "rgba(0, 0, 0, 0.4)", // Black with more transparency
						color: "#FFF", // White text for contrast
					
						resize: "none", // Disable resizing
						boxSizing: "border-box", // Include padding and border in width and height
						scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.3)", // Custom scrollbar colors
						fontFamily: "Menlo, monospace", // Monospace font for consistent spacing
					}}
				/>
				<button
					type="submit"
					style={{
						background: `rgba(${rgbStr}, 1)`, // Solid orange to match boxShadow
						color: "white",
						border: "none",
						borderRadius: "20px",
						padding: "10px 20px",
				
						fontSize: "16px",
						cursor: "pointer",
						transition: "transform 0.3s, box-shadow 0.3s", // Smooth transitions for hover effects
						boxShadow: `0 0 5px rgba(${rgbStr}, 0.7)`, // Consistent orange glow
					}}
					onMouseOver={({ target }) => {
						target.style.transform = "scale(1.1)";
						target.style.boxShadow = `0 0 30px rgba(${rgbStr}, 0.9)`; // Enhanced glow on hover
					}}
					onMouseOut={({ target }) => {
						target.style.transform = "scale(1)";
						target.style.boxShadow = `0 0 20px rgba(${rgbStr}, 0.7)`;
					}}
				>
					{isMobile ? ">" : "Send"}
				</button>
			</form>
		</div>
	);
	
}

export default ChatInput;
