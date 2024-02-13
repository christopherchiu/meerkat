import http from 'http';
import { Server } from 'socket.io';
import { summarize } from './lib/processor'
import fs from 'fs/promises';
import express, { Request, Response } from 'express';
import transcribe from './lib/transcription';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001"
  }
});

let keywordsStorage: {[key: string]: string[]} = {};

io.on('connection', async (socket) => {
  socket.on('keywords', (keywordsString: string) => {
    console.log(`Received keywords: ${keywordsString}`);
    keywordsStorage[socket.handshake.address] = keywordsString.split(',');
  }); 

  transcribe(socket);

  socket.on('audio', (audio: Blob) => {
    console.log(`Received audio: ${audio}`);
  });
}); 

app.get('/', async (req: Request, res: Response) => {
  const transcript = await fs.readFile('./sample.txt');

  const summary = await summarize(transcript.toString())
  res.send(summary);
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});
