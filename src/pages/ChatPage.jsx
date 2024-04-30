import React from 'react';
import AnimatedSphere from '../components/AnimatedSphere';
import Toolbar from '../components/toolbar/Toolbar';
import ChatInput from '../components/ChatInput';

import getAudioStream from '../components/AudioPlayer';  // Adjust the import path as necessary


/*
 const audioElement = document.getElementById('audioPlayer');
        const mediaSource = new MediaSource();
        audioElement.src = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener('sourceopen', sourceOpen, false);

        async function sourceOpen(_) {
            const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
            const response = await fetch('http://localhost:3000/stream');
            const reader = response.body.getReader();
            const boundary = response.headers.get('Content-Type').split('boundary=')[1].trim();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        if (buffer) {
                            processChunk(buffer, sourceBuffer);
                        }
                        mediaSource.endOfStream();
                        break;
                    }

                    buffer += decoder.decode(value, { stream: true });

                    const parts = buffer.split(`--${boundary}`);
                    buffer = parts.pop(); // Save the last incomplete part in buffer

                    for (let part of parts) {
                        part = part.trim();
                        if (!part) continue;
                        processChunk(part, sourceBuffer);
                    }
                }
            } catch (error) {
                console.error('Streaming failed', error);
                mediaSource.endOfStream();
            }
        }

        function processChunk(part, sourceBuffer) {
            const [headers, body] = part.split('\r\n\r\n');
            const headerLines = headers.split('\r\n');
            const contentTypeLine = headerLines.find(h => h.toLowerCase().startsWith('content-type:'));
            const contentType = contentTypeLine.split(':')[1].trim();

            if (contentType.includes('audio')) {
                const audioData = body.split('').map(char => char.charCodeAt(0));
                const audioBuffer = new Uint8Array(audioData);
                sourceBuffer.appendBuffer(audioBuffer);
            } else if (contentType.includes('text')) {
                console.log('Received text:', body.trim());
            }
        }
        */




function ChatPage(){
    const handleButtonClick = (message="Hello, how are you?") => {
        getAudioStream(message, "Kael")
            .catch(error => {
                console.error('Error playing audio:', error);
            });
    };

    return (
        <>
            
            <AnimatedSphere/>
            <Toolbar/>
            <ChatInput onSend={handleButtonClick}/>
        </>
    )
}

export default ChatPage;