import { useState, useEffect, Fragment } from "react";
import Tokens from "./TokensBar";
import AISettings from "./AISettings";
import Settings from "./Settings";

import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@hooks/useAuth";
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
	setChatQuality
}) {
	const [showDialog, setShowDialog] = useState(false);
	const [AIMenuOpen, setAIMenuOpen] = useState(false);
	const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

	const { logout } = useAuth();

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
				<Tokens showTokensPanel={showTokensPanel} />
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
					height: "100%", // Stretch along the full height of the viewport
					backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent black background
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
				
				
				/>

				<FaSlidersH
					style={{
						margin: "10px",
						cursor: "pointer",
						fontSize: "32px",
						color: AIMenuOpen ? "#FFC107" : "white", // Correct syntax
					}}
					onClick={() => setAIMenuOpen(!AIMenuOpen)}
				/>

				<FaCog
					style={{
						margin: "10px",
						cursor: "pointer",
						fontSize: "32px",
						color: settingsMenuOpen ? "#FFC107" : "white",
					}}
					onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
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
