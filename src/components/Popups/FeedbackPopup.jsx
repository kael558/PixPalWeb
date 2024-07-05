import { toast } from "react-toastify";
import { useState } from "react";

import { Overlay, Window } from "./OverlayComponent";
import { useHue } from "@hooks/useHue";
import { TailSpin } from "react-loader-spinner";

function FeedbackPopup({ isVisible, onClose }) {
	const [feedback, setFeedback] = useState("");
	const [email, setEmail] = useState("");
	const [submittedOnce, setSubmittedOnce] = useState(false);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();

	const submitFeedback = async () => {
		if (feedback === "") {
			toast.error("Please enter feedback");
			return;
		}

		if (email === "") {
			if (!submittedOnce) {
				setSubmittedOnce(true);
				return;
			}
		}

		// Send feedback to server
		const data = new FormData();
		data.append("email", email);
		data.append("feedback", feedback);

		data.append("sheetName", "PixPal"); // Add this line to include the sheet name

		setIsSubmitting(true);

		try {
			const response = await fetch(
				"https://script.google.com/macros/s/AKfycbzUnCt-XonKsqeYtquXUtLduIdKkmxm01ZBKwuh9K2KyJ6MH-96rTpFC4kMy5jEVvaI/exec",
				{
					method: "POST",
					body: data,
				}
			);

			setIsSubmitting(false);

			if (!response.ok) {
				console.error("Failed to submit feedback:", response);
				toast.error("Failed to submit feedback");
			}
		} catch (error) {
			console.error("Error:", error);
		}

		onClose();
	};

	return (
		<Overlay
			isVisible={isVisible}
			style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
		>
			{isSubmitting && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						alignItems: "center",
						flexDirection: "column", // Set direction of flex items to column
						justifyContent: "center",
						borderRadius: "12px",
						zIndex: 2, // Make sure this is on top of other content
					}}
				>
					<TailSpin height="80" width="80" color="white" ariaLabel="loading" />
					<button
						onClick={() => setIsSubmitting(false)}
						style={{
							marginTop: "20px", // Add some space between the spinner and the button
							padding: "10px 20px",
							backgroundColor: "#073B4C",
							color: "white",
							borderRadius: "20px",
							border: "none",
							cursor: "pointer",
							fontSize: "16px",
							fontWeight: "bold",
							boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
							filter: "drop-shadow(0 0 2px rgba(255,163,69,0.4))", // Adding a subtle glow effect
						}}
					>
						Cancel
					</button>
				</div>
			)}
			<Window>
				<div>
					<h1
						style={{
							color: "white",
							textShadow: `0 0 10px rgba(${rgbStr},0.8)`,
							textAlign: "center",
						}}
					>
						Hey! We'd love to hear your feedback!
					</h1>
					<p style={{ color: "white" }}>What do you want PixPal for?</p>
					<textarea
						value={feedback}
						onChange={(event) => setFeedback(event.target.value)}
						placeholder="Enter your feedback here"
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

					<input
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="Enter your email"
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

					{submittedOnce && (
						<p
							style={{ color: "white", fontSize: "14px", marginBottom: "10px" }}
						>
							Hey, we'd love to follow up through email but we understand if you
							don't want to :)
						</p>
					)}

					<div style={{ display: "flex", justifyContent: "space-around" }}>
						<button
							onClick={submitFeedback}
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
							Submit
						</button>
					</div>
				</div>
			</Window>
		</Overlay>
	);
}

export default FeedbackPopup;
