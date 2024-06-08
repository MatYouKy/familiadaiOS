/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { colorBase } from '../../colors/colorBase';
// import { GameTeam } from './team/GameTeam';
import { GameBoard } from './board/GameBoard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import InitialGame from './initial-game/InitialGame';
import { StartGame } from './start-game/StartGame';

import { resetTeams, startGameTeam } from '../../store/slices/teamsState';
import { initialStateFunc } from '../../store/slices/gameState';
import useQuestionState from '../../hooks/useQuestionState';
import { GameTeam } from './team/GameTeam';
import { EndGame } from './end-game/EndGame';

export const Game = () => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((state) => state.globalState.questions);
  const roundNumber = useAppSelector((state) => state.gameState.roundNumber);
  const redTeam = useAppSelector((state) => state.teams.redTeam);
  const blueTeam = useAppSelector((state) => state.teams.blueTeam);

  const gameProgress = useAppSelector((state) => state.globalState.gameProgress);

  const { initializeQuestion } = useQuestionState();

  useEffect(() => {
    if (gameProgress === 'INIT') {
      dispatch(resetTeams());
      dispatch(startGameTeam());
      dispatch(initialStateFunc());
    }

    if (questions.length && roundNumber < questions.length) {
      initializeQuestion(questions[roundNumber]);
    }
  }, [questions, gameProgress, roundNumber, initializeQuestion, dispatch, startGameTeam]);

  if (gameProgress === 'START') {
    return <StartGame />;
  }
  if (gameProgress === 'INIT') {
    return <InitialGame />;
  }
  if (gameProgress === 'END') {
    return <EndGame />
  }

  return (
    <View style={styles.gameContainer}>
      <View style={styles.redTeam}>
        <GameTeam teamData={redTeam} />
      </View>
      <View style={styles.table}>
        <GameBoard />
      </View>
      <View style={styles.blueTeam}>
        <GameTeam teamData={blueTeam} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#343434',
  },
  redTeam: {
    width: 300,
    borderRightWidth: 2,
    borderRightColor: colorBase.mainGold,
  },
  blueTeam: {
    width: 300,
    borderLeftWidth: 2,
    borderLeftColor: colorBase.mainGold,
  },
  table: {
    flex: 1,
    flexDirection: 'row',
  },
});
