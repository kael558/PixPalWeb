import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { Overlay, Window } from "./OverlayComponent";
import { useHue } from "@hooks/useHue";

function OnboardingComponent({
	isVisible,
	onClose,
	streamManager,
	name,
	setName,
	setInputMode,
}) {
	const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();

	const play_onboarding = async (input_mode) => {
		if (name === "") {
			toast.error("Please enter a name");
			return;
		}

		streamManager.playAudioFile(`hello_${input_mode}.wav`).catch(console.error);
		onClose();
	};

	return (
		<Overlay
			isVisible={isVisible}
			style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }} // Semi-transparent dark overlay
			children={
				<Window
					children={
						<div>
							<h1
								style={{
									color: "white",
									textShadow: `0 0 10px rgba(${rgbStr},0.8)`,
									textAlign: "center",
								}}
							>
								Welcome to PixPal!
							</h1>
							<p style={{ color: "white" }}>What do you want to be called?</p>
							<input
								type="text"
								value={name}
								onChange={(event) => setName(event.target.value)}
								placeholder="Enter your name"
								style={{
									padding: "10px",
									borderRadius: "5px",
									border: `1px solid rgba(${rgbStr}, 0.5)`,
									marginBottom: "10px",
									backgroundColor: "#222",
									color: "white",
									width: "100%", // Ensure full width for alignment
									boxSizing: "border-box", // Ensure padding is included in width
									fontSize: "16px",
								}}
							/>

							<p style={{ color: "white" }}>
								Do you prefer to chat with voice input or text input?
							</p>
							<div style={{ display: "flex", justifyContent: "space-around" }}>
								<button
									onClick={() => {
										setInputMode("audio");

										play_onboarding("audio");
									}}
									style={{
										padding: "10px",
										borderRadius: "5px",
										border: "none",
										cursor: "pointer",
										backgroundColor: `rgba(${rgbStr}, 0.8)`,
										color: "white",
										width: "48%", // Match the width of the input field
										fontSize: "14px",
										letterSpacing: "0.1em",
							
									}}
									onMouseEnter={(e) => {
										e.target.style.backgroundColor = "white";
										e.target.style.color = hue;
									}}
									onMouseLeave={(e) => {
										e.target.style.backgroundColor = hue;
										e.target.style.color = "white";
							
									}}
								>
									Voice
								</button>
								<button
									onClick={() => {
										setInputMode("text");
										play_onboarding("text");
									}}
									style={{
										padding: "10px",
										borderRadius: "5px",
										border: "none",
										cursor: "pointer",
										backgroundColor: `rgba(${rgbStr}, 0.8)`,
										color: "white",
										width: "48%", // Match the width of the input field
										fontSize: "14px",
										letterSpacing: "0.1em",
									}}
									onMouseEnter={(e) => {
										e.target.style.backgroundColor = "white";
										e.target.style.color = hue;
									}}
									onMouseLeave={(e) => {
										e.target.style.backgroundColor = hue;
										e.target.style.color = "white";
									}}
								>
									Text
								</button>
							</div>
						</div>
					}
				/>
			}
		/>
	);
}

export default OnboardingComponent;
