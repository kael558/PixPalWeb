function makePromise() {
	let resolve, reject;
	const p = new Promise((a, r) => {
		resolve = a;
		reject = r;
	});
	p.resolve = resolve;
	p.reject = reject;
	return p;
}

function makeId(length) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

export class CustomAudioWorkletNode extends AudioWorkletNode {
    constructor(audioContext) {
        super(audioContext, "mono-processor", { outputChannelCount: [1] }); // assume mono
        this.cbs = new Map();
        this.port.onmessage = this.handleMessage.bind(this);
    }

    handleMessage(event) {
        const { method, args } = event.data;
        if (method === "finishResponse") {
            const cb = this.cbs.get(args.id);
            if (!cb) {
                throw new Error(`No callback registered for ID: ${args.id}`);
            }
            this.cbs.delete(args.id);
            cb.resolve(event.data);
        } else {
            console.warn("Unexpected message from audio worker:", event.data);
        }
    }

    waitForFinish() {
        const { promise, resolve } = makePromise();
        const id = makeId(8);
        this.cbs.set(id, { resolve });
        this.port.postMessage({
            method: "finishRequest",
            args: { id }
        });
        return promise;
    }
}
