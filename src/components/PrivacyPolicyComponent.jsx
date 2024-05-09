import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';

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
							flexDirection: "column",

							backgroundColor: "white",
							padding: "20px",
							borderRadius: "10px",
							boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
							position: "relative",
							width: "80%",
							height: "80%",
							maxHeight: "400px",
							overflowY: "auto",
						}}
					>
						<h1 style={{ color: "#333", textAlign: "center" }}>
							Privacy Policy
						</h1>
						{sectionsData.map((section, index) => (
							<div
								key={index}
								style={{
									borderBottom: "2px solid #ccc",
									paddingBottom: "10px",
								}}
							>
								<h2 style={{ color: "#333", fontSize: "24px" }}>
									{section.title}
								</h2>
                                <ReactMarkdown
                                    children={section.content}
                                    style={{ color: "#666", fontSize: "16px", lineHeight: "1.6" }}
                                />
							</div>
						))}

						<button
                            onClick={onClose}
							style={{
								padding: "10px",
								borderRadius: "5px",
								border: "1px solid #ccc",
								cursor: "pointer",
								backgroundColor: "#068FFF",
								color: "white",
								marginTop: "10px",
							}}
						>
							Continue
						</button>
	
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default PrivacyPolicyComponent;
