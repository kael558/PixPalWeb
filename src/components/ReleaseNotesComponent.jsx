import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import style from "./ReleaseNotesComponent.module.css";

function getApplicableReleaseNotes(version) {
    const totalReleaseNotes = `### Version 0.9.1 *[Beta]*
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

    const versions = totalReleaseNotes.split('### ').slice(1); 
    const formattedVersions = versions.map(version => `### ${version}`);
    const versionIndex = formattedVersions.findIndex(text => text.includes(`Version ${version}`));
 
    return formattedVersions.slice(0, versionIndex).join('\n\n');
}

const ReleaseNotesComponent = ({ isVisible, onClose, version }) => {
    let applicableReleaseNotes = getApplicableReleaseNotes(version);

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
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "10px",
							boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
							position: "relative",
							width: "80%",
							height: "80%",
							maxHeight: "400px",
							overflowY: "auto",
						}}
					>
						<h1 style={{ color: "#333", textAlign: "center" }}>
							What's New Since you Last Visited?
						</h1>
                        <ReactMarkdown
                            children={applicableReleaseNotes}
                            className={style.releaseNotes}
						/>
						<button
							onClick={onClose}
							style={{
								padding: "10px",
								borderRadius: "5px",
								border: "1px solid #ccc",
								cursor: "pointer",
								backgroundColor: "#068FFF",
								color: "white",
								marginTop: "10px",
							}}
						>
							Continue
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ReleaseNotesComponent;
