/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch } from '@__store/hooks';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';
import { IConnect, IWebSocketMessage } from '@__types/game.type';
import { useCallback, useEffect, useRef, useState } from 'react';

function useWebSocket(url: string) {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<IWebSocketMessage['payload'] | null>(null);
  const [status, setStatus] = useState<IConnect['status']>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectInterval = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = useCallback(() => {
    // Sprawdzamy, czy istnieje aktywne połączenie WebSocket
    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN ||
        socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      console.log('WebSocket is already connected or connecting.');
      return;
    }

    console.log('Connecting to WebSocket at:', url);

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected.');
      setStatus('success');

      // Czyścimy interwał ponownego połączenia, jeśli połączenie się powiedzie
      if (reconnectInterval.current) {
        clearTimeout(reconnectInterval.current);
        reconnectInterval.current = null;
        console.log('Reconnect interval cleared.');
      }

      dispatch(
        snackbarActionFunc({
          status: 'SUCCESS',
          message: 'Uzyskano połączenie z Tablicą',
        })
      );
      ws.send(JSON.stringify({ type: 'connect', payload: 'admin' }));
    };

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setMessage(parsedData);
      } catch (error) {
        dispatch(
          snackbarActionFunc({
            status: 'ERROR',
            message: `Błąd przesyłania danych do tablicy. Error: ${error}`,
          })
        );
      }
    };

    ws.onclose = () => {
      console.log('WebSocket closed.');
      setStatus(null);
      dispatch(
        snackbarActionFunc({
          status: 'ERROR',
          message: 'Połączenie z Tablicą zostało zamknięte',
        })
      );
      attemptReconnect();
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('error');
      dispatch(
        snackbarActionFunc({
          status: 'ERROR',
          message: `Błąd połączenia z tablicą! Error: ${error}`,
        })
      );
      attemptReconnect();
    };
  }, [url, dispatch]);

  const attemptReconnect = useCallback(() => {
    // Sprawdzamy, czy już istnieje interwał próby ponownego połączenia
    if (!reconnectInterval.current) {
      reconnectInterval.current = setTimeout(() => {
        console.log('Reconnecting...');
        connectWebSocket();
      }, 5000); // Spróbuj połączyć ponownie po 5 sekundach
    } else {
      console.log('Reconnect attempt is already scheduled.');
    }
  }, [connectWebSocket]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      // Czyścimy interwał próby ponownego połączenia
      if (reconnectInterval.current) {
        clearTimeout(reconnectInterval.current);
        reconnectInterval.current = null;
      }
      // Zamykamy połączenie WebSocket, jeśli istnieje
      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING)
      ) {
        console.log('Closing WebSocket connection.');
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback(
    (message: any) => {
      const ws = socketRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        const messageString = JSON.stringify(message);
        ws.send(messageString);
      } else {
        dispatch(
          snackbarActionFunc({
            message: 'Połączenie z Tablicą nie jest możliwe!',
            status: 'ERROR',
          })
        );
        attemptReconnect();
      }
    },
    [dispatch, attemptReconnect]
  );

  return { message, sendMessage, status };
}

export default useWebSocket;
