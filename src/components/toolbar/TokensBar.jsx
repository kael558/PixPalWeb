import { useHue } from "@hooks/useHue";
import styles from "./TokensBar.module.css";

function Tokens({ showTokensPanel, tokens, tokensBarRef }) {
	const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();

	return (
		<div
			ref={tokensBarRef}
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "flex-end", // Aligns children to the right side of the container
				background: "rgba(0, 0, 0, 0.5)",
				padding: "0px 0px 0px 25px",
				marginTop: "20px",
				borderRadius: "25px",

				border: `1px solid ${hue}`,
				boxShadow: `0 0 5px rgba(${rgbStr},0.7)`,
	
		

				minWidth: "90px",
				transition: "transform 0.5s ease",

			}}
		>
			<img
				src="/diamonds/small_bundle_diamonds.png"
				alt="Tokens"
				style={{
					width: "60px",
					height: "60px",
					position: "absolute",

					right: "90px",
				}}
			/>
			<span
				style={{
					color: `${hue}`,
					fontSize: `${
						tokens.length > 7 ? "13px" : tokens.length > 6 ? "14px" : "16px"
					}`,
					letterSpacing: "0.1em",
				}}
			>
				{tokens}
			</span>
			<button
				onClick={showTokensPanel}
				style={{
					background: "transparent",
					border: "none",
					color: "#f0f0f0",
					cursor: "pointer",
					fontSize: "15px",
					transition: "all 0.3s",
				}}
				onMouseEnter={(e) => (e.currentTarget.style.scale = "1.3")}
				onMouseLeave={(e) => (e.currentTarget.style.scale = "1")}
			>
				<span>+</span>
			</button>
		</div>
	);
}

export default Tokens;
