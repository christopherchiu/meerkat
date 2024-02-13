'use client'

import React, { useState, useEffect, useContext } from 'react';
import WebSocketContext from './webSocketContext';

export default function Keywords() {
  const [keywords, setKeywords] = useState('');

  const socket = useContext(WebSocketContext);

  useEffect(() => {
    socket.emit('keywords', keywords);
  }, [keywords]);

  return (
    <div>
      <label className="block font-medium mb-2">Resume keywords (for better transcription)</label>
      <textarea
        className="mt-1 text-sm h-50 block w-full p-3 border rounded-md"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="Meta, chrome, teamwork, etc."
      />
    </div>
  );
}
