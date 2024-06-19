import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@hooks/useAuth";
import { FaVolumeUp, FaInstagram, FaTiktok, FaDiscord } from "react-icons/fa";
import { toast } from "react-toastify";
import { useHue } from "@hooks/useHue";
import { useLocalStorage } from "@hooks/useLocalStorage";

function hueToRGB(hue) {
	const saturation = 1; // 100% saturation
	const lightness = 0.5; // 50% lightness

	// C is the chroma
	const C = (1 - Math.abs(2 * lightness - 1)) * saturation;
	const X = C * (1 - Math.abs(((hue / 60) % 2) - 1));
	const m = lightness - C / 2;

	let r = 0,
		g = 0,
		b = 0;

	if (hue >= 0 && hue < 60) {
		r = C;
		g = X;
		b = 0;
	} else if (hue >= 60 && hue < 120) {
		r = X;
		g = C;
		b = 0;
	} else if (hue >= 120 && hue < 180) {
		r = 0;
		g = C;
		b = X;
	} else if (hue >= 180 && hue < 240) {
		r = 0;
		g = X;
		b = C;
	} else if (hue >= 240 && hue < 300) {
		r = X;
		g = 0;
		b = C;
	} else if (hue >= 300 && hue < 360) {
		r = C;
		g = 0;
		b = X;
	}

	// Convert the RGB components to values that are in the range 0-255
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	// convert to hex
	const rHex = r.toString(16).padStart(2, "0");
	const gHex = g.toString(16).padStart(2, "0");
	const bHex = b.toString(16).padStart(2, "0");

	return `#${rHex}${gHex}${bHex}`;
}

function rgbToHue(rgb) {
	const [r, g, b] = rgb.match(/\w\w/g).map((x) => parseInt(x, 16));
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	if (max === min) return 0; // achromatic case (grey)

	let hue = 0;
	const delta = max - min;
	if (max === r) {
		hue = (g - b) / delta + (g < b ? 6 : 0);
	} else if (max === g) {
		hue = (b - r) / delta + 2;
	} else {
		hue = (r - g) / delta + 4;
	}
	hue = Math.round(hue * 60);
	if (hue < 0) hue += 360;
	return hue;
}

