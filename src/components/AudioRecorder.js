

class VoiceInput {
	constructor() {
		this.abortController = new AbortController();
		this.mediaStream = null;
		this.mediaRecorder = null;
		this.chunks = [];
		this.transcription = "";
	}

	async startRecording() {
		if (!this.mediaRecorder) {
			this.mediaStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			this.mediaRecorder = new MediaRecorder(this.mediaStream, {
				mimeType: "audio/webm",
			});
			this.mediaRecorder.ondataavailable = (event) => {
				if (event.data && event.data.size > 0) {
					this.chunks.push(event.data);
				}
			};
			this.mediaRecorder.onstop = async (event) => {
				await this.transcribe();
			};
		} else {
            this.mediaRecorder.start();
        }
	}

	stopRecording() {
		this.mediaRecorder.stop();
		this.mediaStream.getTracks().forEach((track) => track.stop());
        return this.chunks;
	}
}

export default VoiceInput;
