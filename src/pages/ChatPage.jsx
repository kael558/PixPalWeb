import {  useState, useEffect, useRef } from 'react';
import Scene from '../components/AnimatedSphere/Scene';

import ChatPageComponent from '../components/ChatPageComponent';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const audioContext = new AudioContext({ sampleRate: 48000 });


function ChatPage(){
    const [audioWorkletNode, setAudioWorkletNode] = useState(null);
    const nodeRef = useRef(null); 

    useEffect(() => {
        const initAudioWorkletNode = async () => {
            try {
                await audioContext.audioWorklet.addModule('AudioStreamProcessor.js');
                const node = new AudioWorkletNode(audioContext, 'stream-audio-processor');
                node.connect(audioContext.destination);
                setAudioWorkletNode(node);
                nodeRef.current = node;
                console.log("Audio worklet node created");
            } catch (error) {
                console.error("Failed to load audio worklet module or create node:", error);
                toast.error("Audio output failed to load. Please refresh the page and try again.");
            }
        };

        initAudioWorkletNode();

        return () => {
            nodeRef.current?.disconnect();
        };
    }, []);

    if (!audioWorkletNode) {
        return <div>Loading audio components...</div>;
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
            <ChatPageComponent audioWorkletNode={audioWorkletNode}/>
        </div>
    )
}

export default ChatPage;