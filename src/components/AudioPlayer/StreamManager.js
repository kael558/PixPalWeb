const textDecoder = new TextDecoder("utf-8");
const textEncoder = new TextEncoder("utf-8");

class StreamManager {
    constructor() {
        this.audioContext = new AudioContext();
        this.abortController = new AbortController();
        this.gainNode = this.audioContext.createGain();

        this.previous = null;
    }

    async setupAudioWorkletNode() {
        await this.audioContext.audioWorklet.addModule('AudioStreamProcessor.js');
        this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'stream-audio-processor');
        this.audioWorkletNode.connect(this.gainNode).connect(this.audioContext.destination);

        this.audioWorkletNode.port.onmessage = (event) => {
            if (event.data.method === 'finishResponse') {
                console.log("Audio context has been suspended.");
                this.audioContext.suspend();
            }
        };

        return this.audioWorkletNode;
    }

    connectNode(node) {
        this.gainNode.connect(node);
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
    
        if (this.previous) {
            return new Response(this.previous.body, {
                headers: this.previous.headers,
                status: this.previous.status,
                statusText: this.previous.statusText
            });
        }
    
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
            }
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

        const float32Arrays = audioBuffer.getChannelData(0); // Assuming mono audio for simplicity
        const bufferSize = 1024; // Size of each chunk to send
        for (let i = 0; i < float32Arrays.length; i += bufferSize) {
            const end = Math.min(i + bufferSize, float32Arrays.length);
            const chunk = float32Arrays.slice(i, end);
            this.audioWorkletNode.port.postMessage({
                method: "buffer",
                args: { channelData: [chunk], sampleRate: audioBuffer.sampleRate },
            });
        }

        this.audioWorkletNode.port.postMessage({ method: "finishRequest", args: { id: 0} });
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

    async parseStream(voiceQuality, response, addMessage, showComponent, setScene, getUserMessage = false) {
        const reader = response.body.getReader();
        try {
            // Find delimiter as binary data
            const delimiter = textEncoder.encode('|||');
            let index = getUserMessage ? -1 : 0;
    
            let buffer = new Uint8Array();
            while (index < 2) {
                let { done, value } = await reader.read();
                if (done) {
                    this.audioWorkletNode.port.postMessage({ method: "finishRequest", args: { id: 0} });
                    return; // Exit if stream has ended
                }

                console.log("Value:", textDecoder.decode(value));

                // Combine the new value with any existing overflow
                let combinedBuffer = new Uint8Array(buffer.length + value.length);
                combinedBuffer.set(buffer);
                combinedBuffer.set(value, buffer.length);
    
                const delimiterIndex = this.findBinaryDelimiter(combinedBuffer, delimiter);

                if (delimiterIndex !== -1) {
                    const data = combinedBuffer.slice(0, delimiterIndex);
                    const overflow = combinedBuffer.slice(delimiterIndex + delimiter.length + 1);

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
            if (voiceQuality === "High") {
                await this.processLowQualityAudioAndText(reader, buffer, addMessage, setScene);
            } else {
                await this.processLowQualityAudioAndText(reader, buffer, addMessage, setScene);
            }
    

        } catch (error) {
            console.error('Stream processing error:', error);
            this.audioWorkletNode.port.postMessage({ method: "finishRequest", args: { id: 0} });
        } finally {
            reader.releaseLock();
        }
    }

    handleColorMessage(color) {
        console.log("Color message:", JSON.stringify(color));
        this.onmessage({ name: "change_color", data: { color } })
    }
    

    handleUserMessage(userMessage, addMessage) {
        console.log("User message:", JSON.stringify(userMessage));
        addMessage("user", userMessage);
    }

    handleComponents(componentList, showComponent) {
        console.log("Component list:", JSON.stringify(componentList));
        try {
            const components = JSON.parse(componentList);
            components.forEach(component => showComponent(component));
        } catch (error) {
            console.error("Error parsing component list:", error);
        }
    }

    handleAssistantMessage(assistantMessage, addMessage) {
        console.log("Assistant message:", JSON.stringify(assistantMessage));
        addMessage("assistant", assistantMessage);
    }

    handleSceneMessage(scene, setScene){
        console.log("Scene", scene);
        if (scene.length <= 7) return;
        setScene(scene);
    }

    /*async processHighQualityAudioAndText(reader, overflow, addMessage, setScene) {
        // resume audio context if it's in suspended state
        if (this.audioContext.state !== "running") {
            await this.audioContext.resume();
        }
    
        const delimiter = textEncoder.encode('|||');
    
        let buffer = overflow ? overflow : new Uint8Array();
    
        while (true) {
            let { done, value } = await reader.read();
            if (done) {
                console.log("Final chunk sent.");
                if (buffer.length > 0) {
                    console.log("Remaining buffer:", textDecoder.decode(buffer));
                }
                this.audioWorkletNode.port.postMessage({ method: "finishRequest", args: { id: 0 } });
                break;
            }
    
            buffer = new Uint8Array([...buffer, ...value]);
    
            const delimiterIndex = this.findBinaryDelimiter(buffer, delimiter);
    
            if (delimiterIndex !== -1) {
                const chunk = buffer.slice(0, delimiterIndex);
                buffer = buffer.slice(delimiterIndex + delimiter.length);
    
                const chunkStr = textDecoder.decode(chunk);
                try {
                    const chunkObj = JSON.parse(chunkStr);
    
                    if (chunkObj.audio_base64) {
                        // Process audio
                        const audioData = atob(chunkObj.audio_base64);
                        const audioArray = new Uint8Array(audioData.length);
                        for (let i = 0; i < audioData.length; i++) {
                            audioArray[i] = audioData.charCodeAt(i);
                        }
                        const [float32Array, _] = this.convertAndNormalizeToFloat32Array(audioArray);
                        if (float32Array) this.sendAudioChunk(float32Array);
    
                        // Process text and alignment
                        if (chunkObj.alignment) {
                            const text = chunkObj.alignment.characters.join('');
                            this.handleAssistantMessage(text, addMessage);
                            // You can also process the alignment data here if needed
                        }
                    } else if (chunkStr.startsWith("scene:")) {
                        // Handle scene message
                        this.handleSceneMessage(chunkStr.slice(6), setScene);
                    }
                } catch (error) {
                    console.log(chunkStr);
                    console.error("Error processing chunk:", error);
                }
            }
        }
    }*/

    async processLowQualityAudioAndText(reader, overflow, addMessage, setScene) {
        // resume audio context if it's in suspended state
        if (this.audioContext.state !== "running") {
            await this.audioContext.resume();
        }

        const delimiter = textEncoder.encode('|||');

        console.log("Audio processing has started. + Overflow:", overflow.length);

        let isText = true;

        let float32Array, _;
        while (true) {
            let { done, value } = await reader.read();
            if (done) {
                console.log("Final chunk sent.");
                //if (overflow) this.sendAudioChunk(overflow, true);
                if (overflow) console.log("Overflow:", textDecoder.decode(overflow));

                this.audioWorkletNode.port.postMessage({ method: "finishRequest", args: { id: 0} });
                break;
            }

            if (overflow) {
                value = new Uint8Array([...overflow, ...value]);
            }

            const delimiterIndex = this.findBinaryDelimiter(value, delimiter);

            if (isText){
                if (delimiterIndex !== -1) {
                    const data = value.slice(0, delimiterIndex);
                    overflow = value.slice(delimiterIndex + delimiter.length);
                    const text = textDecoder.decode(data);

                    if (text.startsWith("scene:")){ // last message after audio
                        this.handleSceneMessage(text.slice(6), setScene);
                    } else {
                        this.handleAssistantMessage(text, addMessage);
                    }

                    isText = false;
                }
            } else {
                if (delimiterIndex !== -1) {
                    const data = value.slice(0, delimiterIndex);
                    overflow = value.slice(delimiterIndex + delimiter.length);
                    [float32Array, _ ] = this.convertAndNormalizeToFloat32Array(data); // ignore overflow because it is switching to text
                    if (float32Array) this.sendAudioChunk(float32Array);
                    isText = true;
                } else {
                    [float32Array, overflow] = this.convertAndNormalizeToFloat32Array(value);
                    if (float32Array) this.sendAudioChunk(float32Array);
                }
            }  
        }
    }

    sendAudioChunk(float32Array) {
        this.audioWorkletNode.port.postMessage({
            method: "buffer",
            args: { channelData: [float32Array], sampleRate: 44100 },
        });
    }

    convertAndNormalizeToFloat32Array(value) {
        if (value.byteLength < 100) return [null, value];
        let bufferLength = value.byteLength;
        //let overflow = bufferLength % 2 !== 0 ? new Uint8Array([value[bufferLength - 1]]) : null;
        let overflow = null;
        if (bufferLength % 2 !== 0) {
            console.log("Overflow found");
            overflow = new Uint8Array([value[bufferLength - 1]]);
            value = value.subarray(0, bufferLength - 1);
        }

        let int16Array = new Int16Array(value.buffer, 0, value.byteLength / Int16Array.BYTES_PER_ELEMENT);
        let float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
        }
        return [float32Array, overflow];
    }

    stop() {
        this.abortController.abort();
        this.audioWorkletNode.port.postMessage({ method: 'clear' });
        console.log("Audio processing has been stopped and cleared.");
    }
}

export default StreamManager;
