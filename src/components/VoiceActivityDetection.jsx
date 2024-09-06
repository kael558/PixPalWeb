import React, { useEffect, useState } from 'react';
import { MicVAD } from '@ricky0123/vad';

const VoiceActivityDetection = () => {
  const [vad, setVad] = useState(null);

  useEffect(() => {
    const initializeVAD = async () => {
      try {
        const myvad = await MicVAD.new({
          onSpeechStart: () => console.log('Speech started'),
          onSpeechEnd: (audio) => console.log('Speech ended', audio),
          // Add more callbacks as needed
        });
        setVad(myvad);
      } catch (error) {
        console.error('Error initializing VAD:', error);
      }
    };

    initializeVAD();

    return () => {
      if (vad) {
        vad.pause();
      }
    };
  }, []);

  const handleStart = () => {
    if (vad) {
      vad.start();
    }
  };

  const handleStop = () => {
    if (vad) {
      vad.pause();
    }
  };

  return (
    <div>
      <h2>Voice Activity Detection</h2>
      <button onClick={handleStart}>Start VAD</button>
      <button onClick={handleStop}>Stop VAD</button>
    </div>
  );
};

export default VoiceActivityDetection;