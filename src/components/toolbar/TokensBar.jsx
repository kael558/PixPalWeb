import { useEffect, useState } from "react";
import { useAuth } from "@hooks/useAuth";
import { useHue } from "@hooks/useHue";

import styles from "./Tokens.module.css";

import RainbowButton from "../RainbowButton";



function Tokens({ showTokensPanel, tokens }) {
	const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();

	return (
		<>
			<img
				src="/diamonds/small_bundle_diamonds.png"
				alt="Tokens"
				style={{
					width: "60px",
					height: "60px",
					position: "absolute",
					top: "4px",
					right: "90px",
				}}
			/>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "flex-end",  // Aligns children to the right side of the container
					background: "rgba(0, 0, 0, 0.5)",
					padding: "0px 0px 0px 25px",
					marginTop: "20px",
					borderRadius: "25px",
					border: `1px solid ${hue}`,
					boxShadow: `0 0 5px rgba(${rgbStr},0.7)`,
					minWidth: "90px",
				}}
			>
				<span
					style={{
						color: `${hue}`,
						fontSize: `${tokens.length > 7 ? "13px" : tokens.length > 6 ? "14px" : "16px"}`,
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
