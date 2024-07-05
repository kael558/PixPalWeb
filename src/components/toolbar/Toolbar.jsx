import { useState, useEffect, Fragment, useRef } from "react";
import Tokens from "./TokensBar";
import AISettings from "./AISettings";
import Settings from "./Settings";

import { useAuth } from "@hooks/useAuth";
import { useHue } from "@hooks/useHue";
import { Button, Dialog, DialogDismiss, DialogHeading } from "@ariakit/react";
import { FaSlidersH, FaCog } from "react-icons/fa";

function Toolbar({
	showLoginUI,
	showTokensPanel,
	streamManager,
	setMessages,
	inputMode,
	setInputMode,
	gender,
	setGender,
	role,
	setRole,
	voiceQuality,
	setVoiceQuality,
	chatQuality,
	setChatQuality,
	visualQuality,
	setVisualQuality,
	tokens,
	isMobile,
	showChatLog,
	setShowChatLog,
	tokensBarRef,
	showPrivacyPolicy,
	showReleaseNotes
}) {
	const [showDialog, setShowDialog] = useState(false);
	const [AIMenuOpen, setAIMenuOpen] = useState(false);
	const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

	const { logout } = useAuth();
	const { hue } = useHue();

	const doLogout = () => {
		logout();
	};

	useEffect(() => {
		if (AIMenuOpen) {
			setSettingsMenuOpen(false);
		}
	}, [AIMenuOpen]);

	useEffect(() => {
		if (settingsMenuOpen) {
			setAIMenuOpen(false);
		}
	}, [settingsMenuOpen]);

	return (
		<Fragment>
			<div
				style={{
					position: "absolute",
					top: 0,
					right: "100px",
				}}
			>
				<Tokens showTokensPanel={showTokensPanel} tokens={tokens} tokensBarRef={tokensBarRef} />
			</div>

			<div
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					display: "flex",
					flexDirection: "column", // Organize children in a column
					alignItems: "center", // Center children horizontally
					justifyContent: "flex-start", // Align children to the top of the container
					padding: "10px",

					color: "white", // White text color for icons
				}}
			>
				<Settings
					isVisible={settingsMenuOpen}
					showLoginUI={showLoginUI}
					inputMode={inputMode}
					setInputMode={setInputMode}
					streamManager={streamManager}
					doLogout={doLogout}
					setShowDialog={setShowDialog}
					visualQuality={visualQuality}
					setVisualQuality={setVisualQuality}
					isMobile={isMobile}
					showChatLog={showChatLog}
					setShowChatLog={setShowChatLog}
					showPrivacyPolicy={showPrivacyPolicy}
					showReleaseNotes={showReleaseNotes}
				/>

				<AISettings
					isVisible={AIMenuOpen}
					setMessages={setMessages}
					gender={gender}
					setGender={setGender}
					role={role}
					setRole={setRole}
					voiceQuality={voiceQuality}
					setVoiceQuality={setVoiceQuality}
					chatQuality={chatQuality}
					setChatQuality={setChatQuality}
					isMobile={isMobile}
				/>

				<FaSlidersH
					style={{
						margin: "10px",
						cursor: "pointer",
						fontSize: isMobile ? "26px" : "32px",
						color: AIMenuOpen ? hue : "white", // Correct syntax
						transition: "transform 0.4s",
					}}
					onClick={() => setAIMenuOpen(!AIMenuOpen)}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "scale(1.1)"; // Use currentTarget for consistency
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
				/>

				<FaCog
					style={{
						margin: "10px",
						cursor: "pointer",
						fontSize: isMobile ? "26px" : "32px",
						color: settingsMenuOpen ? hue : "white",
						transition: "transform 0.4s",
					}}
					onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "scale(1.1)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
				/>

				<Dialog
					open={showDialog}
					onClose={() => setShowDialog(false)}
					getPersistentElements={() => document.querySelectorAll(".Toastify")}
					backdrop={<div className="backdrop" />}
					className="dialog"
				>
					<DialogHeading className="heading">Warning</DialogHeading>
					<p className="description">
						You are currently logged in as a guest. You will lose all your data
						if you log out. Are you sure you want to log out?
					</p>
					<div className="buttons">
						<Button className="button" onClick={doLogout}>
							Logout
						</Button>
						<DialogDismiss className="button secondary">Cancel</DialogDismiss>
					</div>
				</Dialog>
			</div>
		</Fragment>
	);
}

export default Toolbar;
