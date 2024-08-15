import { useHue } from "@hooks/useHue";
import {  FaInstagram, FaTiktok, FaDiscord } from "react-icons/fa";

function SplashHeader({
	chatWithEla,
	showPrivacyPolicy,
	showReleaseNotes,
	isMobile,
}) {
	const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();

	return (
		<div>
			<div
				style={{
					position: "absolute",
					top: isMobile ? "17%" : "23%",
					width: isMobile ? "90%" : "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",

					color: "white",
					pointerEvents: "none",
					transition: "opacity 0.3s",
					fontFamily: "Menlo, monospace",
					letterSpacing: "0.05em",
					textAlign: "center",
				}}
			>
				<h1
					style={{
						fontSize: isMobile ? "1.3rem" : "2.0rem",
					}}
				>
					Meet Pixpal: Your AI Companion for Emotional Wellbeing
				</h1>

				<h3
					style={{
						fontSize: isMobile ? "0.8rem" : "1.2rem",
						fontWeight: "normal",
						marginTop: "20px",
						opacity: 0.8,
					}}
				>
					Get the support you need, when you need it. Heal, grow, and thrive
					with Pixpals
				</h3>
			</div>
			<button
				style={{
					position: "absolute",
					top: isMobile ? "70%" : "75%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					backgroundColor: `rgba(${rgbStr}, 1)`,
					boxShadow: `0 0 15px rgba(${rgbStr}, 1)`,
					color: "white",
					border: "none",
					cursor: "pointer",
					fontSize: isMobile ? "14px" : "16px",
					textShadow: "0 0 2px rgba(0,0,0,0.5)",
					marginTop: "20px",
					transition: "all 0.3s ease",
					fontFamily: "Menlo, monospace",
					letterSpacing: "0.05em",
					borderRadius: "18px",
					padding: isMobile ? "10px 15px": "14px 20px",
				}}
				onClick={chatWithEla}
				onMouseEnter={(e) => {
					// make it significantly lighter and larger
					e.currentTarget.style.backgroundColor = `rgba(${rgbStr}, 1)`;
					e.currentTarget.style.boxShadow = `0 0 25px rgba(${rgbStr}, 1)`;
					e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.15)";
				}}
				onMouseLeave={(e) => {
					// revert back to original color and size
					e.currentTarget.style.backgroundColor = `rgba(${rgbStr}, 0.8)`;
					e.currentTarget.style.boxShadow = `0 0 15px rgba(${rgbStr}, 1)`;
					e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
				}}
			>
				Talk with Viona
			</button>
			<div
				style={{
                    position: "absolute",
					top: isMobile ? "80%" : "83%",
					left: "50%",
					transform: "translate(-50%, -50%)",

					display: "flex",
					justifyContent: "center", // Centers the icons horizontally
					alignItems: "center", // Centers the icons vertically
				
				}}
			>
				<FaDiscord
					style={{
						color: hue,
						fontSize: isMobile ? "1.3em" : "1.5em",
						cursor: "pointer", // Indicates that the icon is clickable
					}}
					onClick={() => {
						window.open("https://discord.gg/8bB5VpAHHT");
					}}
				/>
				<FaInstagram
					style={{
						color: hue,
                        fontSize: isMobile ? "1.3em" : "1.5em",
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
						fontSize: isMobile ? "1.3em" : "1.5em",
						cursor: "pointer",
					}}
					onClick={() => {
						window.open("https://www.tiktok.com/@elagonai");
					}}
				/>
			</div>

			<span
				style={{
					position: "absolute",
					bottom: "10px",
                    textAlign: "center",
                    width: "100%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}
			>
				<button
					onClick={showReleaseNotes}
					style={{
						marginTop: "10px",
						padding: "0px 20px",
						border: "none",
						background: "none",
						color: "white", // Change to a link color
						cursor: "pointer",
						fontWeight: "bold",
						letterSpacing: "0.1em",
						transition: "color 0.3s",
						fontSize: isMobile ? "11px" : "14px",
						textDecoration: "underline", // Underline to look like a link
					}}
				>
					Release Notes
				</button>
				<button
					onClick={showPrivacyPolicy}
					style={{
						marginTop: "10px",
						padding: "0px 20px",
						border: "none",
						background: "none",
						color: "white", // Change to a link color
						cursor: "pointer",
						fontWeight: "bold",
						letterSpacing: "0.1em",
						transition: "color 0.3s",
						fontSize: isMobile ? "11px" : "14px",
						textDecoration: "underline", // Underline to look like a link
					}}
				>
					Privacy Policy
				</button>
			</span>
		</div>
	);
}

export default SplashHeader;
