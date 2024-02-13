import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { Socket } from 'socket.io';

export default async function transcribe(clientSocket: Socket): Promise<void> {

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY || "");

  const connection = deepgram.listen.live({
    model: "nova-2",
    language: "en-US",
    smart_format: true
  });

  // STEP 3: Listen for events from the live transcription connection
  connection.on(LiveTranscriptionEvents.Open, () => {
    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log("Connection closed.");
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      clientSocket.emit('transcription', data.channel.alternatives[0].transcript);
    });

    connection.on(LiveTranscriptionEvents.Metadata, (data) => {
      console.log(data);
    });

    connection.on(LiveTranscriptionEvents.Error, (err) => {
      console.error(err);
    });

    clientSocket.on('audio', (audio: Blob) => {
      connection.send(audio);
    });
  });
}