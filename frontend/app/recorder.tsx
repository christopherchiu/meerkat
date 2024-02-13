'use client'

import { useRef, useContext, useEffect, useState } from 'react';
import WebSocketContext from './webSocketContext';


export default function Recorder() {
  const isRecordingRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [transcription, setTranscription] = useState<string>('');

  const socket = useContext(WebSocketContext);

  socket.on('transcription', (transcriptionPiece: string) => {
    setTranscription(transcription + transcriptionPiece);
  });

  useEffect(() => {
    // Request access to the microphone
    async function getMicrophoneAccess() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && isRecordingRef.current) {
          console.log(`Emitting audio: ${event.data.size}`);
          socket.emit('audio', event.data.size);
        }
      };
    }

    getMicrophoneAccess().catch(console.error);
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start(500);
      isRecordingRef.current = true;
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
      <div>{transcription}</div>
    </div>
  );
};