import { useEffect, useState } from 'react';
import nodeFetch from 'node-fetch';
import PCMPlayer from 'pcm-player';

import axios from 'axios';
import { Writable } from 'stream';

function arrayBufferToStream(buffer) {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(new Uint8Array(buffer));
            controller.close();
        }
    });
}

async function get_stream1(message, username, accessToken){
    return 



    /*return nodeFetch('https://lg5m7pmkstz3ims7qkmh7u4xfi0gjebf.lambda-url.us-east-1.on.aws/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({ message, username })
    });*/
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

/*async function getAudioStream(message, username) {
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
}*/

/*
async function getAudioStream(message, username, accessToken) {
    const response = await get_stream2(message, username, accessToken);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Load the AudioWorkletProcessor
    await audioCtx.audioWorklet.addModule('audio-processor.js');

    // Create an AudioWorkletNode
    const audioNode = new AudioWorkletNode(audioCtx, 'audio-stream-processor');

    // Convert ArrayBuffer to AudioBuffer
    const sampleRate = 44100; // Same sample rate
    const frameCount = arrayBuffer.byteLength / 2;
    const audioBuffer = audioCtx.createBuffer(1, frameCount, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    const view = new Int16Array(arrayBuffer);
    for (let i = 0; i < frameCount; i++) {
        channelData[i] = view[i] / 32768.0;
    }

    // Use the buffer source to send audio to the worklet
    const bufferSource = audioCtx.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(audioNode);
    bufferSource.start();

    // Connect the worklet to the context's destination
    audioNode.connect(audioCtx.destination);
}*/

class PCMStream extends WritableStream {
    constructor(audioWorkletNode) {
        super({
            start(controller) {
                // Initialization can go here if necessary.
            },
            write(chunk, controller) {
                try {
                    const buffer = chunk.buffer; // Assuming chunk is an object with a buffer property that is a Float32Array
                    const sampleRate = 48000; // Set the sample rate as appropriate.

                    audioWorkletNode.port.postMessage({
                        method: 'buffer',
                        args: {
                            channelData: [buffer], // Assuming mono. For stereo, you would split the channels accordingly.
                            sampleRate,
                        },
                    });
                } catch (error) {
                    controller.error(error); // Properly signal errors
                }
            },
            close(controller) {
                // This method should properly signal that the stream has finished.

                controller.close(); // Signal that the stream is done
            },
            abort(reason) {
                console.error('Stream aborted:', reason);
                audioWorkletNode.port.postMessage({ method: 'clear' });
            }
        });
    }
}

async function ensureAudioContextState(audioContext) {
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }
}

/*
const microphoneWorkletUrl = new URL('./microphone-worklet.js', import.meta.url).href
const wsInjectWorkletUrl = new URL('./ws-inject-worklet.js', import.meta.url).href
const wsInputWorkletUrl = new URL('./ws-input-worklet.js', import.meta.url).href
const wsOutputWorkletUrl = new URL('./ws-output-worklet.js', import.meta.url).href
export const loadWorkletModules = async audioContext => {
  const audioWorkletPromises = [
    audioContext.audioWorklet.addModule(microphoneWorkletUrl),
    audioContext.audioWorklet.addModule(wsInjectWorkletUrl),
    audioContext.audioWorklet.addModule(wsInputWorkletUrl),
    audioContext.audioWorklet.addModule(wsOutputWorkletUrl),
  ];
  
  await Promise.all(audioWorkletPromises);
};

//

export class AudioManager {
  constructor({audioContext}) {
    this.audioContext = audioContext;
    this.audioContext.gain = this.audioContext.createGain();
    this.audioContext.gain.connect(this.audioContext.destination);
    
    this.loadPromise = loadWorkletModules(this.audioContext);
  }

  setVolume(volume) {
    this.audioContext.gain.gain.value = volume;
  }

  playBuffer(audioBuffer) {
    const sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(this.audioContext.destination);
    sourceNode.start();
  }

  async enumerateDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices;
  }

  async getUserMedia(opts) {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(opts);
      return mediaStream;
    } catch (error) {
      // Check for specific error conditions
      if (error.name === 'NotAllowedError') {
        console.log('User denied access to media devices.');
        return new Error('User denied access to media devices.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        console.log('No media devices found.');
        return new Error('No media devices found.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        console.log('The media track could not be read or started.');
        return new Error('The media track could not be read or started.');
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        console.log('The requested media constraints could not be satisfied.');
        return new Error('The requested media constraints could not be satisfied.');
      } else if (error.name === 'SecurityError' || error.name === 'PermissionDeniedError') {
        console.log('Permission to access media devices was denied.');
        return new Error('Permission to access media devices was denied.');
      } else {
        console.log('An error occurred while accessing media devices:', error);
        return new Error('An error occurred while accessing media devices');
      }
    }
  }

  async waitForLoad() {
    await this.loadPromise;
  }
}
// export default new AudioManager();*/


const monoProcessorURL = new URL('./AudioMonoProcessor.js', import.meta.url).href

async function getAudioStream(message, username, accessToken) {
    try {
        const response = await axios.post('https://lg5m7pmkstz3ims7qkmh7u4xfi0gjebf.lambda-url.us-east-1.on.aws/', {
            user_message: 'hey there!', username: 'kael'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            responseType: 'blob'
        }); 
        

        const audioContext = new AudioContext();

        await audioContext.resume();

        await audioContext.audioWorklet.addModule(monoProcessorURL); 

        const audioWorkletNode = new AudioWorkletNode(audioContext, 'mono-processor', { outputChannelCount: [1] });
        audioWorkletNode.connect(audioContext.destination);
        audioWorkletNode.port.onmessage = (event) => {
            console.log(event.data);  // Log messages from the worklet
        };
        
        const reader = response.data.stream().getReader();
        reader.read().then(function process({ done, value }) {
            if (done) {
                console.log('Stream complete');
                audioWorkletNode.port.postMessage({ method: 'end' });
                return;
            }

            // Assuming 'value' is an ArrayBuffer containing raw PCM data
            console.log('Value:', value);
            audioWorkletNode.port.postMessage({ method: 'buffer', args: { channelData: [value.buffer], sampleRate: 48000 }});
            return reader.read().then(process);
        });
    } catch (err) {
        console.error('Error setting up audio stream:', err.message);
    }
}


    /*



    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    // Read the full arrayBuffer from the response
    const arrayBuffer = await response.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (!audioCtx) {
        console.error('AudioContext not supported');
        return;
    }

    // Decode the audio data
    audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
        // Create a buffer source
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
    }, function(e) {
        console.log('Error decoding audio data: ' + e.err);
    });*/



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
