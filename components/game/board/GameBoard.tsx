import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnswerList } from '../answer-list/AnswerList';
import { ActionButton } from '../../ui/actions/ActionButton';
import { RestartSessionModal } from './modal/RestartSessionModal';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  clearFaultFunc,
  nextRoundReset,
  resetTeams,
} from '../../../store/slices/teamsState';
import { colorBase } from '../../../colors/colorBase';
import {
  nextQuestion,
  showNextBattleButtonFunc,
  showNextRoundButtonFunc,
  updateGameStatus,
} from '../../../store/slices/gameState';
import { updateGameProgress } from '../../../store/slices/globalStateReducer';

export const GameBoard = () => {
  const {
    currentQuestion,
    score,
    showNextBattleButton,
    showNextRoundButton,
    showEndGameButton,
    roundNumber,
    gameStatus,
  } = useAppSelector((state) => state.gameState);

  const [openBackModal, setOpenBackModal] = useState(false);

  const dispatch = useAppDispatch();

  const handleOpenModal = () => {
    setOpenBackModal(true);
  };
  const handleCloseModal = () => {
    setOpenBackModal(false);
  };

  const handleNextBattle = () => {
    dispatch(showNextBattleButtonFunc(false));
    dispatch(updateGameStatus('BATTLE'));
    dispatch(clearFaultFunc());
  };
  const handleEndGame = () => {
    dispatch(showNextBattleButtonFunc(false));
    dispatch(updateGameStatus('END-GAME'));
    dispatch(updateGameProgress('END'));
  };

  const handleNextRound = () => {
    dispatch(nextRoundReset());
    dispatch(nextQuestion());
    dispatch(resetTeams());
    dispatch(updateGameStatus('BATTLE'));
    dispatch(showNextRoundButtonFunc(false));
  };

  return (
    <View style={styles.boardContainer}>
      <View style={styles.score}>
        <Text style={styles.scoreText}>{score}</Text>
      </View>
      <View style={styles.question}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>
      <View style={styles.list}>
        <AnswerList list={currentQuestion.answers} />
      </View>
      <View style={styles.question}>
        <Text style={styles.questionText}>Runda {roundNumber + 1}</Text>
      </View>
      <View style={styles.question}>
        <Text style={styles.questionText}>STATUS: {gameStatus}</Text>
      </View>

      <View style={styles.navigation}>
        {showNextBattleButton && (
          <ActionButton onPress={handleNextBattle} title="Następna Bitwa" />
        )}
        {showNextRoundButton && (
          <ActionButton onPress={handleNextRound} title="Następna runda" />
        )}
        {showEndGameButton && (
          <ActionButton onPress={handleEndGame} title="Koniec Gry!" />
        )}
      </View>
      <View style={styles.backButton}>
        <ActionButton
          title="powrót do początku"
          onPress={handleOpenModal}
          backgroundColor="redDark"
        />
      </View>
      <RestartSessionModal openModal={openBackModal} closeModal={handleCloseModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    width: '100%',
  },
  score: {
    height: 120,
    borderBottomWidth: 2,
    borderBottomColor: colorBase.mainGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    color: colorBase.mainGold,
    fontSize: 72,
    fontWeight: '800',
    letterSpacing: 4,
  },
  question: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 20,
    color: colorBase.white,
    textTransform: 'uppercase',
  },
  list: {
    flex: 12,
  },
  navigation: {
    flex: 4,
  },
  backButton: {
    marginBottom: 64,
  },
});
