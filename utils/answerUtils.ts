/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAnswer, IQuestion } from '@__types/game.type';
import { uuid } from './idGenerator';
import Snackbar from 'react-native-snackbar';

  export const showSnackbar = (message: string) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

export const validateAnswers = (answers: IAnswer[]) => {
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  if (totalScore > 90) {
    throw showSnackbar('Suma punktów wszystkich odpowiedzi nie może być większa niż 90');
  }

  if (answers.length < 3) {
    throw showSnackbar('Minimalna liczba odpowiedzi to 3');
  }

  if (answers.length > 6) {
    throw showSnackbar('Maksymalna liczba odpowiedzi to 6');
  }
};

export const updateMultiplier = (answers: IAnswer[]) => {
  if (answers.length === 3) {
    return 3;
  }
  if (answers.length === 4 || answers.length === 5) {
    return 2;
  }
  return 1;
};

interface IAddAnswer {
  currentQuestion: IQuestion;
  setCurrentQuestion: (updatedQuesrion: IQuestion) => void;
  id?: string;
}

export const addAnswer = ({ currentQuestion, setCurrentQuestion }: IAddAnswer) => {
  const newAnswer: IAnswer = {
    id: uuid(),
    score: 0,
    text: '',
  };
  const updatedAnswers = [...currentQuestion.answers, newAnswer];
  try {
    validateAnswers(updatedAnswers);
    setCurrentQuestion({
      ...currentQuestion,
      answers: updatedAnswers,
      multiplier: updateMultiplier(updatedAnswers),
    });
  } catch (error: any) {
    showSnackbar('This is a Snackbar message!');
  }
};

export const removeAnswer = ({ currentQuestion, setCurrentQuestion, id}: IAddAnswer) => {
  const updatedAnswers = currentQuestion.answers.filter((answer) => answer.id !== id);
  try {
    validateAnswers(updatedAnswers);
    setCurrentQuestion({
      ...currentQuestion,
      answers: updatedAnswers,
      multiplier: updateMultiplier(updatedAnswers),
    });
  } catch (error: any) {
    showSnackbar(error.message);
  }
};

export const updateAnswer = (score: number, text: string, {currentQuestion, setCurrentQuestion, id }: IAddAnswer) => {
  const updatedAnswers = currentQuestion.answers.map((answer) =>
    answer.id === id ? { ...answer, score, text } : answer
  );
  try {
    validateAnswers(updatedAnswers);
    setCurrentQuestion({
      ...currentQuestion,
      answers: updatedAnswers,
      multiplier: updateMultiplier(updatedAnswers),
    });
  } catch (error: any) {
    showSnackbar(error.message);
  }
};
