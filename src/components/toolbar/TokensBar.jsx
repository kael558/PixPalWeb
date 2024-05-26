import { useEffect, useState } from "react";
import { useAuth } from "@hooks/useAuth";

import styles from "./Tokens.module.css";

import RainbowButton from "../RainbowButton";

async function get_tokens(accessToken) {
	console.log("Bearer " + accessToken);
	//return { tokens: 0 }; // temp

	return fetch(
		"https://0xlgvmu6h4.execute-api.us-east-1.amazonaws.com/tokens",
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)
		.then((response) => {
			if (response.ok) {
				return response.json(); // Return the promise to be handled by the next .then()
			} else {
				throw new Error("Failed to fetch tokens");
			}
		})
		.then((data) => {
			console.log("Data:", data);
			return data; // Return data for subsequent handling
		})
		.catch((error) => {
			console.error("Error:", error);
			return { tokenCount: 0 }; // Return default object in case of error
		});
}

function Tokens({ showTokensPanel }) {
	const [tokens, setTokens] = useState(null);

	const { isAuthenticated, getAccessToken } = useAuth();

	useEffect(() => {
		getAccessToken()
			.then((token) => {
				get_tokens(token).then((data) => {
					// put commas in the number
					let tokens =
						data?.tokenCount
							?.toString()
							?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;

	

					setTokens(tokens); // Fallback to 0 if data.tokens is undefined
				});
			})
			.catch((error) => {
				console.error("Error getting ID token:", error);
			});
	}, []);

	return (
		<>
			<img
				src="/diamonds/small_bundle_diamonds.png"
				alt="Tokens"
				style={{
					width: "60px", // Adjust size as needed
					height: "60px", // Adjust size as needed
					position: "absolute",
					top: "4px",
					right: "85px",
				
				}}
			/>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					background: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
					padding: "0px 0px 0px 25px", // Padding for the text
					marginTop: "20px",
					borderRadius: "25px",
					border: "1px solid #FFA345", // Light border for contrast
					boxShadow: "0 0 5px rgba(255,163,69,0.7)"
				}}
			>
				<span
					style={{
						color: "#FFA345", // Lighter color for text
						marginRight: "auto", // Pushes the button to the right
						fontSize: "16px", // Adjust size as needed
						letterSpacing: "0.1em", // Adds space between characters

					}}
				>
					{tokens ?? "Loading..."}
				</span>
				<button
					onClick={showTokensPanel}
					style={{
						background: "transparent",
						border: "none",
						color: "#f0f0f0",
						cursor: "pointer",
						fontSize: "16px",
						display: "flex",
						alignItems: "center",
					}}
				>
					<span>+</span>
				</button>
			</div>
		</>
	);
}

export default Tokens;

/*
    <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px 20px',
            backgroundColor: '#f4f4f4', // Soft background color
            borderRadius: '8px', // Rounded corners for the container
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Subtle shadow for depth
            maxWidth: '300px', // Limiting width for better control of the layout
            height: '50px', // Ensuring it fits in the header
            margin: '0', // Centering in the viewport with margin
            textAlign: 'center' // Ensures text alignment is centered
        }}>
            
        </div>
<div style={{
                display: 'flex',
                alignItems: 'center', // Align items on the line
                width: '100%', // Full width of the parent container
                justifyContent: 'flex-end', // Align text to the right
            }}>
                

             
            </div>

                <img src="./basic_diamonds.png" alt="Diamonds" style={{ marginRight: '10px', width: '50px', height: '50px' }}/>
                <div style={{
                    flexGrow: 1, // Allows this div to take up the remaining space
                    marginRight: '10px', // Space between the text/bar and the button
                }}>
                    <img src="money-image.jpg" alt="Money Image" class="money-image"/>
                    <span class="currency">$100</span>
                    <button class="plus-button">+</button>
        
                    <p style={{ color: '#606060', fontSize: '16px', fontWeight: 'bold',  background: 'gray', padding: '2px 20px' }}>{loading ? 'Loading...' : tokens}</p>
                </div>
                <RainbowButton
                    text="+"
                    onClick={() => console.log("Buy Tokens")}
                    style={{
                        fontSize: '24px', // Larger font size for the button text
                        fontWeight: 'bold', // Makes the button text bold
                        padding: '10px 20px', // Better padding for a more clickable area
                        borderRadius: '5px', // Rounded corners for the button
                        width: '50px', // Fixed width for consistent size
                    }}
                />*/
