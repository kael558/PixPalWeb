/*async function get_stream2() {
	const response = await fetch(
		"https://eastus.tts.speech.microsoft.com/cognitiveservices/v1",
		{
			method: "POST",
			headers: {
				"X-Microsoft-OutputFormat": "raw-44100hz-16bit-mono-pcm",
				"Content-Type": "application/ssml+xml",
				"Ocp-Apim-Subscription-Key": "f45d4df30f924181920b8168abd05e03",
				"User-Agent": "TextToSpeechKael",
			},
			body: '<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="en-US-AvaMultilingualNeural"><mstts:viseme type="FacialExpression"/><mstts:express-as style="Default"><prosody rate="0%" pitch="0%"><lang xml:lang="en-US">Hey there!</lang></prosody></mstts:express-as></voice></speak>',
		}
	);

	return response;
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

//const streamProcessor = new URL('./AudioStreamProcessor.js', import.meta.url).href

const textDecoder = new TextDecoder("utf-8");

async function parseStream(response, audioWorkletNode, addMessage, getUserMessage=false) {
	const reader = response.body.getReader();

	if (getUserMessage){
		const { done: initialDone, value: initialValue } = await reader.read();
		if (initialDone) {
			throw new Error("Stream ended prematurely");
		}

		const userMessage = textDecoder.decode(initialValue);

		addMessage('user', userMessage);
	}

	const { done: initialDone, value: initialValue } = await reader.read();
	if (initialDone) {
		throw new Error("Stream ended prematurely");
	}

	// Assuming the text is short and comes in a single chunk
	const assistantMessage = textDecoder.decode(initialValue);
	console.log("Initial message from server:", assistantMessage);

	addMessage('assistant', assistantMessage);

	let overflow = null;
	let float32Array = null;

	while (true) {
		let { done, value } = await reader.read();
		if (done) {
			audioWorkletNode.port.postMessage({ method: "end" });
			break; // Stream finished
		}

		if (overflow) {
			let combinedValue = new Uint8Array(overflow.length + value.byteLength);
			combinedValue.set(overflow); // Set overflow at the beginning
			combinedValue.set(value, overflow.length); // Set new value after the overflow

			value = combinedValue;
		}

		[float32Array, overflow] = convertAndNormalizeToFloat32Array(value);

		audioWorkletNode.port.postMessage({
			method: "buffer",
			args: { channelData: [float32Array], sampleRate: 48000 },
		});
	}
}

export async function getAudioStreamFromAudioInput(
  blob,
  messages,
  username,
  accessToken,
  audioWorkletNode,
  addMessage
) {
  if (!audioWorkletNode) {
    throw new Error("AudioWorkletNode is not initialized");
  }

  const fd = new FormData();
  fd.append("messages", JSON.stringify(messages));
  fd.append("username", username);
  fd.append("file", blob, "speech.webm");

  const response = await fetch("https://jfjrhqljjddvfemmcwbtn6fvmi0wndeu.lambda-url.us-east-1.on.aws/",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      body: fd
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  await parseStream(response, audioWorkletNode, addMessage, true); 
}


export async function getAudioStreamFromTextInput(
	messages,
	username,
	accessToken,
	audioWorkletNode,
	addMessage
) {
	if (!audioWorkletNode) {
		throw new Error("AudioWorkletNode is not initialized");
	}

	const response = await fetch(
		"https://lg5m7pmkstz3ims7qkmh7u4xfi0gjebf.lambda-url.us-east-1.on.aws/",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + accessToken,
			},
			body: JSON.stringify({
				messages,
				username,
			}),
		}
	);

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

  await parseStream(response, audioWorkletNode, addMessage);
}


function convertAndNormalizeToFloat32Array(value) {
	let bufferLength = value.byteLength;

	let overflow = null;

	if (bufferLength % 2 !== 0) {
		// remove last byte
		overflow = new Uint8Array([value[bufferLength - 1]]);
		value = value.subarray(0, bufferLength - 1);
	}

	let int16Array;
	try {
		int16Array = new Int16Array(
			value.buffer,
			value.byteOffset,
			value.byteLength / Int16Array.BYTES_PER_ELEMENT
		);
	} catch (error) {
		console.error("Error converting to Int16Array:", error);
		console.log("Value:", value);
		int16Array = new Int16Array(
			value.buffer,
			value.byteOffset,
			value.byteLength / Int16Array.BYTES_PER_ELEMENT
		);
	}

	const float32Array = new Float32Array(int16Array.length);
	for (let i = 0; i < int16Array.length; i++) {
		float32Array[i] = int16Array[i] / 32768.0; // Normalize PCM data to [-1, 1] range
	}
	return [float32Array, overflow];
}


