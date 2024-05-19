
//https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs
import RecordRTC from "recordrtc";
const browserIsSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

class VoiceInput {
    constructor(next) {
        this.mediaStream = null;
        this.mediaRecorder = null;
        //this.chunks = [];
        this.next = next; // Callback function to handle the recorded audio blob
    }

    getUserMedia = async (constraints) => {
        if (window.navigator.mediaDevices) {
            return window.navigator.mediaDevices.getUserMedia(constraints);
        }
        let legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (legacyApi) {
            return new Promise(function (resolve, reject) {
                legacyApi.bind(window.navigator)(constraints, resolve, reject);
            });
        } else {
            // user api not supported
            console.error("getUserMedia is not supported in this browser");
        }
    };

    async initMediaStream() {
        const userMedia = await this.getUserMedia({ audio: true });
        if (!userMedia) {
            console.error("getUserMedia is not supported in this browser");
            throw new Error("Browser does not support getUserMedia");
        }

        this.mediaStream = userMedia;
        this.mediaRecorder = new RecordRTC(this.mediaStream, {
            type: "audio",
            mimeType: "audio/webm",
            sampleRate: 48000,
            desiredSampRate: 16000,
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            timeSlice: 1000
        });

        /*this.mediaRecorder = new MediaRecorder(this.mediaStream, {
            mimeType: "audio/webm", 
        });

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

        this.mediaRecorder.onerror = event => {
            console.error("MediaRecorder error:", event.error);
        };

        this.mediaRecorder.ondataavailable = event => {
            if (event.data && event.data.size > 0) {
                this.chunks.push(event.data);
            }
        };*/
    }

    async startRecording() {
        try {
            if (!this.mediaRecorder) {
                await this.initMediaStream();
            }

            console.log("Starting media recorder...", this.mediaRecorder);
            this.mediaRecorder.startRecording();
        } catch (error) {
            console.error("Failed to start recording:", error);
        }
    }

    async stopRecording() {
        if (!this.mediaRecorder) {
            console.error("No media recorder found");
            return;
        }
        this.mediaRecorder.stopRecording(() => {
            this.next(this.mediaRecorder.getBlob());
        });
        
        //this.mediaStream.getTracks().forEach(track => track.stop());
        //this.mediaRecorder = null; // Optionally reset the mediaRecorder if not reusing
    }
}

export default VoiceInput;
