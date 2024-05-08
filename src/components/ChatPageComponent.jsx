import {  useState } from 'react';

import Toolbar from '../components/toolbar/Toolbar';
import ChatInput from '../components/ChatInput';
import AuthenticationComponent from '../components/AuthComponent';
import TokensComponent from '../components/TokensComponent';
import OnboardingComponent from '../components/OnboardingComponent';

import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getAudioStreamFromTextInput, getAudioStreamFromAudioInput } from '../components/AudioPlayer/AudioPlayer';  // Adjust the import path as necessary
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';





function ChatPageComponent({ audioWorkletNode }){
    const [messages, setMessages] = useLocalStorage('messages', []);
    const [name, setName] = useLocalStorage("name", "");


    const [isLoginVisible, setLoginVisible] = useState(false);
    const [isTokensPanelVisible, setTokensPanelVisible] = useState(false);
    const [isOnboardingVisible, setOnboardingVisible] = useState(name === "");


    const { getAccessToken } = useAuth();

    const addMessage = (role, content) => {
        setMessages(prevMessages => [...prevMessages, { role, content }]);
    };
      
    const onMessageSend = async (content) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            toast.error('Please log in to send messages');
            return;
        }

        setMessages(prevMessages => [...prevMessages, { role: "user", content }]);
        try {
            await getAudioStreamFromTextInput(messages, name, accessToken, audioWorkletNode, addMessage);
        } catch (error) {
            console.error(error);
            toast.error("There was an error with the server");
        }
    };

    const onAudioSend = async (chunks) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            toast.error('Please log in to send messages');
            return;
        }

        try{ 
            const blob = new Blob(chunks, { type: 'audio/webm' });
            await getAudioStreamFromAudioInput(blob, messages, name, accessToken, audioWorkletNode, addMessage);
        } catch (error){
            console.error(error);
            toast.error("There was an error with the server");
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Toolbar showLoginUI={() => setLoginVisible(true)} showTokensPanel={() => setTokensPanelVisible(true)}/>
            <ChatInput onSend={onMessageSend} onAudio={onAudioSend}/>
            <AuthenticationComponent isVisible={isLoginVisible} onClose={() => setLoginVisible(false)}/>
            <TokensComponent isVisible={isTokensPanelVisible} onClose={() => setTokensPanelVisible(false)}/>
            <OnboardingComponent isVisible={isOnboardingVisible} onClose={() => setOnboardingVisible(false)} audioWorkletNode={audioWorkletNode} name={name} setName={setName}  />
        </div>
    )
}

export default ChatPageComponent;