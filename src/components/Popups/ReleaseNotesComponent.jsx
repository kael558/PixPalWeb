import ReactMarkdown from "react-markdown";
import style from "./ReleaseNotesComponent.module.css";
import { Overlay, Window } from "./OverlayComponent";

function getApplicableReleaseNotes(version) {
	const totalReleaseNotes = `### Version 0.9.3 *[Beta]*
	- Add audio visualizer
	- Update UI
	- Basic NSFW with selectable options
	- Color changes based on reaction
	- Faster responses for medium and high quality chat models
	
	### Version 0.9.2 *[Beta]*
	- Mute and Interrupt buttons
	- Fix UI for mobile
	- Anonymous sign-in at start
	- Orb grows on start-up
	- Start sequence asking for mood and role
	- Improved conversation quality
	- Added improved FX to visuals
	
	### Version 0.9.1 *[Beta]*
	- Change audio input to tap instead of hold
	- Now interrupts companion on new message
	- Fix Asterisk spam
	- Fix mobile UI
	- Add mute button
	
	### Version 0.9.0 *[Beta]*
    - Added support for chat messages
    - Improved audio quality
    - Conversation style chat
    - Privacy policy update
    
    ### Version 0.8.0 *[Beta]*
    - Token purchase options
    - Toast system
    - Voice input
    - Fix basic chat memory
    - Fix re-rendering of scene
    - Fix audio glitching
    - Basic onboarding sequence
    - Randomize orb movement
    - Authentication system
    
    ### Version 0.0.0
    - Voice streaming
    - Basic UI
    - Chat input
    - Particle orb`;

	const versions = totalReleaseNotes.split("### ").slice(1);
	const formattedVersions = versions.map((version) => `### ${version}`);
	const versionIndex = formattedVersions.findIndex((text) =>
		text.includes(`Version ${version}`)
	);

	return formattedVersions.slice(0, versionIndex).join("\n\n");
}

const ReleaseNotesComponent = ({ isVisible, onClose, version }) => {
	let applicableReleaseNotes = getApplicableReleaseNotes(version);

	return (
		<Overlay isVisible={isVisible}>
			<Window
				style={{
					display: "flex",
					flexDirection: "column",

					padding: "20px",
					borderRadius: "10px",
					boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
					position: "relative",

					width: "30%",


					maxHeight: "400px",
					overflowY: "auto",

					alignItems: "flex-start",
					justifyContent: "flex-start",
				}}
			>
				<h1
					style={{
						color: "rgba(255, 163, 69, 0.8)", // Glowing text color
						textAlign: "center",
						textShadow: "0 0 20px rgba(255,163,69,0.7)", // Text shadow for glow effect
						marginBottom: "20px", // Space below the header
					}}
				>
					What's New Since you Last Visited?
				</h1>
				<ReactMarkdown
					children={applicableReleaseNotes}
					className={`${style.releaseNotes}`} // Assuming `style` is defined, add specific styles for markdown in your CSS

				/>
				<button
					onClick={onClose}
					style={{
						padding: "10px",
						borderRadius: "5px",
						border: "none", // Removing border for a cleaner look
						cursor: "pointer",
						backgroundColor: "rgba(255, 163, 69, 0.8)", // Glowing button background
						color: "black", // Text color for visibility
						marginTop: "10px",
						width: "100%", // Full-width button for better alignment and impact
						textShadow: "0 0 2px rgba(0,0,0,0.5)", // Subtle text shadow for depth
					}}
				>
					Continue
				</button>
			</Window>
		</Overlay>
	);
};

export default ReleaseNotesComponent;
