import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnswerList } from '../answer-list/AnswerList';
import { ActionButton } from '@__components/ui/actions/ActionButton';
import { CustomModal } from './modal/CustomModal';
import { useAppDispatch, useAppSelector } from '@__store/hooks';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import {
  blueFaultButtonDisabledFunc,
  clearFaultFunc,
  nextRoundReset,
  redFaultButtonDisabledFunc,
  resetTeams,
  swapTeamFunc,
} from '@__store/slices/teamsState';
import { colorBase } from '@__colors/colorBase';
import {
  boardBlockedFunc,
  nextQuestion,
  showNextBattleButtonFunc,
  showNextRoundButtonFunc,
  updateGameStatus,
} from '@__store/slices/gameState';
import { updateGameProgress } from '@__store/slices/globalStateReducer';
import { IconButton } from '@__components/ui/actions/iconButtons/IconButton';

export const GameBoard = ({ handleRefresh }: { handleRefresh: () => void }) => {
  const {
    currentQuestion,
    score,
    showNextBattleButton,
    showNextRoundButton,
    showEndGameButton,
    roundNumber,
  } = useAppSelector((state) => state.gameState);

  const { gameProgress } = useAppSelector((state) => state.globalState);

  const [openBackModal, setOpenBackModal] = useState(false);
  const [openSwapModal, setOpenSwapModal] = useState(false);

  const dispatch = useAppDispatch();

  const undoAction = () => {
    dispatch(UndoActionCreators.undo());
  };
  const redoAction = () => {
    dispatch(UndoActionCreators.redo());
  };

  const handleRestartSession = () => {
    dispatch(updateGameProgress('INIT'));
    handleCloseModal();
  };

  const handleTeamSwapModal = (action: boolean) => {
    setOpenSwapModal(action);
  };

  const handleTeamSwap = () => {
    dispatch(swapTeamFunc());
    setOpenSwapModal(false);
  };

  const handleOpenModal = () => {
    setOpenBackModal(true);
  };
  const handleCloseModal = () => {
    setOpenBackModal(false);
  };

  const handleNextBattle = () => {
    dispatch(showNextBattleButtonFunc(false));
    dispatch(dispatch(boardBlockedFunc(false)));
    dispatch(redFaultButtonDisabledFunc(false));
    dispatch(blueFaultButtonDisabledFunc(false));
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
    dispatch(boardBlockedFunc(false));
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
        <AnswerList
          list={currentQuestion.answers}
          multiplier={currentQuestion.multiplier}
        />
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.questionText}>Runda {roundNumber + 1}</Text>

        <View style={styles.navigation}>
          {showNextBattleButton && (
            <ActionButton
              onPress={handleNextBattle}
              title="Następna Bitwa"
              color="backgroundMain"
            />
          )}
          {showNextRoundButton && (
            <ActionButton
              onPress={handleNextRound}
              title="Następna runda"
              backgroundColor="whiteDefault"
              color="backgroundMain"
            />
          )}
          {showEndGameButton && (
            <ActionButton
              onPress={handleEndGame}
              title="Koniec Gry!"
              backgroundColor="whiteDefault"
              color="backgroundMain"
            />
          )}
        </View>
        <View style={styles.actions}>
          <View style={styles.button}>
            <IconButton
              onPress={handleTeamSwapModal.bind(this, true)}
              action="SWAP"
              color="mainGold"
              size="x-large"
              optionalText="zmiana stron"
            />
          </View>
          {gameProgress && (
            <View style={styles.undoRendoActionContainer}>
              <IconButton
                onPress={undoAction}
                action="UNDO"
                color="mainGold"
                size="x-large"
                optionalText="cofnij"
                // disabled={!canUndo}
              />
              <IconButton
                onPress={redoAction}
                action="REDO"
                color="mainGold"
                size="x-large"
                optionalText="naprzód"
                // disabled={!canRedo}
              />
            </View>
          )}
          <View style={styles.button}>
            <IconButton
              onPress={handleRefresh}
              action="REFRESH"
              color="mainGold"
              size="x-large"
              optionalText="odśwież"
            />
          </View>
        </View>
        <ActionButton
          fullwidth
          title="powrót"
          onPress={handleOpenModal}
          backgroundColor="redDark"
          color="whiteDefault"
        />
      </View>
      {openBackModal && (
        <CustomModal
          warringModal
          openModal={openBackModal}
          leftButtonOnPress={handleRestartSession}
          rigntButtonOnPress={handleCloseModal}
          modalText="Jesteś pewien, że chcesz wyjść z gry i rozpocząć sesje od nowa?"
          leftButtonLabel="Wyjdź"
          rigntButtonLabel="Graj Dalej !"
        />
      )}
      {openSwapModal && (
        <CustomModal
          warringModal
          openModal={openSwapModal}
          leftButtonOnPress={handleTeamSwap}
          rigntButtonOnPress={handleTeamSwapModal.bind(this, false)}
          modalText="Czy jesteś pewien, że chcesz zmienić stronami widok drużyn?"
          leftButtonLabel="Zamień"
          rigntButtonLabel="anuluj"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    width: '100%',
  },
  score: {
    flexDirection: 'row',
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
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  questionText: {
    letterSpacing: 2,
    fontSize: 20,
    color: colorBase.whiteDefault,
    textTransform: 'uppercase',
  },
  list: {
    flex: 12,
  },
  navigation: {},
  backButton: {
    width: '100%',
    marginBottom: 64,
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  undoRendoActionContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionWithName: {
    alignItems: 'center',
    borderWidth: 1,
  },
  button: {
    flex: 1,
  },
});
