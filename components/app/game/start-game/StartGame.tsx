import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppDispatch } from '@__store/hooks';
import { updateGameProgress } from '@__store/slices/globalStateReducer';
import { introMusicFunc } from '@__store/slices/gameState';
import { colorBase } from '@__colors/colorBase';
import { ActionButton } from '@__components/ui';

export const StartGame = () => {
  const dispatch = useAppDispatch();
  const [timeLeft, setTimeLeft] = useState<number>(19);
  const [countdownStarted, setCountdownStarted] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdownStarted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      dispatch(updateGameProgress('QUIZ'));
    }
    return () => clearTimeout(timer);
  }, [countdownStarted, timeLeft, dispatch]);

  const handleStartGame = () => {
    setCountdownStarted(true);
    dispatch(introMusicFunc(true));
  };
  const handleBack = () => {
    dispatch(updateGameProgress('INIT'));
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.headingWrapper}>
        <Text style={styles.headingText}>
          {countdownStarted ? 'Gra rozpocznie się za:' : 'Zaczynajmy!'}
        </Text>
        {countdownStarted && <Text style={styles.headingText}>{timeLeft} s</Text>}
      </View>
      {!countdownStarted && (
        <View style={styles.actionButtonWrapper}>
          <ActionButton
            title="CZOŁÓWKA"
            size="large"
            onPress={handleStartGame}
            backgroundColor="successDark"
            textStyle={styles.buttonText}
            buttonStyle={styles.button}
          />
        </View>
      )}
      <ActionButton title="Wróć" onPress={handleBack} backgroundColor="blueDark" />
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
