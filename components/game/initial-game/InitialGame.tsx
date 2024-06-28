import React, { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { colorBase } from '../../../colors/colorBase';
// import { GameList } from './GameList';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import { ICompetition } from '../../../types/game.type';
import { Divider } from '../../ui/divider/Divider';
import { GameList } from './GameList';


const InitialGame = () => {
  const { storedValue: ipAddress } = useAsyncStorage('lastIp');
  const [competitions, setCompetitions] = useState<ICompetition[]>([]);


  const handleQuestion = useCallback(() => {
    fetch(`http://${ipAddress}:8080/questions`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.competitions) {
          setCompetitions(data.competitions);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [ipAddress]);

  useEffect(() => {
    if (ipAddress) {
      handleQuestion();
    }
  }, [ipAddress]);

  return (
    <View style={styles.initialGameContainer}>
      <View style={styles.buttonWrapper}>
        <Button title="Zaktualizuj listę pytań" onPress={handleQuestion} />
      </View>
      <Divider />
      <View style={styles.gameListWrapper}>
        <GameList competitions={competitions} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  initialGameContainer: {
    paddingTop: 48,
    flex: 1,
    backgroundColor: colorBase.background.dark,
    width: '100%',
  },
  buttonWrapper: {
    padding: 48,
  },
  gameListWrapper: {
    width: '80%',
    marginHorizontal: 'auto',
    flex: 7,
  },
});

export default React.memo(InitialGame);
