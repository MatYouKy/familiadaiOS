import { useAppDispatch, useAppSelector } from '@__store/hooks';
import {
  boardBlockedFunc,
  showEndGameButtonFunc,
  showNextRoundButtonFunc,
  updateCurrentQuestion,
  updateGameScore,
  updateGameStatus,
} from '@__store/slices/gameState';
import {
  blueFaultButtonDisabledFunc,
  blueTeamActive,
  blueTeamActiveButton,
  blueTeamCollectButton,
  clearFaultFunc,
  redFaultButtonDisabledFunc,
  redTeamActive,
  redTeamActiveButton,
  redTeamCollectButton,
} from '@__store/slices/teamsState';
import { IAnswer } from '@__types/game.type';
import checkAnswerVisibility from '@__utils/checksAnswer';
import { useCallback, useEffect, useState } from 'react';

const useLogic = (list: IAnswer[], multiplier: number) => {
  const [currentList, setCurrentList] = useState<IAnswer[]>(list);

  const { gameStatus, currentQuestion, roundNumber } = useAppSelector(
    (state) => state.gameState
  );

  useEffect(() => {
    setCurrentList(list);
  }, [roundNumber, list]);

  const questions = useAppSelector((state) => state.globalState.questions);
  const { blueTeam, redTeam } = useAppSelector((state) => state.teams);

  const dispatch = useAppDispatch();
  const score = useAppSelector((state) => state.gameState.score);

  const toggleAnswer = useCallback(
    (id: string) => {
      const updatedAnswers = currentList.map((answer) => {
        if (answer.id === id && !answer.isVisible) {
          let newTotalScore = score;

          if (gameStatus !== 'SUMMARY-GAME') {
            newTotalScore += answer.score * multiplier;
            dispatch(updateGameScore(newTotalScore));
          }
          return { ...answer, isVisible: true };
        }
        return answer;
      });

      const {
        firstAnswerVisibleAndOthersNot,
        twoAnswersVisible,
        onlyOneVisible,
        allVisible,
      } = checkAnswerVisibility(updatedAnswers);
      dispatch(updateCurrentQuestion({ ...currentQuestion, answers: updatedAnswers }));

      setCurrentList(updatedAnswers);
      if (gameStatus === 'BATTLE') {
        if (firstAnswerVisibleAndOthersNot) {
          if (blueTeam.fault.length === 1) {
            dispatch(boardBlockedFunc(true));
            dispatch(redFaultButtonDisabledFunc(true));
            dispatch(blueFaultButtonDisabledFunc(true));
            const timeout = setTimeout(() => {
              dispatch(redTeamActive(true));
              dispatch(updateGameStatus('GAME'));
              dispatch(redFaultButtonDisabledFunc(false));
              dispatch(boardBlockedFunc(false));
              dispatch(clearFaultFunc());
            }, 3000);
            return () => clearTimeout(timeout);
          } else if (redTeam.fault.length === 1) {
            dispatch(boardBlockedFunc(true));
            dispatch(redFaultButtonDisabledFunc(true));
            dispatch(blueFaultButtonDisabledFunc(true));
            const timeout = setTimeout(() => {
              dispatch(blueTeamActive(true));
              dispatch(updateGameStatus('GAME'));
              dispatch(blueFaultButtonDisabledFunc(false));
              dispatch(boardBlockedFunc(false));
              dispatch(clearFaultFunc());
            }, 3000);
            return () => clearTimeout(timeout);
          } else {
            dispatch(redFaultButtonDisabledFunc(true));
            dispatch(blueFaultButtonDisabledFunc(true));
            dispatch(blueTeamActiveButton(true));
            dispatch(redTeamActiveButton(true));
            dispatch(boardBlockedFunc(true));
          }
        } else if (twoAnswersVisible) {
          dispatch(boardBlockedFunc(true));
          dispatch(blueTeamActiveButton(true));
          dispatch(redTeamActiveButton(true));
          dispatch(redFaultButtonDisabledFunc(true));
          dispatch(blueFaultButtonDisabledFunc(true));
        } else if (onlyOneVisible) {
          if (blueTeam.fault.length === 1) {
            dispatch(boardBlockedFunc(true));
            dispatch(redFaultButtonDisabledFunc(true));
            dispatch(blueFaultButtonDisabledFunc(true));
            const timeout = setTimeout(() => {
              dispatch(redTeamActive(true));
              dispatch(updateGameStatus('GAME'));
              dispatch(redFaultButtonDisabledFunc(false));
              dispatch(boardBlockedFunc(false));
              dispatch(clearFaultFunc());
            }, 3000);
            return () => clearTimeout(timeout);
          } else if (redTeam.fault.length === 1) {
            dispatch(boardBlockedFunc(true));
            dispatch(redFaultButtonDisabledFunc(true));
            dispatch(blueFaultButtonDisabledFunc(true));
            const timeout = setTimeout(() => {
              dispatch(blueTeamActive(true));
              dispatch(updateGameStatus('GAME'));
              dispatch(blueFaultButtonDisabledFunc(false));
              dispatch(boardBlockedFunc(false));
              dispatch(clearFaultFunc());
            }, 3000);
            return () => clearTimeout(timeout);
          }
        }
      } else if (gameStatus === 'GAME') {
        if (allVisible) {
          if (redTeam.isActive) {
            dispatch(redTeamCollectButton(true));
            dispatch(redFaultButtonDisabledFunc(true));
          } else if (blueTeam.isActive) {
            dispatch(blueTeamCollectButton(true));
             dispatch(blueFaultButtonDisabledFunc(true));
          }
        }
      } else if (gameStatus === 'SUMMARY-GAME') {
        if (allVisible) {
          if (roundNumber < questions.length - 1) {
            dispatch(showNextRoundButtonFunc(true));
          } else {
            dispatch(showEndGameButtonFunc(true));
          }
        }
      } else if (gameStatus === 'EXTRA-GAME') {
        if (redTeam.extraGame) {
          dispatch(redTeamCollectButton(true));
          dispatch(redFaultButtonDisabledFunc(true));
          dispatch(boardBlockedFunc(true));
        } else if (blueTeam.extraGame) {
          dispatch(blueTeamCollectButton(true));
          dispatch(blueFaultButtonDisabledFunc(true));
          dispatch(boardBlockedFunc(true));
        }
      }
    },
    [
      currentList,
      multiplier,
      checkAnswerVisibility,
      gameStatus,
      blueTeam.fault,
      redTeam.fault,
      currentQuestion,
      roundNumber,
      questions,
    ]
  );

  return { currentList, toggleAnswer };
};

export default useLogic;
