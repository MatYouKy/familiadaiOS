/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from 'react';
import { IConnect, IWebSocketMessage } from '@__types/game.type';
import { useAppDispatch } from '@__store/hooks';
import { connectState } from '@__store/slices/webSocketSlice';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';

const WEBSOCKET_URL = 'ws://192.168.0.26:82';

function usePulpitSocket() {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<IWebSocketMessage['payload'] | null>(null);
  const [status, setStatus] = useState<IConnect['status']>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0); // Licznik prób ponownego połączenia
  const initialDelay = useRef(7000); // Opóźnienie przed pierwszym połączeniem w milisekundach
  const reconnectDelay = useRef(5000); // Opóźnienie między próbami w milisekundach

  const connect = useCallback(() => {
    if (!WEBSOCKET_URL) return;

    const ws = new WebSocket(WEBSOCKET_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      reconnectAttempts.current = 0; // Reset liczby prób po pomyślnym połączeniu
      setStatus('success');
      if (status !== 'success') {
        dispatch(
          snackbarActionFunc({
            status: 'SUCCESS',
            message: `Uzyskano połączenie z Pulpitem`,
          })
        );
      } 
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
            message: `Błąd przesyłania danych: ${error}`,
          })
        );
      }
    };

    ws.onclose = () => {
      setStatus(null);
      dispatch(
        connectState({
          status: 'close',
          message: 'Połączenie zamknięte',
          ipAddress: null,
        })
      );
      dispatch(
        snackbarActionFunc({
          status: 'ERROR',
          message: `Połączenie z Pulpitem zostało zamknięte`,
        })
      );
      reconnect(); // Próba ponownego połączenia
    };

    ws.onerror = (error) => {
      setStatus('error');
      dispatch(
        connectState({
          status: 'error',
          message: `Połączenie z Pulpitem zamknięte! Error: ${error}`,
          ipAddress: null,
        })
      );
      dispatch(
        snackbarActionFunc({
          status: 'ERROR',
          message: `Połączenie z Pulpitem zostało zamknięte Error: ${error}`,
        })
      );
      reconnect(); // Próba ponownego połączenia
    };
  }, [dispatch]);

  const reconnect = useCallback(() => {
    if (reconnectAttempts.current < 10) {
      reconnectAttempts.current += 1;
      setTimeout(() => {
        connect(); // Próba ponownego połączenia
      }, reconnectDelay.current);
    } else {
      dispatch(
        snackbarActionFunc({
          status: 'ERROR',
          message: `Nie udało się ponownie połączyć po ${reconnectAttempts.current} próbach. Sprawdź połączenie sieciowe z Pulpitem`,
        })
      );
    }
  }, [connect, dispatch]);

  useEffect(() => {
    const initialConnectionTimeout = setTimeout(() => {
      connect(); // Nawiązanie pierwszego połączenia po opóźnieniu
    }, initialDelay.current);

    return () => {
      clearTimeout(initialConnectionTimeout);
      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING)
      ) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback(
    (message: any) => {
      const ws = socketRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        const messageString = JSON.stringify(message);
        ws.send(messageString);
      } else {
        dispatch(
          snackbarActionFunc({
            message: `Pulpit nie jest połączony!`,
            status: 'ERROR',
          })
        );
      }
    },
    [dispatch]
  );

  return { message, sendMessage, status };
}

export default usePulpitSocket;
