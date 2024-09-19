import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@__store/hooks';
import {
  updateCurrentQuestion,
  updateGameScore,
  updateGameStatus,
} from '@__store/slices/gameState';
import useBattleLogic from './useBattleLogic';
import { blueTeamCollectButton, redTeamCollectButton } from '@__store/slices/teamsState';

const useAnswerVisibility = () => {
  const dispatch = useAppDispatch();
  useBattleLogic();
  const { currentQuestion, score, gameStatus } = useAppSelector(
    (state) => state.gameState
  );
  const { blueTeam, redTeam } = useAppSelector((state) => state.teams);
  const { sessionActive, gameProgress } = useAppSelector((state) => state.globalState);
  const redHasFault = !!redTeam.fault.length;
  const blueHasFault = !!blueTeam.fault.length;

  const toggleAnswerVisibility = useCallback(
    (answerId: string) => {
      if (!currentQuestion) return;

      if (gameStatus === 'BOARD-BLOCKED') {
        return;
      }
      if (gameStatus === 'EXTRA-GAME') {
        if (redHasFault) {
          dispatch(blueTeamCollectButton(true));
        } else {
          dispatch(redTeamCollectButton(true));
        }
        dispatch(updateGameStatus('BOARD-BLOCKED'));
      }

      const updatedAnswers = currentQuestion.answers.map((answer) => {
        if (answer.id === answerId && !answer.isVisible) {
          let newTotalScore = score;

          if (gameStatus !== 'SUMMARY-GAME') {
            newTotalScore += answer.score * currentQuestion.multiplier;
            dispatch(updateGameScore(newTotalScore));
          }
          return { ...answer, isVisible: true };
        }
        return answer;
      });

      const updatedQuestion = {
        ...currentQuestion,
        answers: updatedAnswers,
      };

      dispatch(updateCurrentQuestion(updatedQuestion));
    },
    [
      currentQuestion,
      score,
      dispatch,
      gameStatus,
      redHasFault,
      blueHasFault,
      gameProgress,
      sessionActive,
    ]
  );

  return {
    toggleAnswerVisibility,
  };
};

export default useAnswerVisibility;
