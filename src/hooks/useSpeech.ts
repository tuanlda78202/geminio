import { useState } from 'react';
import axios from 'axios';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = async (content: string): Promise<void> => {
    try {
      setIsSpeaking(true);

      const response = await axios.post('http://localhost:3001/api/tts',
        { text: content },
        { responseType: 'arraybuffer' }
      );

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(response.data);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);

      source.onended = () => {
        setIsSpeaking(false);
      };
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      setIsSpeaking(false);
    }
  };

  return { speak, isSpeaking };
};