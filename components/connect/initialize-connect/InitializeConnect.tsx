import React, { FC } from 'react';
import { StyleSheet, Modal, Text, TextInput, View } from 'react-native';
import { colorBase } from '@__colors/colorBase';
import { ActionButton } from '@__components/ui';
import { Loader } from '@__components/ui/loader/Loader';

interface IInitializeConnect {
  inputIpAddress: string;
  handleIpValue: (ipAddress: string) => void;
  handleButtonPress: () => void;
  storedValue: string | null;
  connection: boolean;
  isLoading: boolean;
}

export const InitializeConnect: FC<IInitializeConnect> = ({
  inputIpAddress,
  handleIpValue,
  connection,
  handleButtonPress,
  isLoading,
  storedValue,
}) => {
  const usedStoredValue = () => {
    if (storedValue) {
      handleIpValue(storedValue);
    }
  };

  return (
    <Modal visible={!connection} style={styles.modal}>
      <View style={styles.modal}>
        {isLoading ? (
          <View style={styles.loader}>
            <Loader size="large" color="mainGold" />
          </View>
        ) : (
          <>
            <View style={styles.ipContainer}>
              <View style={styles.storedValue}>
                <TextInput
                  value={inputIpAddress}
                  placeholder="Wpisz Adres IP"
                  style={styles.ipTextInput}
                  onChangeText={handleIpValue}
                  placeholderTextColor="#666"
                />
                <ActionButton
                  title="Sprawdź"
                  onPress={handleButtonPress}
                  backgroundColor="successLight"
                  color="white"
                />
              </View>

              <Text style={styles.storedText}>OSTATNIO UŻYWANE IP: {storedValue}</Text>
              <ActionButton
                title="Użyj"
                onPress={usedStoredValue}
                backgroundColor="bluePastel"
                color="white"
              />
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorBase.background.main,
  },
  ipContainer: {
    width: 600,
    height: 300,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 16,
  },
  ipTextInput: {
    width: 400,
    marginRight: 10,
    fontSize: 48,
    textAlign: 'center',
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomColor: colorBase.blue.light,
    borderRadius: 8,
    marginBottom: 16,
    color: colorBase.white.default,
  },
  restoreCounter: {
    color: colorBase.white.default,
    fontSize: 20,
  },
  storedValue: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 64,
  },
  storedText: {
    textAlign: 'center',
    color: colorBase.white.default,
    fontSize: 24,
  },
  loader: {
    // flex: 1,
    height: 140,
  },
});
