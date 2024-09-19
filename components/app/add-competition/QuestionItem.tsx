import { colorBase } from '@__colors/colorBase';
import { Divider } from '@__components/ui';
import { IQuestion } from '@__types/game.type';
import React, { FC, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { QuestionFormModal } from '../add-question/question-form/QuestionFormModal';
import { ActionBar } from '@__components/actions/ActionBar';
import { useAppDispatch } from '@__store/hooks';
import { deleteQuestionFromCompetitionFunc } from '@__store/slices/competitionsStateSlice';
import { CustomModal } from '../game/board/modal/CustomModal';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';

interface IQuestionItem {
  question: IQuestion;
  index: number;
}

export const QuestionItem: FC<IQuestionItem> = ({ question, index }) => {
  const [editModal, setEditModal] = useState(false);
  const [removeWarringModal, setRemoveWarringModal] = useState(false);

  const handleEditModal = (action: boolean) => {
    setEditModal(action);
  };

  const dispatch = useAppDispatch();

  const handleDeleteQuestion = (id: string) => {
    dispatch(deleteQuestionFromCompetitionFunc(id));
    dispatch(
      snackbarActionFunc({
        message: `usunąłeś pytanie ${question.question}`,
        status: 'ERROR',
      })
    );
  };

  const handleRemoveWarringModal = (action: boolean) => {
    setRemoveWarringModal(action);
  };
  return (
    <View>
      <View style={styles.answerItem}>
        <View style={styles.answerDetails}>
          <View style={styles.textDetails}>
            <Text style={styles.answerIndex}>{index}.</Text>
            <Text style={styles.answerItemText}>{question.question}</Text>
          </View>
          <View>
            <ActionBar
              size="small"
              handleEditItem={handleEditModal.bind(this, true)}
              handleRemoveItem={handleRemoveWarringModal.bind(this, true)}
            />
          </View>
        </View>
      </View>
      {removeWarringModal && (
        <CustomModal
          warringModal
          openModal={removeWarringModal}
          leftButtonOnPress={handleDeleteQuestion.bind(this, question.id)}
          rigntButtonOnPress={handleRemoveWarringModal.bind(this, false)}
          modalText={`Czy jesteś pewien, że chcesz usunąć pytanie ${question.question}?`}
          leftButtonLabel="usuń"
          rigntButtonLabel="anuluj"
        />
      )}
      {editModal && (
        <QuestionFormModal
          round={index}
          editMode
          openModal={editModal}
          onClose={handleEditModal.bind(this, false)}
          question={question}
        />
      )}
      <Divider color="bluePastel" fullwidth />
    </View>
  );
};

const styles = StyleSheet.create({
  questionInputText: {
    flex: 1,
    color: colorBase.white.default,
    fontSize: 20,
  },
  answerItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    // marginTop: 8,
    marginHorizontal: 48,
  },
  answerIndex: {
    flexDirection: 'column',
    alignItems: 'center',
    color: colorBase.white.default,
    fontStyle: 'italic',
    fontSize: 24,
    width: 42,
  },
  answer: {},
  answerItemText: {
    color: colorBase.white.default,
    fontStyle: 'italic',
    fontSize: 24,
    flex: 1,
  },
  answerItemScore: {
    color: colorBase.white.default,
    fontStyle: 'italic',
    fontSize: 24,
  },
  scoreInputTextValue: {
    textAlign: 'center',
    width: 100,
    color: colorBase.white.default,
    fontSize: 24,
  },
  addNewAnswer: {
    marginVertical: 24,
  },
  answerDetails: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 24,
  },
  textDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  InputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    marginVertical: 24,
  },
  verticalSeparator: {
    width: 2,
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: colorBase.blue.pastel,
  },
});
