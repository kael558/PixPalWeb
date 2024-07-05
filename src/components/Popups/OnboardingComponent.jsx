import { Overlay, Window } from "./OverlayComponent";
import { useHue } from "@hooks/useHue";

function OnboardingComponent({
	isVisible,
	name,
	setName,
	playOnboarding
}) {
	const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();

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
										playOnboarding("audio");
									}}
									style={{
										padding: "10px",
										borderRadius: "5px",
										border: "none",
										cursor: "pointer",
										backgroundColor: `rgba(${rgbStr}, 1.0)`,
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
										playOnboarding("text");
									}}
									style={{
										padding: "10px",
										borderRadius: "5px",
										border: "none",
										cursor: "pointer",
										backgroundColor: `rgba(${rgbStr}, 1.0)`,
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
