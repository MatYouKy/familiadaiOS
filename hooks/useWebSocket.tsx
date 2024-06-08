/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';

function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<any>(null);
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed' | 'error'>(
    'connecting'
  );

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      setStatus('open');
    };

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setMessage(parsedData); // Zamiast dodawać do tablicy, nadpisujemy poprzednią wiadomość
      } catch (error) {
        console.error('Error parsing received data:', error);
      }
    };

    ws.onclose = () => {
      setStatus('closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('error');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback(
    (message: any) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const messageString = JSON.stringify(message);
        socket.send(messageString);
      } else {
        console.error('WebSocket is not open. Ready state:', socket?.readyState);
      }
    },
    [socket]
  );

  return { message, sendMessage, status };
}

export default useWebSocket;
