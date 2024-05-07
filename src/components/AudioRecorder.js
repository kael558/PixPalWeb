

class VoiceInput {
	constructor(next) {
		this.abortController = new AbortController();
		this.mediaStream = null;
		this.mediaRecorder = null;
		this.chunks = [];
		this.transcription = "";
		this.next = next;
	}

	async startRecording() {
		try {
			this.mediaStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			this.mediaRecorder = new MediaRecorder(this.mediaStream, {
				mimeType: "audio/webm",
			});

			this.mediaRecorder.onerror = (event) => {
				console.error("MediaRecorder error:", event.error);
			};

			this.mediaRecorder.onstart = (event) => {
				console.log("Recording started");
			};

			this.mediaRecorder.ondataavailable = (event) => {
				if (event.data && event.data.size > 0) {
					this.chunks.push(event.data);
				}
			};

			this.mediaRecorder.onstop = async (event) => {
				console.log("Recording stopped");
				await this.next(this.chunks);
				this.chunks = [];
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
		this.mediaStream.getTracks().forEach((track) => track.stop());
	}
}

export default VoiceInput;
