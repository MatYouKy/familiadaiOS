import React, { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { colorBase } from '@__colors/colorBase';
import { InitializeConnect } from '../components/connect/initialize-connect/InitializeConnect';
import { useAppSelector } from '@__store/hooks';
import { Game } from './components/game/Game';
import Snackbar from '@__components/ui/snackbar/Snackbar';
import { LoaderModal } from '@__components/ui/loader/Loader';
import useIpConnection from '@__hooks/useIpConnection';

export const AppContent = () => {
  const snackbarAction = useAppSelector((state) => state.snackbarAction);
  const {
    inputIpAddress,
    handleIpValue,
    handleFirstStart,
    handleButtonPress,
    storedValue,
    connection,
    isLoading,
    status,
  } = useIpConnection();

  useLayoutEffect(() => {
    handleFirstStart(true);
  }, []);

  return (
    <View style={styles.appContainer}>
      {connection && <Game storedIp={storedValue} />}
      <LoaderModal
        size="large"
        color="mainGold"
        modalIsOpen={isLoading || (connection && status === 'pending')}
        transparent
      />
      <InitializeConnect
        connection={connection}
        handleButtonPress={handleButtonPress}
        handleIpValue={handleIpValue}
        inputIpAddress={inputIpAddress}
        isLoading={isLoading}
        storedValue={storedValue}
      />
      {snackbarAction && <Snackbar snackbarAction={snackbarAction} />}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorBase.background.main,
  },
});
