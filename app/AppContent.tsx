import React, { useLayoutEffect } from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { colorBase } from '@__colors/colorBase';
import { InitializeConnect } from './connect/InitializeConnect';
import { useAppSelector } from '@__store/hooks';
import { Game } from './components/game/Game';
import Snackbar from '@__components/ui/snackbar/Snackbar';
import { Loader, LoaderModal } from '@__components/ui/loader/Loader';
import useIpConnection from '@__hooks/useIpConnection';
import { Navbar } from './components/Navbar/Navbar';

export const AppContent = () => {
  const snackbarAction = useAppSelector((state) => state.snackbarAction);
  const {
    validIpAddress,
    handleFirstStart,
    ipValueCheckFunc,
    storedValue,
    connection,
    isLoading,
    status,
    sendWebSocketMessage,
    websocketMessage,
    webSocketStatus,
    restoreCounter,
    connectedDevices
  } = useIpConnection();

  useLayoutEffect(() => {
    handleFirstStart(true);
  }, []);

  const attempts = 120;

  const restoreModalConditional =
    !connection && restoreCounter && restoreCounter < attempts;

  return (
    <View style={styles.appContainer}>
      <Navbar />
      <Game
        sendWebSocketMessage={sendWebSocketMessage}
        websocketMessage={websocketMessage}
        webSocketStatus={webSocketStatus}
        connectedDevices={connectedDevices}
      />
      <LoaderModal
        size="large"
        color="mainGold"
        modalIsOpen={isLoading || (connection && status === 'pending')}
        transparent
      />
      {restoreModalConditional ? (
        <Modal visible={restoreModalConditional}>
          <View style={styles.modalWrapper}>
            <Text style={styles.restoreCounterText}>
              Następuje {restoreCounter} próba przywrócenia połączenia ze {attempts} prób!
            </Text>
            <Loader color="mainGold" size="large" />
          </View>
        </Modal>
      ) : (
        <InitializeConnect
          connection={connection}
          handleIpValueCheck={ipValueCheckFunc}
          validIpAddress={validIpAddress}
          isLoading={isLoading}
          storedValue={storedValue}
          status={status}
        />
      )}
      {snackbarAction && <Snackbar snackbarAction={snackbarAction} />}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorBase.backgroundDark,
  },
  restoreCounterText: {
    color: colorBase.whiteDefault,
    fontSize: 24,
    textTransform: 'uppercase',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
});
