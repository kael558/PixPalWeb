const textDecoder = new TextDecoder("utf-8");

class StreamManager {
    constructor() {
        this.audioContext = new AudioContext({ sampleRate: 48000 });
        this.abortController = new AbortController();
        this.gainNode = this.audioContext.createGain();
    }

    async setupAudioWorkletNode() {
        await this.audioContext.audioWorklet.addModule('AudioStreamProcessor.js');
        this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'stream-audio-processor');
        this.audioWorkletNode.connect(this.gainNode).connect(this.audioContext.destination);
        return this.audioWorkletNode;
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

        options.signal = this.abortController.signal;
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response;
    }

    async playAudioFile(audioFilePath) {
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

        this.audioWorkletNode.port.postMessage({ method: "end" });
    }




    async parseStream(response, addMessage, showComponent, getUserMessage = false) {
        const reader = response.body.getReader();
        try {
            if (getUserMessage) {
                await this.handleUserMessage(reader, addMessage);
            }

            await this.handleComponents(reader, showComponent);
            await this.handleAssistantMessage(reader, addMessage);
            await this.processAudio(reader);
        } catch (error) {
            console.error('Stream processing error:', error);
        } finally {
            reader.releaseLock();
        }
    }

    async handleUserMessage(reader, addMessage) {
        const { value: userMessageValue, done: userMessageDone } = await reader.read();
        if (userMessageDone) throw new Error("Stream ended prematurely");
        const userMessage = textDecoder.decode(userMessageValue);
        addMessage("user", userMessage);
    }

    async handleComponents(reader, showComponent) {
        const { value: componentList, done: componentDone } = await reader.read();
        if (componentDone) throw new Error("Stream ended prematurely");
        const components = JSON.parse(textDecoder.decode(componentList));
        components.forEach(component => showComponent(component));
    }

    async handleAssistantMessage(reader, addMessage) {
        const { value: assistantMessageValue, done: assistantMessageDone } = await reader.read();
        if (assistantMessageDone) throw new Error("Stream ended prematurely");
        const assistantMessage = textDecoder.decode(assistantMessageValue);
        addMessage("assistant", assistantMessage);
    }

    async processAudio(reader) {
        // resume audio context if it's in suspended state
        if (this.audioContext.state !== "running") {
            await this.audioContext.resume();
        }

        let overflow;
        let float32Array;

        while (true) {
            let { done, value } = await reader.read();
            if (done) {
                if (overflow) this.sendAudioChunk(overflow, true);
                this.audioWorkletNode.port.postMessage({ method: "end" });
                break;
            }

            if (overflow) {
                value = new Uint8Array([...overflow, ...value]);
            }

            [float32Array, overflow] = this.convertAndNormalizeToFloat32Array(value);
            if (float32Array) this.sendAudioChunk(float32Array);
        }
    }

    sendAudioChunk(float32Array, isFinal = false) {
        this.audioWorkletNode.port.postMessage({
            method: "buffer",
            args: { channelData: [float32Array], sampleRate: 48000 },
        });
        if (isFinal) console.log("Final audio chunk sent.");
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
