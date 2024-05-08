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

	const audioContext = audioWorkletNode.context;

	if (audioContext.state !== 'running') {
		console.log("Resuming audio context");
		await audioContext.resume();
	}

	while (true) {
		let { done, value } = await reader.read();
		if (done) {
			// send overflow if there is any
			if (overflow) {
				[float32Array, overflow] = convertAndNormalizeToFloat32Array(overflow);
				if (float32Array){
					audioWorkletNode.port.postMessage({
						method: "buffer",
						args: { channelData: [float32Array], sampleRate: 48000 },
					});
				}
			}
			audioWorkletNode.port.postMessage({ method: "end" });
			break; // Stream finished
		}

		//console.log("Received chunk of size", value.byteLength);

		if (overflow) {
			let combinedValue = new Uint8Array(overflow.length + value.byteLength);
			combinedValue.set(overflow); // Set overflow at the beginning
			combinedValue.set(value, overflow.length); // Set new value after the overflow
			value = combinedValue;
		}

		[float32Array, overflow] = convertAndNormalizeToFloat32Array(value);
		if (float32Array){
			audioWorkletNode.port.postMessage({
				method: "buffer",
				args: { channelData: [float32Array], sampleRate: 48000 },
			});
		}
	}
}

function convertAndNormalizeToFloat32Array(value) {
	let bufferLength = value.byteLength;

	if (bufferLength < 100){ // ignore small chunks
		return [null, value];
	}

	let overflow = null;

	if (bufferLength % 2 !== 0) {
		// remove last byte
		overflow = new Uint8Array([value[bufferLength - 1]]);
		value = value.subarray(0, bufferLength - 1);
	}

	let int16Array = new Int16Array(
		value.buffer,
		0,
		value.byteLength / Int16Array.BYTES_PER_ELEMENT
	);
	
	const float32Array = new Float32Array(int16Array.length);
	for (let i = 0; i < int16Array.length; i++) {
		float32Array[i] = int16Array[i] / 32768.0; // Normalize PCM data to [-1, 1] range
	}
	return [float32Array, overflow];
}

async function getAudioStreamFromAudioInput(
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
  fd.append("messages", JSON.stringify(messages.slice(-5)));
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


async function getAudioStreamFromTextInput(
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


async function playAudioFromFilePath(audioFilePath, audioWorkletNode) {
    const audioContext = audioWorkletNode.context;

	if (audioContext.state !== 'running') {
		console.log("Resuming audio context");
		await audioContext.resume();
	}
	

    // Fetch the audio file from the provided path
    const response = await fetch(audioFilePath);
    if (!response.ok) {
        throw new Error(`Failed to load audio file: ${response.statusText}`);
    }

    // Convert the response to an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Decode the audio data from the ArrayBuffer
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
	console.log("Audio buffer decoded", audioBuffer.sampleRate, audioBuffer.length);

    // Process and send the decoded audio data to the AudioWorkletNode
    const float32Arrays = audioBuffer.getChannelData(0); // Assuming mono audio for simplicity
    const bufferSize = 1024; // Size of each chunk to send
    for (let i = 0; i < float32Arrays.length; i += bufferSize) {
        const end = Math.min(i + bufferSize, float32Arrays.length);
        const chunk = float32Arrays.slice(i, end);
        audioWorkletNode.port.postMessage({
			method: "buffer",
			args: { channelData: [chunk], sampleRate: audioBuffer.sampleRate },
		});
    }


	audioWorkletNode.port.postMessage({ method: "end" });

    console.log("All audio data sent to AudioWorkletNode");
}

// Ensure you have added the audio processor script and instantiated the AudioWorkletNode appropriately
// Example:
// const audioContext = new AudioContext();
// await audioContext.audioWorklet.addModule('path/to/your/audio-processor.js');
// const audioWorkletNode = new AudioWorkletNode(audioContext, 'playback-processor');
// PlayAudioFromFilePath('path/to/your/audiofile.wav', audioWorkletNode).catch(console.error);


export { getAudioStreamFromTextInput, getAudioStreamFromAudioInput, playAudioFromFilePath};