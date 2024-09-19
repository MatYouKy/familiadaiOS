import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '@__components/ui/actions/ActionButton';
import { useAppDispatch } from '@__store/hooks';
import { colorBase } from '@__colors/colorBase';
import { updateGameProgress } from '@__store/slices/globalStateReducer';

export const EndGame = () => {
  const dispatch = useAppDispatch();

  const handleBack = () => {
    dispatch(updateGameProgress('INIT'));
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.headingWrapper}>
        <Text style={styles.headingText}>Dziękujemy Koniec!</Text>
      </View>
      <View style={styles.actionButtonWrapper}>
        <ActionButton title="Wróć" onPress={handleBack} backgroundColor="blueDark" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  headingWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48,
  },
  headingText: {
    color: colorBase.mainGold,
    fontSize: 64,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  actionButtonWrapper: {
    width: 500,
    height: 500,
    justifyContent: 'space-between',
  },
  button: {
    height: 250,
    width: 250,
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colorBase.white.default,
    borderWidth: 16,
  },
  buttonText: {
    color: '#ffffff',
  },
});
