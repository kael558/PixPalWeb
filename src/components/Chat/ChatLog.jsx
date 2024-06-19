import { useEffect, useRef } from "react";
import { useHue } from "@hooks/useHue";
import ReactMarkdown from "react-markdown";
import { renderers } from "react-markdown";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ChatLog({ name, characterName, messages, isMobile, inputMode }) {
	const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();
	const messageListRef = useRef(null);

	const messageList = messages.map((message, i) => {
		const formattedContent = message.content
			.replace(/[^ \n-~]/g, "")
			.replace(/\(/g, "*")
			.replace(/\)/g, "*")
			.replace(/\n+/g, "\n");


			const arrowStyle = {
				color: `rgba(${rgbStr}, 0.7)`,
				margin: "0px 10px",
				fontWeight: "bold",
				alignSelf: "center",
				fontSize: "20px",
				
			};
			const arrow = message.role === "assistant" ? ">" : "<";

		return (
			<section
				key={i}
				style={{
					...{
						marginBottom: "10px",
						padding: "2px 10px",

						borderRadius: "20px",

						fontFamily: "Menlo, monospace",
						fontSize: "12px",
						letterSpacing: "0.05em",
						maxWidth: "69%",
						width: "fit-content",

						display: "flex",

						background: `rgba(0,0,0, 0.5)`,
						border: `1px solid rgba(${rgbStr}, 0.1)`, // Light white border
			
					},
					...(message.role === "assistant"
						? {
								alignSelf: "flex-start",
								flexDirection: "row",
		
						  }
						: {
								flexDirection: "row-reverse",
								alignSelf: "flex-end",

								marginLeft: "auto",
						  }),
				}}
			>

	

					<span style={arrowStyle}>{arrow}</span>

			
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
				height: isMobile ? "50vh" : (inputMode === "audio" ? "80%": "80%" ),
				position: isMobile ? "fixed" : "absolute",
				top: isMobile ? "" : "0px",
				bottom: isMobile ? (inputMode == "audio" ? "100px" : "100px") : (inputMode === "audio" ? "175px": "175px" ),
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
