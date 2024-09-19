import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '@__store/hooks';
import useAsyncStorage from '@__hooks/useAsyncStorage';
import { connectState } from '@__store/slices/webSocketSlice';
import { ConnectType, IConnect } from '@__types/game.type';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';

const useIpConnection = () => {
  const { storedValue, setValue } = useAsyncStorage('lastIp');
  const [inputIpAddress, setInputIpAddress] = useState<string>('');
  const [testConnection, setTestConnection] = useState(false);
  const [restoreConnection, setRestoreConnection] = useState(false);
  const [restoreCounter, setRestoreCounter] = useState(0);
  const [connection, setConnection] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [firstStart, setFirtsStart] = useState(false);
  const [status, setStatus] = useState<ConnectType>('close');

  const dispatch = useAppDispatch();
  const restoreCounterLimit = 120;

  const handleIpValue = (ipAddress: string) => {
    setInputIpAddress(ipAddress);
  };

  const handleFirstStartApp = (action: boolean) => {
    setFirtsStart(action);
  };

  const testConnectionWhenSuccesFunc = useCallback(async () => {
    try {
      const response = await fetch(`http://${inputIpAddress}:2020/get-ip`, {
        method: 'GET',
      });
      if (response.ok) {
        setConnection(true);
        setStatus('success');
      }
    } catch (error) {
      console.error('Connection failed:', error);
      dispatch(
        snackbarActionFunc({
          status: 'ERROR',
          message: 'Połączenie zostało zerwane',
        })
      );
      setTestConnection(false);
      setRestoreConnection(true);
      setRestoreCounter(0);
      setStatus('error');
    }
  }, [inputIpAddress]);

  const restoreConnectionFunc = useCallback(
    async (restoreCounter: number) => {
      try {
        console.log(`Attempting to restore connection to ${storedValue}...`);
        const response = await fetch(`http://${storedValue}:2020/get-ip`, {
          method: 'GET',
        });
        if (response.ok) {
          console.log('Connection restored successfully');
          setStatus('success');
          dispatch(
            connectState({
              ipAddress: storedValue,
              status: 'success',
              message: 'Connection successful',
            })
          );
          dispatch(
            snackbarActionFunc({
              status: 'SUCCESS',
              message: 'Połączenie zostało przywrócone',
            })
          );
          setConnection(true);
          setTestConnection(true);
          setRestoreConnection(false);
          setRestoreCounter(0);
        }
      } catch (error) {
        console.error(`Restore attempt #${restoreCounter} failed`, error);
        setRestoreCounter((prev) => prev + 1);
        dispatch(
          snackbarActionFunc({
            status: 'ERROR',
            message: `Następuje przywracanie połączenie z punktem dostępu: ${restoreCounter + 1}`,
            snackbarHideAfter: 3.2,
          })
        );

        if (restoreCounter + 1 >= restoreCounterLimit) {
          console.log('Restore attempts exceeded limit, resetting...');
          setRestoreCounter(0);
          setRestoreConnection(false);
          setInputIpAddress('');
          setConnection(false);
          handleFirstStartApp(true);
          setStatus('close');
        }
      }
    },
    [storedValue, dispatch, handleFirstStartApp]
  );

  const handleSubmit = useCallback(
    async (ipAddress: IConnect['ipAddress']) => {
      if (!firstStart) return;
      setLoading(true);
      try {
        if (!ipAddress) return;

        console.log(`Attempting to connect to ${ipAddress}...`);
        const response = await fetch(`http://${ipAddress}:2020/get-ip`, {
          method: 'GET',
        });

        if (response.ok) {
          console.log('Connection established');
          handleFirstStartApp(false);
          setValue(ipAddress);
          const timeout = setTimeout(() => {
            setStatus('success');
            setConnection(true);
            setTestConnection(true);
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
            setLoading(false);
          }, 1500);

          return () => clearTimeout(timeout);
        } else {
          console.error('Server did not respond');
          setLoading(false);
          setStatus('error');
          throw new Error('Server not responding.');
        }
      } catch (error) {
        console.error('Connection failed:', error);
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
                'Nie można uzyskać połączenia! Spróbuj uruchomić aplikacje desktopową',
            })
          );
        }
        setStatus('error');
        setRestoreCounter(0);
        setConnection(false);
        setTestConnection(false);
        setLoading(false);
        handleFirstStartApp(true);
      }
    },
    [dispatch, setValue, firstStart]
  );

  useEffect(() => {
    if (testConnection && storedValue) {
      const testConnectInterval = setInterval(() => {
        testConnectionWhenSuccesFunc();
      }, 5000); // Test co 5 sekund
      return () => clearInterval(testConnectInterval);
    }
  }, [testConnection, storedValue]);

  useEffect(() => {
    if (restoreConnection && !testConnection) {
      const restoreConnectInterval = setInterval(() => {
        restoreConnectionFunc(restoreCounter);
      }, 5000); // Próba przywrócenia co 5 sekund
      return () => clearInterval(restoreConnectInterval);
    }
  }, [restoreConnection, testConnection, restoreCounter]);

  return {
    restoreCounter,
    inputIpAddress,
    handleIpValue,
    handleSubmit,
    handleButtonPress: () => {
      if (inputIpAddress) {
        handleSubmit(inputIpAddress);
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
  };
};

export default useIpConnection;
