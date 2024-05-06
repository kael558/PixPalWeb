import { useState } from "react";
import VoiceInput from "./AudioRecorder";
import { getAudioStreamFromAudioInput } from "./AudioPlayer/AudioPlayer";

import { useAuth } from "../hooks/useAuth";
const voiceInput = new VoiceInput();

function ChatInput({ onSend, messages, audioWorkletNode, addAssistantMessage }) {
	const [message, setMessage] = useState("");
	const [isRecording, setIsRecording] = useState(false);

    const { getAccessToken, isAuthenticated } = useAuth();

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Message:", message);
		if (!message) {
			alert("Please enter a message");
			return;
		}
		onSend(message);
		setMessage("");
	};

	const startRecording = (event) => {
		event.preventDefault(); // Prevent form submission
		event.stopPropagation(); // Stop event bubbling up to form

        if (isRecording) {
            return;
        }

        if (!isAuthenticated()){
            return;
        }

		setIsRecording(true);
		console.log("Recording started...");
		// Add your recording start logic here

        voiceInput.startRecording();
       
	};

	const stopRecording = async (event) => {
		event.preventDefault(); // Prevent form submission
		event.stopPropagation(); // Stop event bubbling up to form
        if (!isRecording) {
            return;
        }

		setIsRecording(false);
		console.log("Recording stopped.");
		// Add your recording stop logic here

     
        const chunks = voiceInput.stopRecording();
        if (!chunks.length) {
            console.error("No audio data recorded");
            return;
        }

        const accessToken = await getAccessToken();
        const blob = new Blob(chunks, { type: "audio/webm" });
        getAudioStreamFromAudioInput(blob, messages, "Kael", accessToken, audioWorkletNode, addAssistantMessage);
	};

	return (
		<div 		style={{
            position: "fixed",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            display: "flex",
            backgroundColor: "#068FFF",
            backdropFilter: "blur(10px)",
            padding: "10px 20px",
            borderRadius: "25px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid rgba(255, 255, 255, 0.2)",
        }}>
			<form
				onSubmit={handleSubmit}
                style={{
                    alignItems: "center",
                    justifyContent: "space-between",
		            display: "flex",
                    width: "100%"
                }}
			>
				<input
					type="text"
					id="message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					autoComplete="off"
					required
					style={{
						flex: 1,
						marginRight: "10px",
						padding: "10px",
						border: "none",
						borderRadius: "15px",
						fontSize: "16px",
						background: "#EEEEEEB3",
						color: "#333",
						boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
					}}
				/>
				<button
					type="submit"
					style={{
						background: "linear-gradient(45deg, #6a11cb, #2575fc)",
						color: "white",
						border: "none",
						borderRadius: "15px",
						padding: "10px 20px",
						fontSize: "16px",
						cursor: "pointer",
						transition: "transform 0.2s",
						boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
					}}
					onMouseOver={({ target }) => (target.style.transform = "scale(1.05)")}
					onMouseOut={({ target }) => (target.style.transform = "scale(1)")}
				>
					Send
				</button>
			</form>
			<button
				onMouseDown={startRecording}
				onMouseUp={stopRecording}
				onMouseLeave={isRecording ? stopRecording : null}
				style={{
					marginLeft: "10px",
					background: isRecording ? "red" : "green",
					color: "white",
					border: "none",
					borderRadius: "50%",
					padding: "10px",
					fontSize: "16px",
					cursor: "pointer",
				}}
			>
				🎙️
			</button>
		</div>
	);
}

export default ChatInput;
