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
    ipAddress: storedValue,
    message: '',
    status: null,
  });

  const { gameProgress, introMusic } = useAppSelector((state) => state.globalState);
  const gameState = useAppSelector(state => state.gameState)
  const { blueTeam, redTeam } = useAppSelector(state => state.teams)

  const wsPort = 8181;
  const wsUrl = `ws://${connect.ipAddress}:${wsPort}`;

  const { status, sendMessage } = useWebSocket(wsUrl);

  const handleIpValue = (ipAddress: string) => {
    setIpAddress(ipAddress);
  };

  const handleSubmit = useCallback(
    async (ipAddress: string) => {
      try {
        const response = await fetch(`http://${ipAddress}:3000`, {
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
    [ipAddress]
  );

  useEffect(() => {
    if (storedValue) {
      handleSubmit(storedValue);
    }
  }, [storedValue]);

  useEffect(() => {
    console.log('introMusic', introMusic);
    const sendData = {
      redTeam: {
        score: redTeam.totalScore,
        name: redTeam.name,
        fault: redTeam.fault,
      },
      blueTeam: {
        score: blueTeam.totalScore,
        name: blueTeam.name,
        fault: blueTeam.fault,
      },
      board: {
        currentQuestion: gameState.currentQuestion,
        score: gameState.score,
        roundNumber: gameState.roundNumber,
        gameProgress: gameProgress,
        gameStatus: gameState.gameStatus,
        introMusic: introMusic,
      },
    };
    if (status === 'open') {
      sendMessage(sendData);
    }
  }, [status, gameState, redTeam, blueTeam, introMusic]);

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
