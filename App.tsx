import React, { FC, useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Button, Text } from 'react-native';
import { Game } from './components/game/Game';
import useAsyncStorage from './hooks/useAsyncStorage';
import { IConnect } from './types/connect.type';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import store from './store/store';
import useWebSocket from './hooks/useWebSocket';
import { useAppSelector } from './store/hooks';
import { WebsocketBoard, WebsocketTeam } from './types/game.type';

interface TestIpProps {
  handleIpValue: (ipAddress: string) => void;
  ipAddress: string;
  handleSubmit: (ipAddress: string) => void;
}

const TestIp: FC<TestIpProps> = ({ handleIpValue, ipAddress, handleSubmit }) => {
  const handleAdresIp = () => {
    handleSubmit(ipAddress);
  };
  return (
    <>
      <StatusBar hidden style="light" />
      <View style={styles.ipContainer}>
        <TextInput
          value={ipAddress}
          placeholder="Wpisz kod"
          style={styles.ipTextInput}
          onChangeText={handleIpValue}
          placeholderTextColor="#666"
        />
        <Button title="SPRAWDŹ" onPress={handleAdresIp} />
      </View>
    </>
  );
};

const AppContent: FC = () => {
  const [ipAddress, setIpAddress] = useState<string>('');
  const { storedValue, setValue } = useAsyncStorage('lastIp');

  const [connect, setConnect] = useState<IConnect>({
    ipAddress: '',
    message: '',
    status: null,
  });

  const gameProgress = useAppSelector((state) => state.globalState.gameProgress);
  const gameState = useAppSelector((state) => state.gameState);
  const { blueTeam, redTeam } = useAppSelector((state) => state.teams);

  const wsPort = 81;
  const wsUrl = connect.ipAddress ? `ws://${connect.ipAddress}:${wsPort}` : '';

  const { status, sendMessage } = useWebSocket(wsUrl);

  const handleIpValue = (ipAddress: string) => {
    setIpAddress(ipAddress);
  };

  const handleSubmit = useCallback(
    async (ipAddress: string) => {
      try {
        const response = await fetch(`http://${ipAddress}:8080/get-ip`, {
          method: 'GET',
        });
        if (response.ok) {
          setConnect({
            ipAddress,
            status: 'success',
            message: 'połączenie powiodło się',
          });
          setValue(ipAddress);
        } else {
          setConnect({
            ipAddress,
            status: 'error',
            message: 'Serwer nie odpowiada.',
          });
          throw new Error('Serwer nie odpowiada.');
        }
      } catch (error) {
        setConnect({
          ipAddress: null,
          message: 'Błąd połączenia. Spróbuj ponownie.',
          status: 'error',
        });
      }
    },
    [ipAddress, setValue]
  );

  useEffect(() => {
    if (storedValue && connect.status === null) {
      handleSubmit(storedValue);
    }
  }, [storedValue, handleSubmit, connect.status]);

  useEffect(() => {
    if (status === 'open') {
      sendMessage({ type: 'connect', payload: 'TABLET' });
    }
  }, [status, sendMessage]);

  useEffect(() => {
    const sendTeam: WebsocketTeam = {
      type: 'red-team',
      payload: {
        teamType: 'RED',
        totalScore: redTeam.totalScore,
        name: redTeam.name,
        fault: redTeam.fault,
      },
    };

    if (status === 'open') {
      sendMessage(sendTeam);
    }
  }, [status, redTeam]);

  useEffect(() => {
    const sendTeam: WebsocketTeam = {
      type: 'blue-team',
      payload: {
        teamType: 'BLUE',
        totalScore: blueTeam.totalScore,
        name: blueTeam.name,
        fault: blueTeam.fault,
      },
    };

    if (status === 'open') {
      sendMessage(sendTeam);
    }
  }, [status, blueTeam]);

  useEffect(() => {
    const sendBoard: WebsocketBoard = {
      type: 'board',
      payload: {
        answers: gameState.currentQuestion.answers,
        question: gameState.currentQuestion.question,
        score: gameState.score,
        roundNumber: gameState.roundNumber,
        gameProgress: gameProgress,
        gameStatus: gameState.gameStatus,
        introMusic: gameState.introMusic,
      },
    };

    if (status === 'open') {
      sendMessage(sendBoard);
    }
  }, [status, gameState, gameProgress]);

  if (!storedValue || connect.status !== 'success') {
    return (
      <View style={styles.appContainer}>
        <TestIp
          handleIpValue={handleIpValue}
          ipAddress={ipAddress}
          handleSubmit={handleSubmit}
        />
        {connect.message ? <Text>{connect.message}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.appContainer}>
      <Game />
    </View>
  );
};

const App: FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ipTextInput: {
    borderBottomWidth: 1,
    marginRight: 10,
  },
});
