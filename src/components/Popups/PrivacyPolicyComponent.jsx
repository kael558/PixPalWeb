import ReactMarkdown from "react-markdown";
import { Overlay, Window } from "./OverlayComponent";
import { useRef } from "react";
import { useHue } from "@hooks/useHue";

// down arrow icon
import { FaArrowDown } from "react-icons/fa";

const sectionsData = [
	{
		title: "Information Collection",
		content: `When you use PixPal, we collect the following types of information from you:
- Email Address: We collect your email address to create and manage your account.
- Chat Data: We track your chatting activities, including the length of messages sent, frequency of messages, session lengths, and settings chosen. We do not collect the contents of your messages.
- Purchase Information: We record details of the items you purchase within the app.`,
	},
	{
		title: "Usage of Information",
		content:
			"The information we collect is used to personalize and improve your experience within the app. This allows us to enhance gameplay features and offer a more customized interaction.",
	},
	{
		title: "Data Sharing",
		content: "We do not share your personal data with any third parties.",
	},
	{
		title: "Data Storage and Security",
		content:
			"Your data is stored in Firebase, and is protected according to their privacy policies. We do not store any personal data beyond what is required for Firebase.",
	},
	{
		title: "User Rights",
		content: `You have the right to access, correct, or delete your personal information stored by us. You can also refuse to provide analytics data. To exercise these rights, please adjust your settings within the app or contact us directly.`,
	},
	{
		title: "Consent",
		content:
			"Consent to collect your data is obtained when you start using the app for the first time. By continuing to use PixPal, you agree to this Privacy Policy and our data practices.",
	},
	{
		title: "Contact Information",
		content:
			"If you have any questions or concerns about your privacy, please contact us at [help@pixpal.ca](mailto:help@pixpal.ca)",
	},
	{
		title: "Updates to this Policy",
		content:
			"We may update this Privacy Policy from time to time. We encourage you to periodically review this for the latest information on our privacy practices.",
	},
];
const PrivacyPolicyComponent = ({ isVisible, onClose }) => {
    const containerRef = useRef(null);

	const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();

    return (
        <Overlay isVisible={isVisible}>
            <Window
                style={{
                    position: "relative", 
                    display: "flex", 
                    flexDirection: "column",
                    width: "80%",
                    height: "80%",
                    backgroundColor: "#222",
                    color: "white",
                    borderRadius: "20px",
                    border: `2px solid rgba(${rgbStr}, 0.8)`,
                    boxShadow: `0 0 20px rgba(${rgbStr},0.7), 0 0 40px rgba(${rgbStr},0.5) inset`,
                    padding: "20px",
                    backdropFilter: "blur(10px)",
                    maxHeight: "90vh",
                }}
            >
                <h1 style={{
                    color: `rgba(${rgbStr}, 0.8)`, 
                    alignSelf: "center",
                    margin: "0",
                }}>
                    Privacy Policy
                </h1>
                <div ref={containerRef} style={{
                    overflow: "auto",
        
                    scrollbarColor: `rgba(${rgbStr}, 0.4) #0002`,
                    flex: 1,  // Take up remaining space
                }}>
                    {sectionsData.map((section, index) => (
                        <div
                            key={index}
                            style={{
                                borderBottom: `2px solid rgba(${rgbStr}, 0.3)`,
                            }}
                        >
                            <h2 style={{
                                color: `rgba(${rgbStr}, 0.8)`,
                                fontSize: "20px",
                                textShadow: `0 0 10px rgba(${rgbStr},0.5)`,
                            }}>
                                {section.title}
                            </h2>
                            <ReactMarkdown
                                children={section.content}
                                style={{
                                    color: "#ccc",
                                    fontSize: "16px",
                                }}
                            />
                        </div>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        padding: "10px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: `rgba(${rgbStr}, 0.8)`,
                        color: "white",
                        marginTop: "10px",
                        width: "100%",
                        fontSize: "16px",
                        textShadow: "0 0 2px rgba(0,0,0,0.5)",
    
                    }}
                    onMouseEnter={(event) => {
						event.target.style.backgroundColor = `rgba(${rgbStr}, 1)`; // Brighten the button on hover
					}}
					onMouseLeave={(event) => {
						event.target.style.backgroundColor = `rgba(${rgbStr}, 0.8)`; // Restore the original color on exit
					}}

                >
                    Close
                </button>
            </Window>
        </Overlay>
    );
};
export default PrivacyPolicyComponent;
