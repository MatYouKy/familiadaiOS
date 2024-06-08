import React, { FC, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { colorBase } from '../../../colors/colorBase';
import { ICompetition } from '../../../types/game.type';
import { QuestionModal } from './QuestionModal';
import { useAppDispatch } from '../../../store/hooks';
import {
  startGame,
  updateGameProgress,
} from '../../../store/slices/globalStateReducer';
import { ActionButton } from '../../ui/actions/ActionButton';
import { startGameTeam } from '../../../store/slices/teamsState';

interface ICompetitionItem {
  competition: ICompetition;
}
export const CompetitionItem: FC<ICompetitionItem> = ({ competition }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const dispatch = useAppDispatch();

  const openModal = () => {
    setShowAnswers((prew) => !prew);
  };
  const closeModal = () => {
    setShowAnswers((prew) => !prew);
  };

  const addQuestionForGame = () => {
    closeModal();
    dispatch(startGame(competition.questions));
    dispatch(startGameTeam());
    dispatch(updateGameProgress('START'));
  };

  const answersList = competition.questions.map((answer) => {
    return (
      <View key={answer.question} style={styles.listItem}>
        <Text>{answer.question}</Text>
      </View>
    );
  });
  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{competition.eventDate}</Text>
      <Text style={{ ...styles.listItemText, flex: 1 }}>
        {competition.competitionTitle}
      </Text>
      <View style={styles.buttonsWrapper}>
        <View style={styles.showButton}>
          <Button
            color={colorBase.mainGold}
            title="Zobacz Pytania"
            onPress={openModal}
          />
        </View>
        <View style={styles.showButton}>
          <ActionButton
            title="Zagraj"
            onPress={addQuestionForGame}
            size="x-small"
            backgroundColor="successLight"
          />
        </View>
      </View>
      {showAnswers && answersList}
      <QuestionModal
        isOpen={showAnswers}
        closeModal={closeModal}
        competition={competition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 24,
    padding: 16,
  },
  listItemText: {
    color: colorBase.white,
  },
  showButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonsWrapper: {
    flexDirection: 'row',
    gap: 48,
  },
});
