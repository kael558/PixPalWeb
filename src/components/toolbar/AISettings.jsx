import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";

function AISettings({ isVisible, setMessages, 
	gender,
	setGender,
	role,
	setRole,
	voiceQuality,
	setVoiceQuality,
	chatQuality,
	setChatQuality


 }) {
	const resetMessages = () => {
		// delete messages from localstorage
		localStorage.removeItem("messages");
		setMessages([]);
		toast.success("Memory reset successfully!");
	};

	const optionStyle = (current, value) => ({
		cursor: "pointer",
		color: current === value ? "#FFC107" : "white",
		border: current === value ? "1px solid #FFC107" : "none",
		padding: "0 5px",
		margin: "0 5px",
		position: "relative",
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

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					style={{
						position: "absolute",
						right: "60px",
						top: "60px",
						background: "#000",
						border: "1px solid #ccc",
						borderRadius: "8px",
						padding: "10px",
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",

						width: "auto",
						minWidth: "400px",
						boxShadow: "0 0 20px rgba(255,163,69,0.7)",
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
							color: "white",
							letterSpacing: "0.1em",
						}}
					>
						AI Settings
					</div>
					{/* Styled as a header */}
					<ul>
						<li style={liStyle}>
							<span style={categoryStyle}>Gender:</span>
							<span
								style={optionStyle(gender, "Male")}
								onClick={() => setGender("Male")}
							>
								Male
							</span>
							/
							<span
								style={optionStyle(gender, "Female")}
								onClick={() => setGender("Female")}
							>
								Female
							</span>
						</li>
						<li style={liStyle}>
							<span style={categoryStyle}>Role:</span>
							<span
								style={optionStyle(role, "Friend")}
								onClick={() => setRole("Friend")}
							>
								Friend
							</span>
							/
							<span
								style={optionStyle(role, "Teacher")}
								onClick={() => setRole("Teacher")}
							>
								Teacher
							</span>
							/
							<span
								style={optionStyle(role, "Intimate")}
								onClick={() => setRole("Intimate")}
							>
								Intimate
							</span>
						</li>
						<li style={liStyle}>
							<span style={categoryStyle}>Voice Quality:</span>
							<span
								style={optionStyle(voiceQuality, "Low")}
								onClick={() => setVoiceQuality("Low")}
							>
								Low
							</span>
							/
							<span
								style={optionStyle(voiceQuality, "High")}
								onClick={() => toast.warning("High voice quality coming soon!")}
							>
								High
							</span>
						</li>
						<li style={liStyle}>
							<span style={categoryStyle}>Chat Quality:</span>
							<span
								style={optionStyle(chatQuality, "Low")}
								onClick={() => setChatQuality("Low")}
							>
								Low
							</span>
							/
							<span
								style={optionStyle(chatQuality, "Medium")}
								onClick={() => setChatQuality("Medium")}
							>
								Medium
							</span>
							/
							<span
								style={optionStyle(chatQuality, "High")}
								onClick={() => setChatQuality("High")}
								
							>
								High    <sup
								style={{
									position: 'absolute', 
									top: '0', 
									right: '0', 
									transform: 'translate(50%, -50%)',
									background: 'red', 
									color: 'white', 
									borderRadius: '5px' ,
									fontSize: 'small', 

								}}
								
								
								>NSFW</sup>
							</span>
						</li>
					</ul>
					{/* put items in center of row */}
					<span
						style={{
							display: "flex",
							flexDirection: "row",
							gap: "10px",
							justifyContent: "center",
							width: "100%",
						}}
					>
						<button
							onClick={resetMessages}
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
							Reset Memory
						</button>
						<button
							onClick={() =>
								toast.warning("Memory browsing feature coming soon!")
							}
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
							Browse Memory
						</button>
					</span>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default AISettings;
