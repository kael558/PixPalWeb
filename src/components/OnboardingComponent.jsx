import { motion, AnimatePresence } from "framer-motion";
import { playAudioFromFilePath } from "./AudioPlayer/AudioPlayer";
import { toast } from "react-toastify";

function OnboardingComponent({ isVisible, onClose, audioWorkletNode, name, setName }) {
	const play_onboarding = async () => {	
        if (name === "") {
            toast.error("Please enter a name");
            return;
        }

        playAudioFromFilePath("onboarding.wav", audioWorkletNode).catch(console.error);
        onClose();
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					style={{
						display: "flex",
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1000,
					}}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "10px",
							boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                            position: "relative",
						}}
					>
						<h1>Welcome to the Chat!</h1>
                        <p>
                            What do you want to be called?
                        </p>
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your name"
                            style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                marginBottom: "10px",
                            }}
                        />

                        <p>*Note clicking continue will play audio.</p>
						<button onClick={play_onboarding}
                            style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                                backgroundColor: "#068FFF",
                                color: "white",
                            }}
                        
                        
                        >Continue</button>
	
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default OnboardingComponent;
