import ChatInput from "./ChatInput";
import ChatLog from "./ChatLog";

function Chat({ name, messages, characterName, isMobile, onSend, onAudio, streamManager, inputMode, setIsRecording, isRecording, showChatLog, borderAnimation }) {
    return (
        <div>
           
            <ChatInput
					onSend={onSend}
					onAudio={onAudio}
					streamManager={streamManager}
					inputMode={inputMode}
					setIsRecording={setIsRecording}
					isRecording={isRecording}
					isMobile={isMobile}
					borderAnimation={borderAnimation}

				/>
				 {showChatLog && 
            <ChatLog name={name} characterName={characterName} messages={messages} isMobile={isMobile} inputMode={inputMode}/>
}
        </div>
    );
}

export default Chat;
