import ChatInput from "./ChatInput";
import ChatLog from "./ChatLog";

function Chat({ name, messages, characterName, isMobile, onSend, onAudio, streamManager, inputMode, setIsRecording, isRecording, showChatLog }) {
    return (
        <div>
            {showChatLog && 
            <ChatLog name={name} characterName={characterName} messages={messages} isMobile={isMobile} inputMode={inputMode}/>
}
            <ChatInput
					onSend={onSend}
					onAudio={onAudio}
					streamManager={streamManager}
					inputMode={inputMode}
					setIsRecording={setIsRecording}
					isRecording={isRecording}
					isMobile={isMobile}
				/>
        </div>
    );
}

export default Chat;
