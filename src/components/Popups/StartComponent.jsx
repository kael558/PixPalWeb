import { Overlay, Window } from "./OverlayComponent";
import { useState } from "react";
import { useHue } from "@hooks/useHue";

function StartComponent({
	isVisible,
	onMessageSend,
	setRole,
	setStartFinished,
}) {
	const [userMood, setUserMood] = useState(null);

	const { hue, getRGB } = useHue();
	const rgb = getRGB(hue);
	const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

	const setMood = (mood) => {
        if (mood === "Skip") {
            setUserMood("");
            return;
        }

		//console.log("User mood:", mood);
		setUserMood(mood);
		onMessageSend("I'm feeling " + mood);
	};

	const setRoleHandler = (role) => {
        if (role === "Skip") {
            setStartFinished(true);
            return;
        }

		onMessageSend("I want you to be my " + role);
		setRole(role);
		setStartFinished(true);
	};

	return (
		<Overlay
			isVisible={isVisible}
			style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
		>
			<Window
				style={{
					backgroundColor: "#222", // Dark background for the window
					color: "white", // Base text color
					padding: "20px",
					borderRadius: "20px",
					border: `2px solid rgba(${rgbStr}, 0.8)`, // Glowing border
					boxShadow: `0 0 20px rgba(${rgbStr},0.7), 0 0 40px rgba(${rgbStr},0.5) inset`,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "300px", // Ensure there's enough vertical space
					fontFamily: "Menlo, monospace", // Monospace font for the window
				}}
			>
				{userMood == null ? (
					<div style={{ textAlign: "center" }}>
						<p style={{ fontSize: "18px", marginBottom: "20px" }}>
							How are you feeling right now?
						</p>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)", // Four buttons per row
								gap: "10px",
								marginBottom: "10px",
							}}
						>
							{[
								"Happy 😊",
								"Sad 😢",
								"Angry 😡",
								"Anxious 😨",
								"Excited 🎉",
								"Tired 😴",
								"Stressed 😖",
								"Confused 😕",
								"Horny 😏",
							].map((mood) => (
								<button
									key={mood}
									onClick={() => setMood(mood.split(" ")[0])}
									style={{
										padding: "10px",
										borderRadius: "10px",
										backgroundColor: `rgba(${rgbStr}, 0.8)`,
										color: "black",
										border: "none",
										cursor: "pointer",
										fontSize: "16px",
										textShadow: "0 0 2px rgba(0,0,0,0.5)",
									}}
								>
									{mood}
								</button>
							))}
						
						</div>
                        <button
								onClick={() => setMood("Skip")}
								style={{
									padding: "10px",
									borderRadius: "10px",
									backgroundColor: `rgba(${rgbStr}, 0.8)`,
									color: "black",
									border: "none",
									cursor: "pointer",
									fontSize: "16px",
									textShadow: "0 0 2px rgba(0,0,0,0.5)",
									marginTop: "20px", // Add space above the button
									width: "100px", // Set width for alignment
									alignSelf: "center", // Align self to center in the flex container,
                                    justifySelf: "center", // Align self to center in the flex container
								}}
							>
								Skip
							</button>
					</div>
				) : (
					<div style={{ textAlign: "center" }}>
						<p style={{ fontSize: "18px", marginBottom: "20px" }}>
							What are you looking for?
						</p>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)", // Three buttons per row
								gap: "10px",
							}}
						>
							{["Friend", "Advice", "Intimacy"].map((role) => (
								<button
									key={role}
									onClick={() =>
										setRoleHandler(
											role === "Friend"
												? "Friend"
												: role === "Advice"
												? "Teacher"
												: "Intimate"
										)
									}
									style={{
										padding: "10px",
										borderRadius: "10px",
										backgroundColor: `rgba(${rgbStr}, 0.8)`,
										color: "black",
										border: "none",
										cursor: "pointer",
										fontSize: "16px",
										textShadow: "0 0 2px rgba(0,0,0,0.5)",
									}}
								>
									{role}
								</button>
							))}
						</div>
                        <button
								onClick={() => setRoleHandler("Skip")}
								style={{
									padding: "10px",
									borderRadius: "10px",
									backgroundColor: `rgba(${rgbStr}, 0.8)`,
									color: "black",
									border: "none",
									cursor: "pointer",
									fontSize: "16px",
									textShadow: "0 0 2px rgba(0,0,0,0.5)",
									marginTop: "20px", // Add space above the button
									width: "100px", // Set width for alignment
									alignSelf: "center", // Align self to center in the flex container,
                                    justifySelf: "center", // Align self to center in the flex container
								}}
							>
								Skip
							</button>
					</div>
				)}
			</Window>
		</Overlay>
	);
}

export default StartComponent;
