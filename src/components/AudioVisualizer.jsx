import React, { useRef, useEffect } from 'react';
import { useHue } from '@hooks/useHue';

function AudioVisualizer({ mediaStream, streamManager, isRecording }) {
    const canvasRef = useRef(null);

    const { hue, getRGBStr } = useHue();
    const rgbStr = getRGBStr();


    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const requestRef = useRef(null);
    const isRecordingRef = useRef(isRecording);
    const timeoutRef = useRef(null);
    const sourceNodeRef = useRef(null);

    useEffect(() => {
        let sourceNode = null;
    
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
                sourceNodeRef.current = streamManager.audioContext.createMediaStreamSource(await mediaStream);
                const analyser = streamManager.audioContext.createAnalyser();
    
                analyser.fftSize = 2048;
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
                analyserRef.current = analyser;
                dataArrayRef.current = dataArray;
    
                sourceNodeRef.current.connect(analyser);
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
    }, []);
    

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
                sourceNodeRef.current.disconnect();
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

     
            ctx.fillStyle = isRecording ? 'rgb(0, 0, 0, 1)' : 'rgb(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / dataArray.length) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
                barHeight = dataArray[i];

                //console.log(barHeight);

                // use rgbStr in fillStyle
                //ctx.fillStyle = `rgb(${rgbStr

                ctx.fillStyle = isRecording ? `rgb(${barHeight + 100}, 50, 50)` : `rgb(50, 50, ${(barHeight + 100)})`;
                ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

                x += barWidth + 1;
            }
        }
    };

    return <canvas ref={canvasRef} width="640" height="120" style={{ maxWidth: "100%", height: "auto" }}/>;
}

export default AudioVisualizer;
