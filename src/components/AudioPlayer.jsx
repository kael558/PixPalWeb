import { useEffect, useState } from 'react';
import nodeFetch from 'node-fetch';
import PCMPlayer from 'pcm-player'

async function get_stream1(message, username){
    const response = await nodeFetch('https://lg5m7pmkstz3ims7qkmh7u4xfi0gjebf.lambda-url.us-east-1.on.aws/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, username })
    });

    return response;



}




async function get_stream2(){
    const response = await fetch('https://eastus.tts.speech.microsoft.com/cognitiveservices/v1', {
        method: 'POST',
        headers: {
            "X-Microsoft-OutputFormat": "raw-44100hz-16bit-mono-pcm",
            "Content-Type": "application/ssml+xml",
            "Ocp-Apim-Subscription-Key": "f45d4df30f924181920b8168abd05e03",
            "User-Agent": "TextToSpeechKael"
        },
        body: "<speak xmlns=\"http://www.w3.org/2001/10/synthesis\" xmlns:mstts=\"http://www.w3.org/2001/mstts\" xmlns:emo=\"http://www.w3.org/2009/10/emotionml\" version=\"1.0\" xml:lang=\"en-US\"><voice name=\"en-US-AvaMultilingualNeural\"><mstts:viseme type=\"FacialExpression\"/><mstts:express-as style=\"Default\"><prosody rate=\"0%\" pitch=\"0%\"><lang xml:lang=\"en-US\">Hey there!</lang></prosody></mstts:express-as></voice></speak>"
    });

    return response;
}

async function getAudioStream(message, username) {
    const response = await get_stream2();
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const reader = response.body.getReader();
    const sampleRate = 44100; // As defined by your X-Microsoft-OutputFormat header

    let queue = [];


    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }
        // Push received chunk into the queue
        queue.push(new Int16Array(value));

        while (queue.length > 0) {
            const buffer = queue.shift();
            const frameCount = buffer.length;
            const myArrayBuffer = audioCtx.createBuffer(1, frameCount, sampleRate);
            const nowBuffering = myArrayBuffer.getChannelData(0);

            // Normalize the audio to the range -1.0 -> 1.0
            for (let i = 0; i < frameCount; i++) {
                nowBuffering[i] = buffer[i] / 32768.0;
            }

            // Create a buffer source
            const source = audioCtx.createBufferSource();
            source.buffer = myArrayBuffer;
            source.connect(audioCtx.destination);
            source.start();
        }
    }
}

/*
async function getAudioStream(message, username) {
    const response = await get_stream2();
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const sampleRate = 44100; // As defined by your X-Microsoft-OutputFormat header
    const frameCount = arrayBuffer.byteLength / 2; // 2 bytes per sample for 16-bit audio

    // Create an audio buffer
    const myArrayBuffer = audioCtx.createBuffer(1, frameCount, sampleRate);

    // Fill the audio buffer
    const nowBuffering = myArrayBuffer.getChannelData(0);
    const view = new Int16Array(arrayBuffer); // View the array buffer as 16-bit samples
    for (let i = 0; i < frameCount; i++) {
        // Normalize the audio to the range -1.0 -> 1.0
        nowBuffering[i] = view[i] / 32768.0;
    }

    // Create a buffer source
    const source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.start();
}


/*

async function getAudioStream(message, username) {
    const response = await get_stream2();
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const text = await response.text();
    console.log('Text:', text);

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var channels = 1;

    var frameCount = audioCtx.sampleRate * 2.0; // 2 seconds

    var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);
    for (var channel = 0; channel < channels; channel++) {
        var nowBuffering = myArrayBuffer.getChannelData(channel);
        for (var i = 0; i < frameCount; i++) {
            var word = (text.charCodeAt(i * 2) & 0xff) + ((text.charCodeAt(i * 2 + 1) & 0xff) << 8);
			nowBuffering[i] = ((word + 32768) % 65536 - 32768) / 32768.0;
        }
    }


    var source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.start();



    /*
    const reader = response.body.getReader();

    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }
        if (value) {
            console.log('Value:', value);
            var data = new Int16Array(value.buffer);
            player.feed(data);
        }
    }

    player.destroy();
    
}
    */



export default getAudioStream;

/*
const AudioPlayer = ({ username }) => {
    const [audioContext, setAudioContext] = useState(null);

    useEffect(() => {
        // Initialize AudioContext
        const context = new AudioContext();
        setAudioContext(context);

        const processAudio = async (audioData) => {
            // Decode the incoming audio data
            const buffer = await context.decodeAudioData(audioData);
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start();
        };

        const receiveAudio = () => {
            const eventSource = new EventSource(`https://your-streaming-url/${username}`);
            eventSource.onmessage = function(event) {
                const audioData = new Uint8Array(event.data);
                processAudio(audioData.buffer);
            };
        };

        receiveAudio();

        return () => {
            context.close();
        };
    }, [username]);

    return <div>Playing Audio...</div>;
};

export default AudioPlayer;*/
