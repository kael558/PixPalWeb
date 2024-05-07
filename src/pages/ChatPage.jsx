import { useEffect, useState } from 'react';
import Scene from '../components/AnimatedSphere/Scene';
import Toolbar from '../components/toolbar/Toolbar';
import ChatInput from '../components/ChatInput';
import AuthenticationComponent from '../components/AuthComponent';
import TokensComponent from '../components/TokensComponent';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getAudioStreamFromTextInput, getAudioStreamFromAudioInput } from '../components/AudioPlayer/AudioPlayer';  // Adjust the import path as necessary
import { useAuth } from '../hooks/useAuth';

import { motion } from 'framer-motion';

const audioContext = new AudioContext({ sampleRate: 48000 });
let audioWorkletNode;

(async ()=>{
    await audioContext.audioWorklet.addModule('AudioStreamProcessor.js');
    audioWorkletNode = new AudioWorkletNode(audioContext, 'stream-audio-processor');

    audioWorkletNode.connect(audioContext.destination);
})();

function ChatPage(){
    const [messages, setMessages] = useState([]);  

    const [isLoginVisible, setLoginVisible] = useState(false);
    const [isTokensPanelVisible, setTokensPanelVisible] = useState(false);

    const { getAccessToken } = useAuth();

    const addAssistantMessage = (message) => {
        const new_messages = [...messages, { "role": "assistant", "content": message }];
        setMessages(new_messages);
    };
        
    
    const onMessageSend = async (message) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            toast.error('Please log in to send messages');
            return;
        }

        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const new_messages = [...messages, { "role": "user", "content": message }];

        setMessages(new_messages);
        getAudioStreamFromTextInput(new_messages, "Kael", accessToken, audioWorkletNode, addAssistantMessage);
    };

    const onAudioSend = async (chunks) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            toast.error('Please log in to send messages');
            return;
        }

        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const blob = new Blob(chunks, { type: "audio/webm" });

        getAudioStreamFromAudioInput(blob, messages, "Kael", accessToken, audioWorkletNode, addAssistantMessage);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'black' }}>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover={false}
                draggable
                theme='dark'
        
            />
            <Scene audioWorkletNode={audioWorkletNode}/>
            <Toolbar showLoginUI={() => setLoginVisible(true)} showTokensPanel={() => setTokensPanelVisible(true)}/>
            <ChatInput onSend={onMessageSend} onAudio={onAudioSend}/>
            <AuthenticationComponent isVisible={isLoginVisible} onClose={() => setLoginVisible(false)}/>
            <TokensComponent isVisible={isTokensPanelVisible} onClose={() => {
                console.log('Closing Tokens Panel');
                return setTokensPanelVisible(false)
            }}/>
        </div>
    )
}

export default ChatPage;