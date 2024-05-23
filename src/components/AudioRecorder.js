
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

    async setup() {
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

        console.log("Media stream initialized", this.mediaStream);

    }

    async startRecording() {
        try {
            if (!this.mediaRecorder) {
                await this.setup();
            }

            //console.log("Starting media recorder...", this.mediaRecorder);
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
            const blob = this.mediaRecorder.getBlob();
            
            this.mediaRecorder.reset();
            if (blob.size > 100) {
                this.next(blob);
            }
        });
    }
}

export default VoiceInput;
