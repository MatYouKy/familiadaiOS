import { colorBase } from '@__colors/colorBase';
import { ActionButton, Divider } from '@__components/ui';
import { IAnswer, IQuestion } from '@__types/game.type';
import { uuid } from '@__utils/idGenerator';
import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { QuestionTextModal } from './QuestionTextModal';
import { AddAnswersList } from './AddAnswersList';
import { AnswerModal } from './AnswerModal';
import { IconButton } from '@__components/ui/actions/iconButtons/IconButton';
import { useAppDispatch, useAppSelector } from '@__store/hooks';
import {
  addQuestionToCompetitionFunc,
  editQuestionFromCompetitionFunc,
} from '@__store/slices/competitionsStateSlice';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';
import { Snackbar } from 'react-native-paper';

export type FormAnswerType = Omit<IAnswer, 'score'> & { score: string };
export type FormQuestionType = Omit<IQuestion, 'answers'> & { answers: FormAnswerType[] };

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return [isOpen, open, close] as const;
};

interface IQuestionFormModal {
  openModal: boolean;
  onClose: () => void;
  question?: IQuestion;
  editMode?: boolean;
  round?: number;
}

const roundAnswerLimits = [6, 6, 5, 4, 3, 3];

export const QuestionFormModal: FC<IQuestionFormModal> = ({
  editMode = false,
  onClose,
  question,
  openModal,
  round = 1,
}) => {
  const dispatch = useAppDispatch();
  const initialQuestion: IQuestion = {
    answers: [],
    id: uuid(),
    multiplier: 1,
    question: '',
  };
  const [newAnswer, setNewAnswer] = useState<FormAnswerType>({
    id: '',
    score: '',
    text: '',
  });

  const [newQuestion, setNewQuestion] = useState<IQuestion>(() => {
    return question && editMode ? question : initialQuestion;
  });

  const [answerModalOpen, openAnswerModal, closeAnswerModal] = useModal();
  const [answerEditModalOpen, openAnswerEditModal, closeAnswerEditModal] = useModal();
  const [questionTextModalOpen, openQuestionTextModal, closeQuestionTextModal] =
    useModal();

  const snackbarState = useAppSelector((state) => state.snackbarAction);

  const [errorText, setErrorText] = useState<string>('');

  useEffect(() => {
    if (question && editMode) {
      setNewQuestion(question);
    }
  }, [question, editMode]);

  useEffect(() => {
    setErrorText('');
    setNewQuestion((prev) => {
      const updatedMultiplier =
        roundAnswerLimits[round - 1] === 6
          ? 1
          : roundAnswerLimits[round - 1] <= 5 && roundAnswerLimits[round - 1] >= 4
            ? 2
            : 3;
      return { ...prev, multiplier: updatedMultiplier };
    });
  }, [round]);

  const handleAddAnswer = () => {
    setNewAnswer({ id: uuid(), score: '0', text: '' });
    openAnswerModal();
  };

  const handleEditAnswer = (id: string) => {
    const filterAnswer = newQuestion.answers.find((answer) => answer.id === id);
    if (filterAnswer) {
      setNewAnswer({ ...filterAnswer, score: `${filterAnswer.score}` });
      openAnswerEditModal();
    }
  };

  const handleChangeAnswerText = (inputIdentifier: string, value: string) => {
    setNewAnswer((prev) => ({ ...prev, [inputIdentifier]: value }));
  };

  const handleChangeQuestionText = (value: string) => {
    setNewQuestion((prev) => ({ ...prev, question: value }));
  };

  const updateAnswers = (answers: IAnswer[], updatedAnswer: IAnswer): IAnswer[] => {
    const index = answers.findIndex((answer) => answer.id === updatedAnswer.id);
    if (index !== -1) {
      const newAnswers = [...answers];
      newAnswers[index] = updatedAnswer;
      return newAnswers.sort((a, b) => b.score - a.score);
    }
    return answers;
  };

  const handleAddNewAnswer = () => {
    const newAnswerWithId = {
      ...newAnswer,
      id: uuid(),
      score: parseInt(newAnswer.score),
    };
    setNewQuestion((prev) => ({
      ...prev,
      answers: [...prev.answers, newAnswerWithId].sort((a, b) => b.score - a.score),
    }));
    setNewAnswer({ id: uuid(), score: '0', text: '' });
    closeAnswerModal();
  };

  const handleUpdateAnswer = (updateAnswer: FormAnswerType) => {
    const updatedAnswer = { ...updateAnswer, score: parseInt(updateAnswer.score) };
    const answers = newQuestion.answers;

    const updatedAnswers = updateAnswers(answers, updatedAnswer);
    const updatedQuestion = { ...newQuestion, answers: updatedAnswers };

    dispatch(editQuestionFromCompetitionFunc(updatedQuestion));
    closeAnswerEditModal();
  };

  const handleRemoveAnswer = (id: string) => {
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      answers: prevQuestion.answers.filter((answer) => answer.id !== id),
    }));
  };

  const handleSubmit = () => {
    if (newQuestion.answers.length !== roundAnswerLimits[round - 1]) {
      setErrorText(
        `Runda ${round} powinna mieć ${roundAnswerLimits[round - 1]} odpowiedzi.`
      );
      return;
    }

    if (editMode) {
      dispatch(editQuestionFromCompetitionFunc(newQuestion));
      dispatch(
        snackbarActionFunc({
          message: 'Poprawnie zaktualizowałeś wydarzenie!',
          status: 'EDIT',
        })
      );
    } else {
      dispatch(addQuestionToCompetitionFunc(newQuestion));
      dispatch(
        snackbarActionFunc({
          message: 'Poprawnie dodałeś wydarzenie!',
          status: 'SUCCESS',
        })
      );
    }
    onClose();
  };

  return (
    <Modal visible={openModal} animationType="slide">
      <View style={styles.questionForm}>
        <View style={styles.heading}>
          <Text style={styles.headingText}>Formularz Pytania</Text>
          <Divider height={2} />
        </View>
        <View style={styles.content}>
          <View style={styles.questionTextWrapper}>
            <Text style={styles.contentText}>Pytanie:</Text>
            <Pressable onPress={openQuestionTextModal}>
              <View style={styles.questionInputTextWrapper}>
                <Text style={styles.questionInputText}>{newQuestion.question}</Text>
              </View>
            </Pressable>
            <QuestionTextModal
              openQuestionTextModal={questionTextModalOpen}
              value={newQuestion.question}
              handleOpenQuestionTextModaAction={closeQuestionTextModal}
              handleChangeQuestionText={handleChangeQuestionText}
            />
          </View>
          <View>
            <Divider height={2} fullwidth />
          </View>
          <View style={styles.secondHeading}>
            <Text style={styles.headingText}>Odpowiedzi:</Text>
          </View>
          <View style={styles.answersTextWrapper}>
            <AddAnswersList
              answers={newQuestion.answers}
              addAnswerValue={newAnswer}
              handleEditAnswer={handleEditAnswer}
              handleChangeAnswerText={handleChangeAnswerText}
              handleNewAnswerText={handleAddNewAnswer}
              handleRemoveAnswer={handleRemoveAnswer}
            />
            {newQuestion.answers.length < roundAnswerLimits[round - 1] && (
              <View style={styles.addNewAnswer}>
                <IconButton
                  action="ADD"
                  onPress={handleAddAnswer}
                  color="mainGold"
                  size="medium"
                />
              </View>
            )}
          </View>
        </View>
        {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        {answerModalOpen && (
          <AnswerModal
            modalAction={{ onClose: closeAnswerModal, isOpen: answerModalOpen }}
            answer={newAnswer}
            answerHandler={handleAddNewAnswer}
            handleInputText={handleChangeAnswerText}
          />
        )}
        {answerEditModalOpen && (
          <AnswerModal
            editMode
            modalAction={{ onClose: closeAnswerEditModal, isOpen: answerEditModalOpen }}
            answer={newAnswer}
            handleInputText={handleChangeAnswerText}
            handleUpdateAnswer={handleUpdateAnswer}
          />
        )}
        <View style={styles.actionButtons}>
          <ActionButton
            onPress={onClose}
            variant="OUTLINED"
            backgroundColor="redDark"
            title="Anuluj"
          />
          {newQuestion.answers.length !== 0 &&
            newQuestion.answers.length === roundAnswerLimits[round - 1] && (
              <ActionButton
                onPress={handleSubmit}
                backgroundColor="successMain"
                title={editMode ? 'Zapisz zmiany' : 'Dodaj pytanie do wydarzenia!'}
              />
            )}
        </View>
      </View>
      <Snackbar
        visible={snackbarState.message !== ''}
        style={{ position: 'absolute' }}
        onDismiss={function (): void {
          throw new Error('Function not implemented.');
        }}
      >
        <Text>Dupa</Text>
      </Snackbar>
    </Modal>
  );
};

const styles = StyleSheet.create({
  questionForm: {
    backgroundColor: colorBase.backgroundMain,
    flex: 1,
    padding: 48,
  },
  heading: {
    width: '100%',
    flex: 2,
  },
  secondHeading: {
    flex: 2,
  },
  headingText: {
    textAlign: 'center',
    fontSize: 24,
    color: colorBase.whiteDefault,
    marginVertical: 16,
  },
  content: {
    flex: 20,
  },
  contentText: {
    fontSize: 24,
    color: colorBase.whiteDefault,
  },
  questionTextWrapper: {
    flexDirection: 'row',
    marginTop: 24,
  },
  questionInputTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 16,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: colorBase.bluePastel,
  },
  questionInputText: {
    width: '90%',
    color: colorBase.whiteDefault,
    fontStyle: 'italic',
    fontSize: 24,
  },
  addNewAnswer: {
    marginVertical: 24,
  },
  answersTextWrapper: {
    flex: 16,
    gap: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});
