/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import { DevicesType } from '@__types/connect.type';
import { ConnectType, GameProgress, GameStatus, IGameTeam } from '@__types/game.type';
import { useAppDispatch } from '@__store/hooks';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';

export interface WebSocketMessage {
  redTeam?: IGameTeam;
  blueTeam?: IGameTeam;
  board?: {
    currentQuestion: {
      id: string;
      question: string;
      multiplier: number;
      answers: {
        id: string;
        text: string;
        score: number;
        isVisible: boolean;
      }[];
    };
    score: string;
    roundNumber: string;
    gameProgress: GameProgress;
    gameStatus: GameStatus;
    introMusic: boolean;
  };
  type: string;
  payload: any;
}

export const useCustomWebsocket = (
  devicesType: DevicesType,
  ipAddress: string,
  port: number
) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [webSocketStatus, setWebSocketStatus] = useState<ConnectType>(null);
  const [message, setMessage] = useState<WebSocketMessage | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<
    { id: string; type: DevicesType }[]
  >([]);

  const dispatch = useAppDispatch();

  const [buttonState, setButtonState] = useState({
    blueButton: false,
    redButton: false,
  });

  const connectWebSocket = useCallback(() => {
    if (!ipAddress) {
      console.error('Brak adresu IP. Nie można nawiązać połączenia.');
      return;
    }

    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN ||
        socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const socketUrl = `ws://${ipAddress}:${port}`;
    const ws = new WebSocket(socketUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setWebSocketStatus('success');
      // Wysyłanie typu połączenia
      ws.send(JSON.stringify({ type: 'connect', payload: devicesType }));
    };

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);

        if ('blueButton' in parsedData && 'redButton' in parsedData) {
          setButtonState((prev) => {
            return {
              ...prev,
              redButton: parsedData.redButton,
              blueButton: parsedData.blueButton,
            };
          });
        }

        if (devicesType === 'PULPIT') {
          // Dodaj Arduino do listy urządzeń tylko raz
          setConnectedDevices((prevDevices) => {
            const updatedDevices = [...prevDevices];
            if (!updatedDevices.find((device) => device.id === ipAddress)) {
              updatedDevices.push({ id: ipAddress, type: 'PULPIT' });
            }
            return updatedDevices;
          });
          return; // Omiń dalsze przetwarzanie wiadomości z Arduino
        }

        if (devicesType !== 'ADMIN-PULPIT') {
          switch (parsedData.type) {
            case 'connected-devices':
              if (Array.isArray(parsedData.payload)) {
                setConnectedDevices(parsedData.payload);
              }
              break;
            case 'red-team':
            case 'blue-team':
            case 'board':
              setMessage({ type: parsedData.type, payload: parsedData.payload });
              break;
            default:
              console.warn(
                `Unknown message type: ${parsedData.type} - ${ipAddress}:${port}`
              );
          }
        }
      } catch (error) {
        dispatch(
          snackbarActionFunc({
            message: `Error parsing message: ${error}`,
            status: 'ERROR',
          })
        );
      }
    };

    ws.onclose = () => {
      setWebSocketStatus('close');
      console.error('Połączenie z WebSocket zostało zamknięte.');
      dispatch(
        snackbarActionFunc({
          message: `Not connected to FAMILIADA network. WebSocket not connected.`,
          status: 'ERROR',
        })
      );
    };

    ws.onerror = (error) => {
      setWebSocketStatus('error');
      console.error('Błąd połączenia z WebSocket:', error);
      dispatch(
        snackbarActionFunc({
          message: 'Not connected to FAMILIADA network. WebSocket not connected.',
          status: 'ERROR',
        })
      );
    };
  }, [ipAddress, devicesType, port]);

  // Automatyczne ponowne połączenie w przypadku zamknięcia lub błędu
  useEffect(() => {
    if (webSocketStatus === 'error' || webSocketStatus === 'close') {
      const reconnectTimeout = setTimeout(() => {
        connectWebSocket();
      }, 5000);

      return () => clearTimeout(reconnectTimeout);
    }
  }, [webSocketStatus, connectWebSocket]);

  // Zamykanie WebSocket przy unmountowaniu komponentu
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return { message, connectWebSocket, webSocketStatus, connectedDevices, buttonState };
};
