import React, { useRef, useEffect } from 'react';

function AudioVisualizer({ mediaStream, streamManager, isRecording, inputMode }) {
    const canvasRef = useRef(null);

    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const requestRef = useRef(null);
    const isRecordingRef = useRef(isRecording);
    const timeoutRef = useRef(null);
    const sourceNodeRef = useRef(null);

    useEffect(() => {
        async function setupAudio() {
            try {
                // Disconnect existing connections if they exist
                if (sourceNodeRef.current) {
                    sourceNodeRef.current.disconnect();
                }
                if (analyserRef.current) {
                    analyserRef.current.disconnect();
                }

                // Setup new audio connections
                const analyser = streamManager.audioContext.createAnalyser();
    
                analyser.fftSize = 2048;
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
                analyserRef.current = analyser;
                dataArrayRef.current = dataArray;

                if (mediaStream && inputMode === 'audio') {
                    sourceNodeRef.current = await streamManager.audioContext.createMediaStreamSource(await mediaStream);
                    sourceNodeRef.current.connect(analyser);
                } else {
                    sourceNodeRef.current = null;
                }
    
                streamManager.connectNode(analyser);
    
                draw();
            } catch (error) {
                console.error('Error accessing the microphone:', error);
            }
        }
    
        function handleVisibilityChange() {
            if (document.visibilityState === 'visible') {
                setupAudio();
            } else {
                cancelAnimationFrame(requestRef.current);
                if (sourceNodeRef.current) {
                    sourceNodeRef.current.disconnect();
                }
                if (analyserRef.current) {
                    analyserRef.current.disconnect();
                }
            }
        }
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
    
        // Initial setup when the component mounts
        setupAudio();
    
        return () => {
            cancelAnimationFrame(requestRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (sourceNodeRef.current) {
                sourceNodeRef.current.disconnect();
            }
            if (analyserRef.current) {
                analyserRef.current.disconnect();
            }
        };
    }, [inputMode]);
    

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (isRecording){
            isRecordingRef.current = isRecording;
            sourceNodeRef.current.connect(analyserRef.current);
        } else {
            timeoutRef.current = setTimeout(() => { // allows decay to be same color as recording
                isRecordingRef.current = isRecording;
                if (sourceNodeRef.current) sourceNodeRef.current.disconnect();
            }, 600);  
        }
    }, [isRecording]);


    const draw = () => {
        requestRef.current = requestAnimationFrame(draw);
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;
        const isRecording = isRecordingRef.current;

        if (canvas && analyser && dataArray) {
            const ctx = canvas.getContext('2d');

            //console.log(streamManager.audioContext.state);

            if (streamManager.audioContext.state === 'running') {
                analyser.getByteFrequencyData(dataArray);
            } else {
                for (let i = 0; i < dataArray.length; i++) {
                    dataArray[i] *= 0.95; // Decay factor, adjust as needed for smoother decay
                }
            }

            //console.log(JSON.stringify(dataArray));

     
            ctx.globalCompositeOperation = 'destination-out';
            ctx.globalAlpha = 0.1; // Adjust this value to control the fade speed
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Reset for drawing new bars
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;

            const barWidth = (canvas.width / dataArray.length) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
                barHeight = dataArray[i];
                ctx.fillStyle = isRecording ? `rgb(${barHeight + 100}, 50, 50, 0.8)` : `rgb(50, 50, ${(barHeight + 100)}, 0.8)`;
                ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

                x += barWidth + 1;
            }
        }
    };

    return <canvas ref={canvasRef} width="640" height="140" style={{ 
        maxWidth: "100%", 
        height: "auto",
        alignSelf: "center",
     }}/>;
}

export default AudioVisualizer;
