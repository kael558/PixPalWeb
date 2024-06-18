import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useHue } from "@hooks/useHue";

function AISettings({ isVisible, setMessages, 
	gender,
	setGender,
	role,
	setRole,
	voiceQuality,
	setVoiceQuality,
	chatQuality,
	setChatQuality,
	isMobile


 }) {
	
	const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();

	const resetMessages = () => {
		// delete messages from localstorage
		localStorage.removeItem("messages");
		setMessages([]);
		toast.success("Memory reset successfully!");
	};


	const optionStyle = (current, value) => ({
		cursor: "pointer",
		color: current === value ? hue : "white",
		border: current === value ? `1px solid ${hue}` : "none",
		padding: "0 5px",
		margin: "0 5px",
		position: "relative",
		fontSize: isMobile ? "14px" : "inherit",
        letterSpacing: isMobile ? "0.05em" : "0.1em"
	});

	const categoryStyle = {
		color: hue,
		fontWeight: "bold",
		fontSize: isMobile ? "12px" : "inherit",
        letterSpacing: isMobile ? "0.05em" : "0.1em"
	};

	const liStyle = {
		padding: "8px 0",
		listStyleType: "none",
		textIndent: "-2em",
		letterSpacing: isMobile ? "0.05em" : "0.1em"
	};

	const divStyle = {
        position: "absolute",
        right: "60px",
        top: "60px",
        background: "#000",
        border: `1px solid ${hue}`,
        borderRadius: "8px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "auto",
        minWidth: isMobile ? "300px" : "400px",
        boxShadow: `0 0 20px rgba(${rgbStr},0.7)`,
    };

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					style={divStyle}
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
								onClick={() => toast.warning("Male voice coming soon!")}
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
								Medium   <sup
								style={{
									position: 'relative',
									top: '0.2em', // Shift up to align with text
					
									left: '1em', // Shift left to reduce gap
									padding: '2px',
									color: 'red',
							
									fontSize: '8px',
									margin: '0',
									transform: 'rotate(12deg)', // Rotate text to match 'NSFW' style,
									display: 'inline-block',
								}}
								
								
								>NSFW</sup>
							</span>
							/
							<span
								style={optionStyle(chatQuality, "High")}
								onClick={() => setChatQuality("High")}
								
							>
								High    <sup
								style={{
									position: 'relative',
									top: '0.3em', // Shift up to align with text
									left: '1.5em', // Shift left to reduce gap
									padding: '2px',
									color: 'red',
							
									fontSize: '8px',
									margin: '0',
									transform: 'rotate(19deg)', // Rotate text to match 'NSFW' style,
									display: 'inline-block',
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
								backgroundColor: hue,
								color: "black",
								border: "1px solid black",
								cursor: "pointer",
								fontWeight: "bold",
								letterSpacing: "0.1em",
								transition: "background-color 0.3s, color 0.3s",
                                fontSize: "13px",
							}}
							onMouseEnter={(e) => {
								e.target.style.backgroundColor = "white";
								e.target.style.color = hue;
							}}
							onMouseLeave={(e) => {
								e.target.style.backgroundColor = hue;
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
								backgroundColor: hue,
								color: "black",
								border: "1px solid black",
								cursor: "pointer",
								fontWeight: "bold",
								letterSpacing: "0.1em",
								transition: "background-color 0.3s, color 0.3s",
                                fontSize: "13px",
							}}
							onMouseEnter={(e) => {
								e.target.style.backgroundColor = "white";
								e.target.style.color = hue;
							}}
							onMouseLeave={(e) => {
								e.target.style.backgroundColor = hue;
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
