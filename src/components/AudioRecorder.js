
//https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs
class VoiceInput {
    constructor(next) {
        this.mediaStream = null;
        this.mediaRecorder = null;
        this.chunks = [];
        this.next = next; // Callback function to handle the recorded audio blob
    }

    async initMediaStream() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("getUserMedia is not supported in this browser");
            throw new Error("Browser does not support getUserMedia");
        }
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        this.mediaRecorder = new MediaRecorder(this.mediaStream, {
            mimeType: "audio/webm", 
        });

        this.mediaRecorder.onerror = event => {
            console.error("MediaRecorder error:", event.error);
        };

        this.mediaRecorder.ondataavailable = event => {
            if (event.data && event.data.size > 0) {
                this.chunks.push(event.data);
            }
        };
    }

    async startRecording() {
        try {
            if (!this.mediaRecorder) {
                await this.initMediaStream();
            }

            this.mediaRecorder.onstart = () => {
                console.log("Recording started");
            };

            this.mediaRecorder.onstop = async () => {
                if (this.chunks.length === 0) {
                    console.error("No data recorded");
                    return;
                }

                await this.next(this.chunks);
                this.chunks = []; // Clear the data chunks array after processing
            };

            console.log("Starting media recorder...", this.mediaRecorder);
            this.mediaRecorder.start();
        } catch (error) {
            console.error("Failed to start recording:", error);
        }
    }

    stopRecording() {
        if (!this.mediaRecorder) {
            console.error("No media recorder found");
            return;
        }
        this.mediaRecorder.stop();
        //this.mediaStream.getTracks().forEach(track => track.stop());
        //this.mediaRecorder = null; // Optionally reset the mediaRecorder if not reusing
    }
}

export default VoiceInput;
