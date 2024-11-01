/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@__store/hooks';
import useAsyncStorage from '@__hooks/useAsyncStorage';
import { connectState } from '@__store/slices/webSocketSlice';
import { ConnectType, IConnect, ISnackbar, IWebSocketMessage } from '@__types/game.type';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';
import { Alert } from 'react-native';
import { DevicesType } from '@__types/connect.type';

const useIpConnection = () => {
  const { storedValue, setValue } = useAsyncStorage('lastIp');
  const restoreCounterLimit = 120;

  const [websocketMessage, setMessage] = useState<IWebSocketMessage['payload'] | null>(
    null
  );
  const [connectedDevices, setConnectedDevices] = useState<
    { id: string; type: DevicesType }[]
  >([]);
  const [ipAddress, setIpAddress] = useState<string>('');
  const [restoreCounter, setRestoreCounter] = useState(0);
  const [connection, setConnection] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [firstStart, setFirtsStart] = useState(false);
  const [status, setStatus] = useState<ConnectType>(null);
  const [webSocketStatus, setWebSocketStatus] = useState<ConnectType>(null);

  const isSuccessRef = useRef(true);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectInterval = useRef<NodeJS.Timeout | null>(null);
  const snackbarRestore = useRef<ISnackbar | null>(null);

  //TESTY Połączenia
  const [testConnection, setTestConnection] = useState(false);
  const [restoreStableConnection, setRestoreStableConnection] = useState(false);

  const dispatch = useAppDispatch();

  const fetchWithTimeout = (
    url: string,
    options: RequestInit,
    timeout = 5000
  ): Promise<Response> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout);

      fetch(url, options)
        .then((response) => {
          clearTimeout(timer);
          resolve(response as Response); // Rzutowanie odpowiedzi na typ Response
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  };

  // Funkcja łączenia z WebSocket
  const connectWebSocket = useCallback(() => {
    if (!ipAddress) return;
    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN ||
        socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const socketUrl = `ws://${ipAddress}:2121`;
    const ws = new WebSocket(socketUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setWebSocketStatus('success');

      // Czyścimy interwał ponownego połączenia, jeśli połączenie się powiedzie
      if (reconnectInterval.current) {
        clearTimeout(reconnectInterval.current);
        reconnectInterval.current = null;
      }
      snackbarRestore.current = {
        status: 'SUCCESS',
        message: 'Uzyskano połączenie z WebSocket',
      };
      dispatch(snackbarActionFunc(snackbarRestore.current));
      ws.send(JSON.stringify({ type: 'connect', payload: 'ADMIN-TABLET' }));
    };

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === 'connected-devices') {
          setConnectedDevices(parsedData.payload); // Zaktualizuj stan podłączonych urządzeń
        }
        // Obsługa typu red-team, blue-team, board (dane gry)
        else if (
          parsedData.type === 'red-team' ||
          parsedData.type === 'blue-team' ||
          parsedData.type === 'board'
        ) {
          // Przetwarzanie danych gry
          setMessage(parsedData.payload);
        }
        // Dodaj obsługę innych typów wiadomości w miarę potrzeby
        else {
          console.warn(`Unknown message type: ${parsedData.type}`);
        }
      } catch (error) {
        snackbarRestore.current = {
          status: 'ERROR',
          message: `Błąd przesyłania danych do WebSocket. Error: ${error}`,
        };
        dispatch(snackbarActionFunc(snackbarRestore.current));
      }
    };

    ws.onclose = () => {
      snackbarRestore.current = {
        status: 'ERROR',
        message: 'Połączenie z WebSocket zostało zamknięte onClose',
      };
      dispatch(snackbarActionFunc(snackbarRestore.current));
      setWebSocketStatus('close');

      // Dodaj logikę ponownego połączenia
      attemptReconnectWebSocket();
    };

    ws.onerror = (error) => {
      setWebSocketStatus('error');
      snackbarRestore.current = {
        status: 'ERROR',
        message: `Błąd połączenia z WebSocket! Error: ${error}`,
      };
      dispatch(snackbarActionFunc(snackbarRestore.current));

      // Dodaj logikę ponownego połączenia
      attemptReconnectWebSocket();
    };
  }, [ipAddress, dispatch]);

  const attemptReconnectWebSocket = useCallback(() => {
    if (!reconnectInterval.current) {
      reconnectInterval.current = setInterval(() => {
        connectWebSocket(); // Próba ponownego połączenia
      }, 3000); // Spróbuj połączyć ponownie co 5 sekund
    }
  }, [connectWebSocket]);

  const sendWebSocketMessage = useCallback(
    (message: any) => {
      const ws = socketRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        const messageString = JSON.stringify(message);
        ws.send(messageString);
      } else {
        snackbarRestore.current = {
          message: 'Połączenie z WebSocket nie jest możliwe!',
          status: 'ERROR',
        };
        dispatch(snackbarActionFunc(snackbarRestore.current));
      }
    },
    [dispatch]
  );

  const handleFirstStartApp = (action: boolean) => {
    setFirtsStart(action);
  };

  const validIpAddress = (ipAddress: string) => {
    setIpAddress(ipAddress);
  };

  const testConnectionWhenSuccesFunc = useCallback(async () => {
    try {
      const response = await fetch(`http://${storedValue}:2020/get-ip`, {
        method: 'GET',
      });

      if (response.ok) {
        setConnection(true);
        setStatus('success');
        isSuccessRef.current = true;

        // Po udanym połączeniu IP, połącz WebSocket
        connectWebSocket();
      }
    } catch (error) {
      dispatch(
        snackbarActionFunc({
          status: 'ERROR',
          message: 'Połączenie zostało zerwane',
        })
      );
      setConnection(false);
      setTestConnection(false);
      setRestoreCounter(0);
      setRestoreStableConnection(true);
      setStatus('error');
      isSuccessRef.current = false;
    }
  }, [storedValue, dispatch, connectWebSocket]);

  const restoreConnectionFunc = useCallback(async () => {
    try {
      const response = await fetch(`http://${storedValue}:2020/get-ip`, {
        method: 'GET',
      });
      if (response.ok) {
        isSuccessRef.current = true;
        setStatus('success');
        setRestoreStableConnection(false);
        setTestConnection(true);
        setConnection(true);
        setRestoreCounter(0);
        connectWebSocket();
      }
    } catch (error) {
      setRestoreCounter((prev) => prev + 1);
      setTestConnection(false);
      isSuccessRef.current = false;
      snackbarRestore.current = {
        status: 'ERROR',
        message: `Następuje przywracanie połączenie z punktem dostępu: ${restoreCounter + 1}`,
        snackbarHideAfter: 3.2,
      };
      if (snackbarRestore.current?.status === status?.toUpperCase()) {
        return;
      } else {
        dispatch(snackbarActionFunc(snackbarRestore.current));
      }

      if (restoreCounter + 1 >= restoreCounterLimit) {
        setRestoreCounter(0);
        setConnection(false);
        handleFirstStartApp(true);
        setStatus('close');
      }
    }
  }, [
    storedValue,
    dispatch,
    restoreCounter,
    handleFirstStartApp,
    connectWebSocket,
    status,
  ]);

  // Zmodyfikowana funkcja handleSubmit
  const handleSubmit = useCallback(
    async (ipAddress: IConnect['ipAddress']) => {
      if (!firstStart) return; // Nie wykonuj, jeśli aplikacja nie jest w pierwszym starcie
      setLoading(true);

      try {
        if (!ipAddress) return;

        // Używamy fetchWithTimeout z limitem czasu np. 5 sekund
        const response = await fetchWithTimeout(
          `http://${ipAddress}:2020/get-ip`,
          {
            method: 'GET',
          },
          3000
        ); // Timeout ustawiony na 5000 ms (5 sekund)

        if (response.ok) {
          handleFirstStartApp(false); // Wyłączamy tryb pierwszego startu
          setValue(ipAddress);
          setStatus('success');
          setConnection(true);
          setTestConnection(true);
          isSuccessRef.current = true;

          dispatch(
            snackbarActionFunc({
              status: 'SUCCESS',
              message: 'Połączenie zostało nawiązane!',
            })
          );

          dispatch(
            connectState({
              ipAddress,
              status: 'success',
              message: 'Connection successful',
            })
          );

          connectWebSocket();
        }
      } catch (error) {
        Alert.alert('Połączenie', 'Nie udało się połączyć z aplikacją desktopową');
        setStatus('error');
        dispatch(
          connectState({
            ipAddress: null,
            status: 'error',
            message: 'Server not responding.',
          })
        );

        if (!firstStart) {
          dispatch(
            snackbarActionFunc({
              status: 'ERROR',
              message:
                'Nie można uzyskać połączenia! Spróbuj uruchomić aplikację desktopową',
            })
          );
        }

        setStatus('error');
        setConnection(false);
        setTestConnection(false);
        isSuccessRef.current = false;
      } finally {
        setLoading(false);
        handleFirstStartApp(true);
      }
    },
    [dispatch, setValue, firstStart, connectWebSocket]
  );

  useEffect(() => {
    if (testConnection && !restoreStableConnection && isSuccessRef.current) {
      const testConnectInterval = setInterval(() => {
        testConnectionWhenSuccesFunc();
      }, 3000);
      return () => clearInterval(testConnectInterval);
    }
  }, [testConnection, testConnectionWhenSuccesFunc, restoreStableConnection]);

  useEffect(() => {
    if (restoreStableConnection && !testConnection && !isSuccessRef.current) {
      const restoreConnectInterval = setInterval(() => {
        restoreConnectionFunc();
      }, 1000);
      return () => clearInterval(restoreConnectInterval);
    }
  }, [restoreStableConnection, testConnection, restoreConnectionFunc]);

  return {
    restoreCounter,
    validIpAddress,
    handleSubmit,
    ipValueCheckFunc: () => {
      if (ipAddress) {
        handleSubmit(ipAddress);
      }
    },
    handleFirstStart: (firstStart: boolean) => {
      handleFirstStartApp(firstStart);
    },
    storedValue,
    status,
    connection,
    isLoading,
    firstStart,
    websocketMessage,
    sendWebSocketMessage,
    webSocketStatus,
    connectedDevices,
  };
};

export default useIpConnection;
