import { useEffect, useRef } from "react";
import { useHue } from "@hooks/useHue";
import ReactMarkdown from "react-markdown";
import { renderers } from "react-markdown";

function ChatLog({ name, characterName, messages, isMobile, inputMode }) {
	const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();
	const messageListRef = useRef(null);

	const messageList = messages.map((message, i) => {
		const formattedContent = message.content
			.replace(/[^ \n-~]/g, "")
			.replace(/\(/g, "*")
			.replace(/\)/g, "*");

		return (
			<section
				key={i}
				style={{
					...{
						marginBottom: "10px",
						padding: "2px 10px",

						borderRadius: "10px",

						fontFamily: "Menlo, monospace",
						fontSize: "12px",
						letterSpacing: "0.05em",
						maxWidth: "69%",
						width: "fit-content",
					},
					...(message.role === "assistant"
						? {
								alignSelf: "flex-start",
								background: `rgba(${rgbStr}, 0.5)`,
						  }
						: {
								background: `rgba(0,0,0, 0.5)`,
								alignSelf: "flex-end",

								marginLeft: "auto",
						  }),
				}}
			>
				<ReactMarkdown
					children={formattedContent}
					components={{
						em: ({ children }) => (
							<em
								style={{
									color: "#888888",
								}}
							>
								{children}
							</em>
						),
					}}
				/>
			</section>
		);
	});

	useEffect(() => {
		if (messageListRef.current) {
			messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div
			style={{
				height: isMobile ? "50vh" : "100%",
				position: isMobile ? "fixed" : "absolute",
				bottom: isMobile ? (inputMode == "audio" ? "120px" : "50px") : (inputMode === "audio" ? "175px": "80px" ),
				left: isMobile ? "50%" : "10px",
				transform: isMobile ? "translateX(-50%)" : "none",
				width: isMobile ? "95%" : "40%",
				maxWidth: "98%",
				margin: "0 auto",
				padding: "0px",
				marginTop: isMobile ? "0" : "20px",
				padding: "0px",

		
				color: "#FFF",
      

				transition: "all 0.3s ease-in-out",
			}}
		>
			<div
				ref={messageListRef}
				style={{
					maxHeight: "100%",
					overflowY: "auto",
					paddingRight: "10px",
					scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.3)",
				}}
			>
				{messageList}
			</div>
		</div>
	);
}

export default ChatLog;
