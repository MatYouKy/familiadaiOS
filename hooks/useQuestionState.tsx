import { useCallback } from 'react';
import { IQuestion } from '../types/game.type';
import { useAppDispatch } from '../store/hooks';
import { updateCurrentQuestion } from '../store/slices/gameState';

const useQuestionState = () => {
  const dispatch = useAppDispatch();

  const initializeQuestion = useCallback((initialQuestion: IQuestion) => {
    const initializedQuestion = {
      ...initialQuestion,
      answers: initialQuestion.answers.map((answer) => ({
        ...answer,
        isVisible: false,
      })),
    };
    dispatch(updateCurrentQuestion(initializedQuestion));
  }, []);

  return {
    initializeQuestion,
  };
};

export default useQuestionState;
