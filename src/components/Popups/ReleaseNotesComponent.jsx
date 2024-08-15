import ReactMarkdown from "react-markdown";
import style from "./ReleaseNotesComponent.module.css";
import { Overlay, Window } from "./OverlayComponent";
import { useHue } from "@hooks/useHue";

function getApplicableReleaseNotes(version) {
	const totalReleaseNotes = `### Version 0.9.8 *[Beta]*
- Added high quality voice models
- Added narration toggle
- Added character thinking animation
- Fix for iPhone audio issues

### Version 0.9.7 *[Beta]*
- Update UI
- Add scene memory
- Feedback form
- Add splash page with onboarding
	
### Version 0.9.6 *[Alpha]*
- Update layouts
- Fix pricing on backend
- Analytics

### Version 0.9.5 *[Alpha]*
- Add chat log
- Base scene memory and sound effects
- Added socials
- Show audio visualizer on text input
- Use microphone button instead of tap anywhere

### Version 0.9.4 *[Alpha]*
- Add hue slider for UI color customization
- Add visual quality options to support lower grade devices
- Make voice more sensual with narration
- Change character name to Viona
- Onboarding now asks for input options (either voice or chat)

### Version 0.9.3 *[Alpha]*
- Add audio visualizer
- Update UI
- Basic NSFW with selectable options
- Color changes based on reaction
- Faster responses for medium and high quality chat models

### Version 0.9.2 *[Alpha]*
- Mute and Interrupt buttons
- Fix UI for mobile
- Anonymous sign-in at start
- Orb grows on start-up
- Start sequence asking for mood and role
- Improved conversation quality
- Added improved FX to visuals

### Version 0.9.1 *[Alpha]*
- Change audio input to tap instead of hold
- Now interrupts companion on new message
- Fix Asterisk spam
- Fix mobile UI
- Add mute button

### Version 0.9.0 *[Alpha]*
- Added support for chat messages
- Improved audio quality
- Conversation style chat
- Privacy policy update

### Version 0.8.0 *[Alpha]*
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

	if (version === "0.0.0") return totalReleaseNotes;
	const versions = totalReleaseNotes.split("### ").slice(1);
	const formattedVersions = versions.map((version) => `### ${version}`);
	const versionIndex = formattedVersions.findIndex((text) =>
		text.includes(`Version ${version}`)
	);

	const releaseNotes = formattedVersions.slice(0, versionIndex).join("\n\n");
	if (releaseNotes === "") return totalReleaseNotes;
}

const ReleaseNotesComponent = ({ isVisible, onClose, version }) => {
	let applicableReleaseNotes = getApplicableReleaseNotes(version);

	const { getRGBStr } = useHue();
	const rgbStr = getRGBStr();

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
				}}
			>
				<div
					style={{
						overflowY: "auto",

						alignItems: "flex-start",
						justifyContent: "flex-start",
						scrollbarColor: `rgba(${rgbStr}, 0.4) #0002`,
					}}
				>
					<h1
						style={{
							color: `rgba((${rgbStr}, 0.8)`, // Glowing text color
							textAlign: "center",
							textShadow: `0 0 20px rgba((${rgbStr},0.7)`, // Text shadow for glow effect
							marginBottom: "20px", // Space below the header
							fontSize: "24px", // Larger font size for emphasis
						}}
					>
						What's New Since you Last Visited?
					</h1>
					<ReactMarkdown
						children={applicableReleaseNotes}
						className={`${style.releaseNotes}`} // Assuming `style` is defined, add specific styles for markdown in your CSS
					/>
				</div>

				<button
					onClick={onClose}
					style={{
						padding: "10px",
						borderRadius: "5px",
						border: "none", // Removing border for a cleaner look
						cursor: "pointer",
						backgroundColor: `rgba(${rgbStr}, 0.8)`, // Glowing button background
						color: "white", // Text color for visibility
						marginTop: "auto",
						width: "100%", // Full-width button for better alignment and impact
						textShadow: "0 0 2px rgba(0,0,0,0.5)", // Subtle text shadow for depth
						fontSize: "16px",
						position: "sticky",
						bottom: "0",
					}}
					onMouseEnter={(event) => {
						event.target.style.backgroundColor = `rgba(${rgbStr}, 1)`; // Brighten the button on hover
					}}
					onMouseLeave={(event) => {
						event.target.style.backgroundColor = `rgba(${rgbStr}, 0.8)`; // Restore the original color on exit
					}}
				>
					Continue
				</button>
			</Window>
		</Overlay>
	);
};

export default ReleaseNotesComponent;
