import React, { FC } from 'react';
import { FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import { colorBase } from '../../../colors/colorBase';
import { ICompetition } from '../../../types/game.type';
import { Divider } from '../../ui/divider/Divider';
import { useAppDispatch } from '../../../store/hooks';
import {
  startGame,
  updateGameProgress,
} from '../../../store/slices/globalStateReducer';
import { ActionButton } from '../../ui/actions/ActionButton';
import { AnswerRenderList } from './AnswerRenderList';
import { startGameTeam } from '../../../store/slices/teamsState';

interface IQuestionModal {
  isOpen: boolean;
  closeModal: (isOpen: boolean) => void;
  competition: ICompetition;
}

export const QuestionModal: FC<IQuestionModal> = ({
  closeModal,
  isOpen,
  competition,
}) => {
  const { competitionTitle, eventDate, questions } = competition;

  const dispatch = useAppDispatch();

  const addQuestionForGame = () => {
    closeModal(false);
    dispatch(startGame(competition.questions));
    dispatch(startGameTeam());
    dispatch(updateGameProgress('START'));
  };

  return (
    <Modal visible={isOpen} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.inputWrapper}>
          <View style={styles.heading}>
            <Text style={styles.inputHeading}>Realizacja {eventDate}</Text>
            <Divider />
            <Text style={styles.inputHeading}>{competitionTitle}</Text>
          </View>
          <View style={styles.answersList}>
            <FlatList
              data={questions}
              keyExtractor={(item) => {
                return item.id as string;
              }}
              renderItem={(question) => {
                return (
                  <View
                    style={styles.answersListWrapper}
                    key={question.item.id}
                  >
                    <View style={styles.questionHeadingWrapper}>
                      <Text style={styles.questionHeading}>
                        {question.item.question}
                      </Text>
                    </View>
                    <AnswerRenderList answers={question.item.answers} />
                    <Divider fullwidth />
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={styles.buttonsWrapper}>
          <ActionButton
            title="Zamknij"
            onPress={() => closeModal(false)}
            size="small"
            backgroundColor="redDefault"
          />
          <ActionButton
            title="Zagraj"
            onPress={addQuestionForGame}
            size="small"
            backgroundColor="successLight"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  questionHeading: {
    color: colorBase.white,
    fontSize: 16,
    marginVertical: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colorBase.background.main,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    height: 60,
    gap: 16,
  },
  inputWrapper: {
    overflow: 'hidden',
    height: 800,
    width: '80%',
    padding: 48,
    borderWidth: 4,
    borderColor: colorBase.mainGold,
    borderRadius: 36,
    alignItems: 'center',
  },
  answersList: {
    width: '100%',
    marginVertical: 48,

  },
  inputHeading: {
    textAlign: 'center',
    top: 0,
    color: colorBase.white,
    textTransform: 'uppercase',
    fontSize: 24,
    letterSpacing: 2,
  },
  inputForm: {
    marginBottom: 16,
    padding: 8,
    minWidth: 500,
    borderColor: colorBase.mainGold,
    borderWidth: 2,
    borderRadius: 8,
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    width: 'auto',
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
    marginTop: 24,
    borderColor: colorBase.background.dark,
    backgroundColor: colorBase.mainGold,
  },
  answersListWrapper: {
    marginTop: 8,
  },
  questionHeadingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  buttonsWrapper: {
    marginTop: 24,
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});
