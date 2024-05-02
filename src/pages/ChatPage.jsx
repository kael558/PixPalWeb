import { useEffect, useState } from 'react';
import Scene from '../components/AnimatedSphere/Scene';
import Toolbar from '../components/toolbar/Toolbar';
import ChatInput from '../components/ChatInput';

import getAudioStream from '../components/AudioPlayer/AudioPlayer';  // Adjust the import path as necessary
import { useAuth } from '../hooks/useAuth';


function ChatPage(){
    const [audioContext, setAudioContext] = useState(null);
    const [audioWorkletNode, setAudioWorkletNode] = useState(null); 

    const { get_access_token } = useAuth();


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
        
    
    const handleButtonClick = async (message="Hello, how are you?") => {
        const accessToken = await get_access_token();
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        getAudioStream(message, "Kael", accessToken, audioWorkletNode);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'black' }}>
            <Scene audioWorkletNode={audioWorkletNode}/>
            <Toolbar/>
            <ChatInput onSend={handleButtonClick}/>
        </div>
    )
}

export default ChatPage;