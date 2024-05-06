import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function TokensComponent({ isVisible, onClose }) {

	const options = [
		{
			id: 0,
			title: "Bundle",
			price: "Free",
			image: "/diamonds/big_bundle_diamonds.png",
		},
		{
			id: 1,
			title: "Basic",
			price: "US $1.99",
			image: "/diamonds/bag_diamonds.png",
		},
		{
			id: 2,
			title: "Standard",
			price: "US $9.45",
			image: "/diamonds/barrel_diamonds.png",
		},
		{
			id: 3,
			title: "Premium",
			price: "US $17.99",
			image: "/diamonds/chest_diamonds.png",
		},
	];

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
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							gap: "20px",
							padding: "20px",
							backgroundColor: "#FFF",
							borderRadius: "12px",
							boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
							position: "relative",
						}}
					>
						{options.map((option) => (
							<div
								key={option.id}
								style={{
									textAlign: "center",
									padding: "20px",
									backgroundColor: "#1A1A2E", // Dark blue background for the card
									boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // More pronounced shadow for depth
									borderRadius: "12px", // Rounded corners for a softer look
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: "10px",
								}}
							>
								<img
									src={option.image}
									alt={option.title}
									style={{
										width: "100px",
										height: "100px",
										borderRadius: "50%", // Circular images
										objectFit: "cover", // Ensures the image covers the space without stretching
										boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)", // More pronounced shadow for the image
									}}
								/>
								<h3
									style={{
										fontSize: "18px", // Slightly larger text for visibility
										color: "#E0E0E0", // Light gray for contrast against dark background
										margin: "10px 0 5px 0", // Space above and below the title
									}}
								>
									{option.title}
								</h3>

								<button
									style={{
										padding: "10px 20px", // Generous padding for a better click area
										backgroundColor: "#0F52BA", // Sapphire blue background
										color: "white", // White text for contrast
										borderRadius: "20px", // More pronounced rounded corners on the button
										border: "none", // No border for a cleaner look
										cursor: "pointer",
										transition: "background-color 0.3s", // Smooth transition for hover effects
										fontSize: "16px", // Slightly larger font for readability
										fontWeight: "bold", // Bold text to make the button text stand out
										boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", // More pronounced shadow to lift the button visually
									}}
									onMouseEnter={(e) =>
										(e.target.style.backgroundColor = "#073B4C")
									} // Dark cyan on hover
									onMouseLeave={(e) =>
										(e.target.style.backgroundColor = "#0F52BA")
									} // Reset color on mouse leave
								>
									{option.price}
								</button>
							</div>
						))}

						<button
							onClick={onClose}
							style={{
								position: "absolute",
								top: "2px",
								right: "2px",
								background: "none",
								border: "none",
								cursor: "pointer",
								fontSize: "16px",
							}}
						>
							✖
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default TokensComponent;