function Settings({
	isVisible,
	showLoginUI,
	inputMode,
	setInputMode,
	streamManager,
	doLogout,
	setShowDialog,
	visualQuality,
	setVisualQuality,
	isMobile,
	showChatLog,
	setShowChatLog,
}) {
	const [volume, setVolume] = useLocalStorage(
		"volume",
		streamManager.getVolume()
	);
	streamManager.setVolume(volume);

	const { hue, getRGBStr, setHue } = useHue();
	const rgbStr = getRGBStr();

	// convert rgb hue to int
	const hueValue = rgbToHue(hue);

	//const [uiHue, setUiHue] = useState("#FFC107"); // Default color

	const { isAuthenticated, isAnonymous, auth } = useAuth();

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogout = () => {
		if (isAuthenticated() && isAnonymous()) {
			setShowDialog(true);
			return;
		}

		doLogout();
	};

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
		});
	}, [auth]);

	useEffect(() => {
		streamManager.setVolume(volume);
	}, [volume, streamManager]);

	const optionStyle = (current, value) => ({
		cursor: "pointer",
		color: current === value ? hue : "white",
		border: current === value ? `1px solid ${hue}` : "none",
		padding: "0 5px",
		margin: "0 5px",
		fontSize: isMobile ? "14px" : "inherit",
		letterSpacing: isMobile ? "0.05em" : "0.1em",
	});

	const categoryStyle = {
		color: hue,
		fontWeight: "bold",
		fontSize: isMobile ? "12px" : "inherit",
		letterSpacing: isMobile ? "0.05em" : "0.1em",
	};

	const liStyle = {
		padding: "8px 0",
		listStyleType: "none",
		textIndent: "-2em",
		letterSpacing: isMobile ? "0.05em" : "0.1em",
	};

	useEffect(() => {
		streamManager.setVolume(volume);
	}, [volume, streamManager]);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					style={{
						position: "absolute",
						right: "60px",
						top: "60px", // Adjust this value based on the actual layout
						background: "#000",
						border: `1px solid ${hue}`,
						borderRadius: "8px",
						padding: "10px",
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						boxShadow: `0 0 20px rgba(${rgbStr},0.7)`,
						width: "auto",
						minWidth: isMobile ? "300px" : "325px",
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
							marginBottom: "0px",
							color: "white",
							letterSpacing: "0.1em",
						}}
					>
						Settings
					</div>
					<ul>
						<li style={liStyle}>
							<span style={categoryStyle}>
								<FaVolumeUp
									style={{
										color: hue,
										margin: "0px",
										padding: "0px",
										marginRight: "5px",
										fontSize: "1.2em",
										verticalAlign: "middle",
									}}
								/>
							</span>

							<span>
								<input
									type="range"
									min="0"
									max="1"
									step="0.01"
									value={volume}
									onChange={(e) => setVolume(e.target.value)}
									style={{
										appearance: "none",
										width: "80%",
										marginLeft: "10px",
										marginTop: "0px",
										padding: "0px",
										height: "8px",
										borderRadius: "4px",

										backgroundImage: `linear-gradient(to right, ${hue} ${
											volume * 100
										}%, #CCC ${volume * 100}%)`,
										outline: "none",
										transition: "opacity .2s",
										accentColor: "white",
										"&::WebkitSliderThumb": {
											appearance: "none",
											width: "20px",
											height: "20px",
											borderRadius: "50%",
											backgroundColor: "#FFF",
											cursor: "pointer",
											boxShadow: "0 0 2px #555",
										},
										"&::MozRangeThumb": {
											width: "20px",
											height: "20px",
											borderRadius: "50%",
											backgroundColor: "#FFF",
											cursor: "pointer",
											border: "none",
										},
									}}
								/>
							</span>
						</li>

						<li style={liStyle}>
							<span style={categoryStyle}>HUE:</span>
							<span>
								<input
									type="range"
									min="0"
									max="360"
									step="1"
									value={hueValue}
									onChange={(e) => {
										const hueValue = parseInt(e.target.value);
										const rgbColor = hueToRGB(hueValue);
										setHue(rgbColor);
									}}
									style={{
										marginLeft: "10px",
										appearance: "none",
										width: "80%",
										height: "8px",
										borderRadius: "4px",
										backgroundImage:
											"linear-gradient(to right, red, yellow, lime, aqua, blue, fuchsia, red)",
										outline: "none",
										transition: "opacity .2s",
										accentColor: "white",
										"&::WebkitSliderThumb": {
											appearance: "none",
											width: "20px",
											height: "20px",
											borderRadius: "50%",
											backgroundColor: "#FFF",
											cursor: "pointer",
											boxShadow: "0 0 2px #555",
										},
										"&::-moz-range-thumb": {
											width: "20px",
											height: "20px",
											borderRadius: "50%",
											backgroundColor: "#FFF",
											cursor: "pointer",
											border: "none",
										},
									}}
								/>
							</span>
						</li>

						<li style={liStyle}>
							<span style={categoryStyle}>Chat Log:</span>
							<span
								style={optionStyle(showChatLog, true)}
								onClick={() => setShowChatLog(true)}
							>
								ON
							</span>
							/
							<span
								style={optionStyle(showChatLog, false)}
								onClick={() => setShowChatLog(false)}
							>
								OFF
							</span>
						</li>
						<li style={liStyle}>
							<span style={categoryStyle}>Input Mode:</span>
							<span
								style={optionStyle(inputMode, "text")}
								onClick={() => setInputMode("text")}
							>
								Text
							</span>
							/
							<span
								style={optionStyle(inputMode, "audio")}
								onClick={() => setInputMode("audio")}
							>
								Audio
							</span>
						</li>
						<li style={liStyle}>
							<span style={categoryStyle}>Visual Quality:</span>
							<span
								style={optionStyle(visualQuality, "Basic")}
								onClick={() => setVisualQuality("Basic")}
							>
								Basic
							</span>
							/
							<span
								style={optionStyle(visualQuality, "Advanced")}
								onClick={() => setVisualQuality("Advanced")}
							>
								Advanced
							</span>
						</li>
					</ul>

					<div
						style={{
							display: "flex",
							justifyContent: "center", // Centers the icons horizontally
							alignItems: "center", // Centers the icons vertically
							height: "100%", // Use an appropriate height as needed
							padding: "0", // Adds vertical padding for better spacing
							width: "100%", // Use an appropriate width as needed
						}}
					>
						<FaDiscord
							style={{
								color: hue,
								fontSize: "1.5em", // Slightly larger icons for better visibility
								cursor: "pointer", // Indicates that the icon is clickable
							}}
							onClick={() => {
								window.open("https://discord.gg/8bB5VpAHHT");
							}}
						/>
						<FaInstagram
							style={{
								color: hue,
								fontSize: "1.5em",
								cursor: "pointer",
								margin: "0 20px", // Adds horizontal margin between icons
							}}
							onClick={() => {
								window.open("https://www.instagram.com/elagonai/");
							}}
						/>
						<FaTiktok
							style={{
								color: hue,
								fontSize: "1.5em",
								cursor: "pointer",
							}}
							onClick={() => {
								window.open("https://www.tiktok.com/@elagonai");
							}}
						/>
					</div>

					<span
						style={{
							display: "flex",
							flexDirection: "row",
							gap: "10px",
							justifyContent: "center",
							width: "100%",
						}}
					>
						{isLoggedIn && !isAnonymous() && (
							<button
								onClick={handleLogout}
								style={{
									marginTop: "10px",
									padding: "8px 20px",
									borderRadius: "5px",
									backgroundColor: hue,
									color: "black",

									cursor: "pointer",
									fontWeight: "bold",
									letterSpacing: "0.1em",
									transition: "background-color 0.3s, color 0.3s",
									fontSize: "13px",
									border: "1px solid black",
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
								Logout
							</button>
						)}

						{(!isLoggedIn || isAnonymous()) && (
							<button
								onClick={showLoginUI}
								style={{
									marginTop: "10px",
									padding: "8px 20px",
									borderRadius: "5px",
									backgroundColor: hue,
									border: "1px solid black",
									color: "black",

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
								Login
							</button>
						)}
					</span>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default Settings;
