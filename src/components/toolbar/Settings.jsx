import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@hooks/useAuth";
import { FaVolumeUp } from "react-icons/fa";
import { toast } from "react-toastify";

function Settings({
	isVisible,
	showLoginUI,
	inputMode,
	setInputMode,
	streamManager,
	doLogout,
	setShowDialog,
}) {
	const [volume, setVolume] = useState(streamManager.getVolume());
	const [uiHue, setUiHue] = useState("#FFC107"); // Default color
	const [showChatLog, setShowChatLog] = useState(false);

	const { isAuthenticated, isAnonymous } = useAuth();

	const handleLogout = () => {
		if (isAuthenticated() && isAnonymous()) {
			setShowDialog(true);
			return;
		}

		doLogout();
	};

	useEffect(() => {
		streamManager.setVolume(volume);
	}, [volume, streamManager]);

	const optionStyle = (current, value) => ({
		cursor: "pointer",
		color: current === value ? "#FFC107" : "white",
		border: current === value ? "1px solid #FFC107" : "none",
		padding: "0 5px",
		margin: "0 5px",
	});

	const categoryStyle = {
		color: "#FFC107",
		fontWeight: "bold",
	};

	const liStyle = {
		padding: "8px 0",
		listStyleType: "none",
		textIndent: "-2em",
		letterSpacing: "0.1em",
	};

	useEffect(() => {
		streamManager.setVolume(volume);
	}, [volume, streamManager]);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					style={{
						position: "absolute",
						right: "60px",
						top: "60px", // Adjust this value based on the actual layout
						background: "#000",
						border: "1px solid #ccc",
						borderRadius: "8px",
						padding: "10px",
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						boxShadow: "0 0 20px rgba(255,163,69,0.7)",
						width: "auto",
						minWidth: "300px",
					}}
					initial={{ opacity: 0, y: -50 }} // Start from the right, slightly hidden
					animate={{ opacity: 1, y: 0 }} // Animate to fully visible and slide into position
					exit={{ opacity: 0, y: -50 }} // Exit by fading out and sliding to the right
					transition={{ type: "spring", stiffness: 100 }}
				>
					<div
						style={{
							fontSize: "20px",
							fontWeight: "bold",
							margin: "10px",
							marginBottom: "0px",
							color: "white",
							letterSpacing: "0.1em",
						}}
					>
						Settings
					</div>
					<ul>
						<li style={liStyle}>
							<span style={categoryStyle}>
								<FaVolumeUp
									style={{
										color: "#FFC107",
										margin: "0px",
										padding: "0px",
										marginRight: "5px",
										fontSize: "1.2em",
										verticalAlign: "middle",
									
									}}
								/>
							</span>

							<span>
								<input
									type="range"
									min="0"
									max="1"
									step="0.01"
									value={volume}
									onChange={(e) => setVolume(e.target.value)}
									style={{

										appearance: "none",
										width: "80%",
										marginLeft: "10px",
										marginTop: "0px",
										padding: "0px",
										height: "8px",
										borderRadius: "4px",
				
										backgroundImage: `linear-gradient(to right, #FFC107 ${volume * 100}%, #CCC ${volume * 100}%)`,
										outline: "none",
										transition: "opacity .2s",
										accentColor: "purple",
										"&::WebkitSliderThumb": {
											appearance: "none",
											width: "20px",
											height: "20px",
											borderRadius: "50%",
											backgroundColor: "#FFF",
											cursor: "pointer",
											boxShadow: "0 0 2px #555",
										},
										"&::MozRangeThumb": {
											width: "20px",
											height: "20px",
											borderRadius: "50%",
											backgroundColor: "#FFF",
											cursor: "pointer",
											border: "none",
										},
									}}
								/>
							</span>
						</li>

						{/*
						
				
						<li style={liStyle}>
							<span style={categoryStyle}>HUE:</span>
							<span>
								<input
									type="range"
									min="0"
									max="360"
									step="1"
									value={uiHue}
									onChange={(e) => toast.error("Hue coming soon!")}
									style={{
										marginLeft: "10px",
										appearance: "none",
										width: "80%",
										height: "8px",
										borderRadius: "4px",
										backgroundImage:
											"linear-gradient(to right, red, yellow, lime, aqua, blue, fuchsia, red)",
										outline: "none",
										transition: "opacity .2s",
										accentColor: "white",
										"&::WebkitSliderThumb": {
											appearance: "none",
											width: "20px",
											height: "20px",
											borderRadius: "50%",
											backgroundColor: "#FFF",
											cursor: "pointer",
											boxShadow: "0 0 2px #555",
								
							
										},
										"&::-moz-range-thumb": {
											width: "20px",
											height: "20px",
											borderRadius: "50%",
											backgroundColor: "#FFF",
											cursor: "pointer",
											border: "none",
				
										},
									}}
								/>
							</span>
						</li>
						*/}
						<li style={liStyle}>
							<span style={categoryStyle}>Chat Log:</span>
							<span
								style={optionStyle(showChatLog, true)}
								onClick={() => toast.error("Chat log coming soon!")}
							>
								ON
							</span>
							/
							<span
								style={optionStyle(showChatLog, false)}
								onClick={() => setShowChatLog(!showChatLog)}
							>
								OFF
							</span>
						</li>
						<li style={liStyle}>
							<span style={categoryStyle}>Input Mode:</span>
							<span
								style={optionStyle(inputMode, "text")}
								onClick={() => setInputMode("text")}
							>
								Text
							</span>
							/
							<span
								style={optionStyle(inputMode, "audio")}
								onClick={() => setInputMode("audio")}
							>
								Audio
							</span>
						</li>
					</ul>

					<span
						style={{
							display: "flex",
							flexDirection: "row",
							gap: "10px",
							justifyContent: "center",
							width: "100%",
						}}
					>
							{isAuthenticated() && (
						<button
							onClick={handleLogout}
							style={{
								marginTop: "10px",
								padding: "8px 20px",
								borderRadius: "5px",
								backgroundColor: "#DDC107",
								color: "black",
								border: "1px solid white",
								cursor: "pointer",
								fontWeight: "bold",
								letterSpacing: "0.1em",
								transition: "background-color 0.3s, color 0.3s",
                                fontSize: "13px",
							}}
							onMouseEnter={(e) => {
								e.target.style.backgroundColor = "white";
								e.target.style.color = "#FFC107";
							}}
							onMouseLeave={(e) => {
								e.target.style.backgroundColor = "#FFC107";
								e.target.style.color = "black";
							}}
						>
							Logout
						</button>
					)}

					{(!isAuthenticated() || isAnonymous()) && (
						<button
							onClick={showLoginUI}
							style={{
								marginTop: "10px",
								padding: "8px 20px",
								borderRadius: "5px",
								backgroundColor: "#DDC107",
								color: "black",
								border: "1px solid white",
								cursor: "pointer",
								fontWeight: "bold",
								letterSpacing: "0.1em",
								transition: "background-color 0.3s, color 0.3s",
                                fontSize: "13px",
							}}
							onMouseEnter={(e) => {
								e.target.style.backgroundColor = "white";
								e.target.style.color = "#FFC107";
							}}
							onMouseLeave={(e) => {
								e.target.style.backgroundColor = "#FFC107";
								e.target.style.color = "black";
							}}
						>
							Login
						</button>
					)}

</span>

				
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default Settings;
