/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from 'react';
import { IWebSocketMessage } from '../types/game.type';

function useWebSocket(url: string) {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<IWebSocketMessage['payload'] | null>(null);
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed' | 'error'>(
    'connecting'
  );
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    socketRef.current = ws;
    // setSocket(ws);

    ws.onopen = () => {
      setStatus('open');
      ws.send(JSON.stringify({ type: 'connect', payload: 'tablet' }));
    };

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setMessage(parsedData);
      } catch (error) {
        console.error('Error parsing received data:', error);
      }
    };

    ws.onclose = () => {
      setStatus('closed');
    };

    ws.onerror = () => {
      setStatus('error');
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageString = JSON.stringify(message);
      ws.send(messageString);
    }
  }, []);

  return { message, sendMessage, status };
}

export default useWebSocket;
