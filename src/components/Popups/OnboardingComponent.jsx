import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { Overlay, Window } from "./OverlayComponent";

function OnboardingComponent({
	isVisible,
	onClose,
	streamManager,
	name,
	setName,
}) {
	const play_onboarding = async () => {
		if (name === "") {
			toast.error("Please enter a name");
			return;
		}

		streamManager.playAudioFile("onboarding.wav").catch(console.error);
		onClose();
	};

	return (
		<Overlay
			isVisible={isVisible}
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }} // Semi-transparent dark overlay
			children={
				<Window
					children={
						<div>
							<h1 style={{ color: "white", textShadow: "0 0 10px rgba(255,163,69,0.8)", textAlign: "center" }}>Welcome to PixPal!</h1>
							<p style={{ color: "white" }}>What do you want to be called?</p>
							<input
								type="text"
								value={name}
								onChange={(event) => setName(event.target.value)}
								placeholder="Enter your name"
								style={{
									padding: "10px",
									borderRadius: "5px",
									border: "1px solid rgba(255, 163, 69, 0.5)",
									marginBottom: "10px",
									backgroundColor: "#222",
									color: "white",
									width: "100%", // Ensure full width for alignment
									boxSizing: "border-box", // Ensure padding is included in width
								}}
							/>
							<p style={{ color: "rgba(255, 163, 69, 0.8)" }}>*Note clicking continue will play audio.</p>
							<button
								onClick={play_onboarding}
								style={{
									padding: "10px",
									borderRadius: "5px",
									border: "none",
									cursor: "pointer",
									backgroundColor: "rgba(255, 163, 69, 0.8)",
									color: "black",
									width: "100%", // Match the width of the input field
								}}
							>
								Continue
							</button>
						</div>
					}
				/>
			}
		/>
	);
	
}

export default OnboardingComponent;
