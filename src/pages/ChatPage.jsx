import { useEffect, useState } from 'react';
import Scene from '../components/AnimatedSphere/Scene';
import Toolbar from '../components/toolbar/Toolbar';
import ChatInput from '../components/ChatInput';
import AuthenticationComponent from '../components/AuthComponent';
import TokensComponent from '../components/TokensComponent';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getAudioStreamFromTextInput } from '../components/AudioPlayer/AudioPlayer';  // Adjust the import path as necessary
import { useAuth } from '../hooks/useAuth';

import { motion } from 'framer-motion';

function ChatPage(){
    const [audioContext, setAudioContext] = useState(null);
    const [audioWorkletNode, setAudioWorkletNode] = useState(null); 
    const [messages, setMessages] = useState([]);  

    const [isLoginVisible, setLoginVisible] = useState(false);
    const [isTokensPanelVisible, setTokensPanelVisible] = useState(false);

    const { getAccessToken } = useAuth();



    useEffect(() => {
        // Initialize audio context only once
        const ac = new AudioContext({ sampleRate: 48000 });
        setAudioContext(ac);

        return () => {
            if (ac.state !== 'closed') {
                ac.close(); // Clean up audio context on component unmount
            }
        };
    }, []);

    useEffect(() => {
        if (!audioContext) return;

        const setupAudio = async () => {
            try {
                await audioContext.audioWorklet.addModule('AudioStreamProcessor.js');

                // Only resume if the context is suspended (e.g., after initial setup)
           

                const node = new AudioWorkletNode(audioContext, 'stream-audio-processor');
                node.connect(audioContext.destination);

        
                setAudioWorkletNode(node);
            } catch (error) {
                console.error('Error setting up audio worklet:', error);
            }
        };

        setupAudio();

        return () => {
            if (audioWorkletNode) {
                audioWorkletNode.disconnect(); // Disconnect on cleanup
            }
        };
    }, [audioContext]);  // Depend on audioContext

    const addAssistantMessage = (message) => {
        const new_messages = [...messages, { "role": "assistant", "content": message }];
        setMessages(new_messages);
    };
        
    
    const onMessageSend = async (message) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return;
        }

        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const new_messages = [...messages, { "role": "user", "content": message }];

        setMessages(new_messages);
        getAudioStreamFromTextInput(new_messages, "Kael", accessToken, audioWorkletNode, addAssistantMessage);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'black' }}>
            <ToastContainer/>
            <Scene audioWorkletNode={audioWorkletNode}/>
            <Toolbar showLoginUI={() => setLoginVisible(true)} showTokensPanel={() => setTokensPanelVisible(true)}/>
            <ChatInput onSend={onMessageSend} messages={messages}  audioWorkletNode={audioWorkletNode} addAssistantMessage={addAssistantMessage}/>
            <AuthenticationComponent isVisible={isLoginVisible} onClose={() => setLoginVisible(false)}/>
            <TokensComponent isVisible={isTokensPanelVisible} onClose={() => {
                console.log('Closing Tokens Panel');
                return setTokensPanelVisible(false)
            }}/>
        </div>
    )
}

export default ChatPage;