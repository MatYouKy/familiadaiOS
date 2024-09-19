import { useCallback } from 'react';
import { IQuestion } from '@__types/game.type';
import { useAppDispatch } from '@__store/hooks';
import { updateCurrentQuestion } from '@__store/slices/gameState';

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
