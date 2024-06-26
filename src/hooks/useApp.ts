import { useEffect, useRef, useState } from "react";
import annyang, { Commands } from "annyang";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { makeGeminiRequest } from "./useGemini";
import { useSpeech } from "./useSpeech";

interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

const useApp = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { speak, isSpeaking } = useSpeech();

  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [response, setResponse] = useState("");
  const [base64Frames, setBase64Frames] = useState<
    { mimeType: string; data: string }[]
  >([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  let frameInterval: NodeJS.Timeout;

  const handleListing = () => {
    SpeechRecognition.startListening({
      continuous: false,
      language: 'vi-VN'
    });
  };

  const stopHandle = () => {
    SpeechRecognition.stopListening();
  };

  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

  const runApp = () => {
    annyang.abort();
    handleReset();
    setIsLoading(true);
    setResponse("");
    setBase64Frames([]);
    handleListing();
    frameInterval = setInterval(() => {
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(
            videoRef.current,
            0,
            0,
            canvas.width,
            canvas.height
          );
          const base64Frame = canvas.toDataURL("image/jpeg");
          let [mimeType, data] = base64Frame.split(";base64,");
          mimeType = mimeType.split(":")[1];
          setBase64Frames((prevFrames) => [...prevFrames, { mimeType, data }]);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    if (!listening) {
      annyang.start();
      stopHandle();
      clearInterval(frameInterval);

      setConversationHistory(prev => [...prev, { role: 'user', content: transcript }]);

      makeGeminiRequest(
        transcript,
        base64Frames,
        setResponse,
        speak,
        setIsLoading,
        conversationHistory
      );
      SpeechRecognition.stopListening();
    }
  }, [listening]);

  useEffect(() => {
    if (response) {
      setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
    }
  }, [response]);

  useEffect(() => {
    if (!isSpeaking && autoMode) {
      runApp();
    }
  }, [isSpeaking]);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    initializeCamera();

    const commands: Commands = {
      "Xin chào Gemini": () => {
        runApp();
      },
      "Xin chào": () => {
        runApp();
      },
      "Bắt đầu": () => {
        runApp();
      },
    };

    if (autoMode) {
      runApp();
    } else {
      annyang.addCommands(commands);
      annyang.start();
    }

    return () => {
      annyang.abort();
      stopHandle();
      clearInterval(frameInterval);
    };
  }, [autoMode]);

  return {
    videoRef,
    isLoading,
    listening,
    response,
    base64Frames,
    autoMode,
    setAutoMode,
    setIsFrontCamera,
    isFrontCamera,
    conversationHistory,
  };
};

export default useApp;