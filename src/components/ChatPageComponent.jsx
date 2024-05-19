import {  useState, useEffect } from 'react';

import Toolbar from '../components/toolbar/Toolbar';
import ChatInput from '../components/ChatInput';
import AuthenticationComponent from '../components/AuthComponent';
import TokensComponent from '../components/TokensComponent';
import OnboardingComponent from '../components/OnboardingComponent';
import PrivacyPolicyComponent from '../components/PrivacyPolicyComponent';
import ReleaseNotesComponent from './ReleaseNotesComponent';
import StartComponent from './StartComponent';

import { CURRENT_VERSION } from "../Constants";

import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';


function ChatPageComponent({ streamManager }){
    const [messages, setMessages] = useLocalStorage('messages', []);
    const [name, setName] = useLocalStorage("name", "");
    const [version, setVersion] = useLocalStorage("appVersion", "0.0.0");
    const [isPrivacyPolicyAccepted, setPrivacyPolicyAccepted] = useLocalStorage("privacyPolicyAccepted", false);

    const [userMood, setUserMood] = useState("");
    const [role, setRole] = useState("");


    const [isLoginVisible, setLoginVisible] = useState(false);
    const [isTokensPanelVisible, setTokensPanelVisible] = useState(false);
    const [isOnboardingVisible, setOnboardingVisible] = useState(name === "");
    const [isPrivacyPolicyVisible, setPrivacyPolicyVisible] = useState(!isPrivacyPolicyAccepted);
    const [isReleaseNotesVisible, setReleaseNotesVisible] = useState(version !== CURRENT_VERSION);
    const [isStartVisible, setStartVisible] = useState(true);

    const { getAccessToken } = useAuth();




    const showComponent = (component) => {
        switch (component) {
            case "Token Shop":
                setTokensPanelVisible(true);
                break;
            case "Privacy Policy":
                setPrivacyPolicyVisible(true);
                break;
            default:
                break;
        }
    }


    const acceptPrivacyPolicy = () => {
        setPrivacyPolicyAccepted(true);
        setPrivacyPolicyVisible(false);
    }

    const acceptNewVersion = () => {
        setVersion(CURRENT_VERSION);
        setReleaseNotesVisible(false);
    }

    const addMessage = (role, content) => {
        if (content === "") return;
        setMessages(prevMessages => [...prevMessages, { role, content }]);
    };
      
    const onMessageSend = async (content) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            toast.error('Please log in to send messages');
            return;
        }

        const updatedMessages = [...messages, { role: "user", content }];
        setMessages(updatedMessages);
        
        try {
            const url = "https://lg5m7pmkstz3ims7qkmh7u4xfi0gjebf.lambda-url.us-east-1.on.aws/";
            const options ={
                method: "POST",
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: updatedMessages.slice(-5),
                    username: name,
                    role: role
                }),
            }

            const response = await streamManager.fetchData(url, options);
            await streamManager.parseStream(response, addMessage, showComponent);
        } catch (error) {
            console.error(error);
            const message = error.message || "There was an error with the server";
            toast.error(message);
        }
    };

    const onAudioSend = async (blob) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            toast.error('Please log in to send messages');
            return;
        }

        try{ 
            //const blob = new Blob(chunks, { type: 'audio/webm' });

            const fd = new FormData();
            fd.append("messages", JSON.stringify(messages.slice(-5)));
            fd.append("username", name);
            fd.append("file", blob, "speech.webm");

            const url = "https://jfjrhqljjddvfemmcwbtn6fvmi0wndeu.lambda-url.us-east-1.on.aws/";
            const options = {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
                body: fd,
            }

            const response = await streamManager.fetchData(url, options);
            await streamManager.parseStream(response, addMessage, showComponent, true);
            //await getAudioStreamFromAudioInput(blob, messages, name, accessToken, audioWorkletNode, addMessage, showComponent, abortController);
        } catch (error){
            console.error(error);
            const message = error.message || "There was an error with the server";
            toast.error(message);
        }
    }

    useEffect(() => {
        if (!userMood) return;
        onMessageSend("I'm feeling " + userMood);
    }, [userMood]);

    useEffect(() => {
        if (!role) return;
        onMessageSend("I want you to be my " + role);
        setStartVisible(false);
    }, [role]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Toolbar showLoginUI={() => setLoginVisible(true)} showTokensPanel={() => setTokensPanelVisible(true)} streamManager={streamManager} setMessages={setMessages} />
            <ChatInput onSend={onMessageSend} onAudio={onAudioSend} streamManager={streamManager}/>
            <AuthenticationComponent isVisible={isLoginVisible} onClose={() => setLoginVisible(false)}/>
            <TokensComponent isVisible={isTokensPanelVisible} onClose={() => setTokensPanelVisible(false)}/>

            <StartComponent isVisible={isStartVisible}userMood={userMood} setUserMood={setUserMood} setRole={setRole}/>
            <PrivacyPolicyComponent isVisible={isPrivacyPolicyVisible} onClose={acceptPrivacyPolicy}/>
            <ReleaseNotesComponent isVisible={isReleaseNotesVisible} onClose={acceptNewVersion} version={version}/>
            <OnboardingComponent isVisible={isOnboardingVisible} onClose={() => setOnboardingVisible(false)} streamManager={streamManager} name={name} setName={setName}  />
        </div>
    )
}

export default ChatPageComponent;