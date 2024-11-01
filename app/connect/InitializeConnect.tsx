/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useState } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
} from 'react-native';
import { colorBase } from '@__colors/colorBase';
import { ActionButton } from '@__components/ui';
import { Loader } from '@__components/ui/loader/Loader';
import { ConnectType } from '@__types/game.type';
import { Input } from '@__components/ui/Input/Input';
import { validateIpAddress } from '@__utils/validators';
import { InputTextValidProps } from '@__types/ui.type';
import { Divider } from 'react-native-paper';

interface IInitializeConnect {
  validIpAddress: (ipAddress: string) => void;
  handleIpValueCheck: () => void;
  storedValue: string | null;
  connection: boolean;
  isLoading: boolean;
  status: ConnectType;
}

export const InitializeConnect: FC<IInitializeConnect> = ({
  validIpAddress,
  connection,
  handleIpValueCheck,
  isLoading,
  storedValue,
  status,
}) => {
  const [inputIpValues, setInputIpValues] = useState<InputTextValidProps>({
    value: '',
    isValid: true,
    isTouched: false,
  });

  const handleIpValue = (ipAddress: string) => {
    setInputIpValues((currentValues) => {
      return {
        ...currentValues,
        isValid: true,
        value: ipAddress,
      };
    });
  };

  const usedStoredValue = () => {
    if (storedValue) {
      handleIpValue(storedValue);
    }
  };

  const handleSubmit = () => {
    if (validateIpAddress(inputIpValues.value) && inputIpValues.isTouched) {
      validIpAddress(inputIpValues.value);
      handleIpValueCheck();
    } else {
      setInputIpValues((currentValues) => {
        return {
          ...currentValues,
          isValid: validateIpAddress(inputIpValues.value),
        };
      });
    }
  };

  const handleFocus = () => {
    setInputIpValues((currentValues) => {
      return {
        ...currentValues,
        isTouched: true,
      };
    });
  };

    const handleKeyPress = (e: any) => {
      if (e.nativeEvent.key === 'Enter') {
        handleSubmit();
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
                <Input
                  minWidth={450}
                  size="x-large"
                  direction="row"
                  variant="underline"
                  colorVariant="mainGold"
                  isError={!inputIpValues.isValid}
                  errorText="Podaj prawidłowy adres IP"
                  inputProps={{
                    onChangeText: handleIpValue,
                    onKeyPress: handleKeyPress,
                    onFocus: handleFocus,
                    placeholder: 'Wpisz Adres IP',
                    textAlign: 'center',
                    maxLength: 15,
                    value: inputIpValues.value,
                    keyboardType: 'number-pad',
                    autoFocus: true,
                    autoCorrect: false,
                  }}
                />
                <ActionButton
                  title="Sprawdź"
                  onPress={handleSubmit}
                  backgroundColor="successLight"
                  color="whiteDefault"
                  disabled={false}
                />
              </View>
              <Divider />
              <Text style={styles.storedText}>OSTATNIO UŻYWANE IP: {storedValue}</Text>
              <ActionButton
                title="Użyj"
                onPress={usedStoredValue}
                backgroundColor="bluePastel"
                color="whiteDefault"
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
    backgroundColor: colorBase.backgroundDark,
  },
  ipContainer: {
    width: 700,
    height: 300,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 8,
  },
  ipTextInput: {
    width: 400,
    marginRight: 10,
    fontSize: 48,
    textAlign: 'center',
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomColor: colorBase.blueLight,
    borderRadius: 8,
    marginBottom: 16,
    color: colorBase.whiteDefault,
  },
  restoreCounter: {
    color: colorBase.whiteDefault,
    fontSize: 20,
  },
  storedValue: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  storedText: {
    textAlign: 'center',
    color: colorBase.whiteDefault,
    fontSize: 24,
  },
  loader: {
    // flex: 1,
    height: 140,
  },
});
