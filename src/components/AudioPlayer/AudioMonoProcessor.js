class MonoProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const outputChannel = output[0];

        this.port.onmessage = (event) => {
            if (event.data.method === 'buffer') {
                const inputBuffer = new Int16Array(event.data.args.channelData[0]);
                const float32Buffer = new Float32Array(inputBuffer.length);

                // Convert 16-bit PCM to float32
                for (let i = 0; i < inputBuffer.length; i++) {
                    float32Buffer[i] = inputBuffer[i] / 32768;
                }

                // Assuming the output buffer size matches or is handled accordingly
                if (outputChannel.length >= float32Buffer.length) {
                    outputChannel.set(float32Buffer);
                }
            }
        };

        return true;
    }
}

registerProcessor('mono-processor', MonoProcessor);
