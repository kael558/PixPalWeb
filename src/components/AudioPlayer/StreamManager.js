const textDecoder = new TextDecoder("utf-8");
const textEncoder = new TextEncoder("utf-8");

class StreamManager {
	constructor() {
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
			latencyHint: "interactive",
		});
		this.abortController = new AbortController();
		this.gainNode = this.audioContext.createGain();

		this.sourceNodes = [];
	}

	connectNode(node) {
		//this.gainNode.connect(node);
	}

	setVolume(volume) {
		this.gainNode.gain.value = volume;
	}

	getVolume() {
		return this.gainNode.gain.value;
	}

	setMuted(isMuted) {
		this.gainNode.gain.value = isMuted ? 0 : 1;
	}

	isMuted() {
		return this.gainNode.gain.value === 0;
	}

	async fetchData(url, options = {}) {
		if (this.abortController.signal.aborted) {
			this.abortController = new AbortController();
		}

		/*if (this.previous) {
			console.log("Returning previous response.");
			return new Response(this.previous.body, {
				headers: this.previous.headers,
				status: this.previous.status,
				statusText: this.previous.statusText,
			});
		}*/

		options.signal = this.abortController.signal;
		const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(`Network response was not ok: ${response.statusText}`);
		}

		return response;
		/*const cachedStream = await this.cacheStream(response.body);
    
        this.previous = new Response(cachedStream, {
            headers: response.headers,
            status: response.status,
            statusText: response.statusText
        });
    
        return this.previous.clone();*/
	}
	async cacheStream(readableStream) {
		const chunks = [];
		const reader = readableStream.getReader();

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
		}

		return new ReadableStream({
			start(controller) {
				for (const chunk of chunks) {
					controller.enqueue(chunk);
				}
				controller.close();
			},
		});
	}

	async playAudioFile(audioFilePath) {
		console.log("Playing audio file:", audioFilePath);
		const response = await this.fetchData(audioFilePath);
		const arrayBuffer = await response.arrayBuffer();
		if (this.audioContext.state !== "running") {
			await this.audioContext.resume();
		}

		const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

		// create sourceNode
		const sourceNode = this.audioContext.createBufferSource();
		sourceNode.buffer = audioBuffer;
		sourceNode.connect(this.audioContext.destination);
		sourceNode.start();

		this.sourceNodes.push(sourceNode);
	}

	async parseStream(
		voiceQuality,
		response,
		addMessage,
		showComponent,
		setScene,
		getUserMessage = false
	) {
		const reader = response.body.getReader();
		try {
			// Find delimiter as binary data
			const delimiter = textEncoder.encode("|||");
			let index = getUserMessage ? -1 : 0;

			let buffer = new Uint8Array();
			while (index < 2) {
				let { done, value } = await reader.read();
				if (done) {
					return; // Exit if stream has ended
				}

				// Combine the new value with any existing overflow
				let combinedBuffer = new Uint8Array(buffer.length + value.length);
				combinedBuffer.set(buffer);
				combinedBuffer.set(value, buffer.length);

				const delimiterIndex = this.findBinaryDelimiter(
					combinedBuffer,
					delimiter
				);

				if (delimiterIndex !== -1) {
					const data = combinedBuffer.slice(0, delimiterIndex);
					const overflow = combinedBuffer.slice(
						delimiterIndex + delimiter.length + 1
					);

					if (index === -1) {
						this.handleUserMessage(textDecoder.decode(data), addMessage);
					} else if (index === 0) {
						this.handleComponents(textDecoder.decode(data), showComponent);
					} else if (index === 1) {
						this.handleColorMessage(textDecoder.decode(data));
					}

					buffer = overflow;
					index++;
				} else {
					buffer = combinedBuffer;
				}
			}

			//console.log("Remaining data for audio processing:", buffer);
			await this.processAudioAndText(reader, buffer, addMessage, setScene);
		} catch (error) {
			console.error("Stream processing error:", error);
		} finally {
			reader.releaseLock();
		}
	}

	handleColorMessage(color) {
		console.log("Color message:", JSON.stringify(color));
		this.onmessage({ name: "change_color", data: { color } });
	}

	handleUserMessage(userMessage, addMessage) {
		console.log("User message:", JSON.stringify(userMessage));
		addMessage("user", userMessage);
	}

	handleComponents(componentList, showComponent) {
		console.log("Component list:", JSON.stringify(componentList));
		try {
			const components = JSON.parse(componentList);
			components.forEach((component) => showComponent(component));
		} catch (error) {
			console.error("Error parsing component list:", error);
		}
	}

	handleAssistantMessage(assistantMessage, addMessage) {
		console.log("Assistant message:", JSON.stringify(assistantMessage));
		addMessage("assistant", assistantMessage);
	}

	handleSceneMessage(scene, setScene) {
		console.log("Scene", scene);
		if (scene.length <= 7) return;
		setScene(scene);
	}



	async processChunk({ done, value }, audioFormat) {
		try {
			if (done || !value) {
				return;
			}
	
			let decodeAudioData;
			let overflow = null;
	
			if (audioFormat === "mp3") {
				decodeAudioData = await this.decodeMp3(value);
			} else {
				[decodeAudioData, overflow] = this.decodePcm(value);
			}

			if (this.nextStartTime === undefined) {
				this.nextStartTime = this.audioContext.currentTime;
			}

			// append to buffer queue
			const sourceNode = this.audioContext.createBufferSource();
			sourceNode.buffer = decodeAudioData;
			sourceNode.connect(this.audioContext.destination);
			sourceNode.start(this.nextStartTime);

			this.sourceNodes.push(sourceNode);

			this.nextStartTime += decodeAudioData.duration;
			return overflow;
		} catch (error) {
			console.error("Error processing audio chunk:", error);
			return null;
		}
	}

	async processAudioAndText(reader, overflow, addMessage, setScene) {
		if (this.audioContext.state !== "running") {
			await this.audioContext.resume();
		}

		const delimiter = new TextEncoder().encode("|||");
		console.log("Audio processing has started. Overflow:", overflow.length);

		let isText = true;
		let audioFormat = null;

		this.nextStartTime = undefined;
		this.sourceNodes = [];

		while (true) {
			try {
				let { done, value } = await reader.read();
				if (done) {
					value = new Uint8Array();
					console.log("Final chunk sent.");
				}

				if (overflow) {
					value = new Uint8Array([...overflow, ...value]);
					overflow = null;
				}

				const delimiterIndex = this.findBinaryDelimiter(value, delimiter);

				if (isText) {
					if (delimiterIndex !== -1) {
						const data = value.slice(0, delimiterIndex);
						overflow = value.slice(delimiterIndex + delimiter.length);
						const text = new TextDecoder().decode(data);

						if (text.startsWith("scene:")) {
							this.handleSceneMessage(text.slice(6), setScene);
						} else {
							this.handleAssistantMessage(text, addMessage);
						}

						isText = false;
					}
				} else {
					if (audioFormat === null) {
						audioFormat = this.detectAudioFormat(value);
					}

					if (delimiterIndex !== -1) {
						const data = value.slice(0, delimiterIndex);
						overflow = value.slice(delimiterIndex + delimiter.length);

						await this.processChunk( // Don't care about overflow here
							{ done, data },
							audioFormat
						);
						

						isText = true;
					} else {
						// There may be overflow in PCM audio data
						overflow = await this.processChunk(
							{ done, value },
							audioFormat
						);
					}
				}

				if (done) {
					break;
				}
			} catch (error) {
				console.error("Error processing audio and text:", error);
				break;
			}
		}
	}

	findBinaryDelimiter(buffer, delimiter) {
		// Convert buffer to Uint8Array if it's not already one.
		if (!(buffer instanceof Uint8Array)) {
			buffer = new Uint8Array(buffer);
		}

		// Check every possible position in the buffer where the delimiter could start.
		for (let i = 0; i <= buffer.length - delimiter.length; i++) {
			let match = true;
			for (let j = 0; j < delimiter.length; j++) {
				if (buffer[i + j] !== delimiter[j]) {
					match = false;
					break;
				}
			}
			if (match) return i;
		}
		return -1; // Return -1 if no delimiter is found.
	}

	detectAudioFormat(chunk) {
		return chunk[0] === 0xff && chunk[1] === 0xfb ? "mp3" : "pcm";
	}

	async decodeMp3(chunk) {
		const arrayBuffer = chunk.buffer.slice(
			chunk.byteOffset,
			chunk.byteOffset + chunk.byteLength
		);
		return await this.audioContext.decodeAudioData(arrayBuffer);
	}

	decodePcm(chunk) {
		// Determine the number of full 16-bit samples
		const sampleCount = Math.floor(chunk.byteLength / 2);

		// Create an Int16Array from the chunk buffer
		const int16Array = new Int16Array(
			chunk.buffer,
			chunk.byteOffset,
			sampleCount
		);

		// Create an audio buffer from the 16-bit samples
		const audioBuffer = this.audioContext.createBuffer(
			1,
			int16Array.length,
			48000
		);

		// Fill the audio buffer with normalized sample data
		const channelData = audioBuffer.getChannelData(0);
		for (let i = 0; i < int16Array.length; i++) {
			channelData[i] = int16Array[i] / 32768.0;
		}

		// Check for an overflow byte and handle it
		let overflow = null;
		if (chunk.byteLength % 2 === 1) {
			overflow = new Uint8Array(
				chunk.buffer,
				chunk.byteOffset + 2 * sampleCount,
				1
			);
		}

		// Return both the audio buffer and any overflow
		return [audioBuffer, overflow];
	}

	stop() {
		this.abortController.abort();
		this.sourceNodes.forEach((sourceNode) => sourceNode.stop(this.audioContext.currentTime + 0.1));
		this.sourceNodes = [];
		console.log("Audio processing has been stopped and cleared.");
	}
}

export default StreamManager;
