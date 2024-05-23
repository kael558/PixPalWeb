import { useState, useEffect, Fragment } from "react";
import Tokens from "./TokensBar";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@hooks/useAuth";
import { Button, Dialog, DialogDismiss, DialogHeading } from "@ariakit/react";
import { FaSlidersH, FaCog } from "react-icons/fa";

function Toolbar({
	showLoginUI,
	showTokensPanel,
	streamManager,
	setMessages,
	setInputMode,
}) {
	const [open, setOpen] = useState(false);
	const { isAuthenticated, logout, isAnonymous } = useAuth();

	const handleLogout = () => {
		if (isAuthenticated() && isAnonymous()) {
			setOpen(true);
			return;
		}

		doLogout();
	};

	const resetMessages = () => {
		// delete messages from localstorage
		localStorage.removeItem("messages");
		setMessages([]);
	};

	const doLogout = () => {
		logout();
	};

	const [AIMenuOpen, setAIMenuOpen] = useState(false);
	const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

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

	const [volume, setVolume] = useState(0.5);

	useEffect(() => {
		streamManager.setVolume(volume);
	}, [volume, streamManager]);

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


				

				<AnimatePresence>
				{settingsMenuOpen && (
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
							width: "200px",
						}}
            initial={{ opacity: 0, x: 50 }}  // Start from the right, slightly hidden
            animate={{ opacity: 1, x: 0 }}  // Animate to fully visible and slide into position
            exit={{ opacity: 0, x: 50 }}    // Exit by fading out and sliding to the right
            transition={{ type: "spring", stiffness: 100 }}
					>
						<strong>Interaction Settings:</strong>
						{/* Toggle for Input mode*/}
						<button
							onClick={() =>
								setInputMode((prev) => (prev == "audio" ? "text" : "audio"))
							}
							style={{
								marginTop: "10px",
								padding: "8px 20px",
								borderRadius: "5px",
								backgroundColor: "#FFC107",
								color: "white",
								border: "none",
								cursor: "pointer",
							}}
						>
							{`Switch to ${!streamManager.inputMode ? "Audio" : "Text"} mode`}
						</button>

						<ul>
							<li>Volume</li>
							<li>UI Hue</li>
							<li>Show chat log</li>
						</ul>

						{isAuthenticated() && (
							<button
								onClick={handleLogout}
								style={{
									marginTop: "10px",
									padding: "8px 20px",
									borderRadius: "5px",
									backgroundColor: "#f44336",
									color: "white",
									border: "none",
									cursor: "pointer",
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
									backgroundColor: "#4CAF50",
									color: "white",
									border: "none",
									cursor: "pointer",
								}}
							>
								Login
							</button>
						)}
					</motion.div>
				)}
        </AnimatePresence>
        <AnimatePresence>
					{AIMenuOpen && (
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

								width: "200px",
								boxShadow: "0 0 20px rgba(255,163,69,0.7)",

        
							}}
              initial={{ opacity: 0, x: 50 }}  // Start from the right, slightly hidden
              animate={{ opacity: 1, x: 0 }}  // Animate to fully visible and slide into position
              exit={{ opacity: 0, x: 50 }}    // Exit by fading out and sliding to the right
              transition={{ type: "spring", stiffness: 100 }}
						>
							<div>AI Settings</div>
							<ul>
								<li>Gender</li>
								<li>Role</li>
								<li>Voice Quality</li>
								<li>Chat Quality</li>
								<li onClick={() => console.log("Reset Memory")}>
									Reset Memory
								</li>
							</ul>
							<button
								onClick={resetMessages}
								style={{
									marginTop: "10px",
									padding: "8px 20px",
									borderRadius: "5px",
									backgroundColor: "#2196F3",
									color: "white",
									border: "none",
									cursor: "pointer",
								}}
							>
								Reset Memory
							</button>
						</motion.div>
					)}
				</AnimatePresence>

        <FaSlidersH
					style={{ margin: "10px", cursor: "pointer", fontSize: "32px",
          color: AIMenuOpen ? "#FFC107" : "white"  // Correct syntax


           }}
					onClick={() => setAIMenuOpen(!AIMenuOpen)}
				/>

				<FaCog
					style={{ margin: "10px", cursor: "pointer", fontSize: "32px",
            color: settingsMenuOpen ? "#FFC107" : "white"


           }}
					onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
				/>

				<Dialog
					open={open}
					onClose={() => setOpen(false)}
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
