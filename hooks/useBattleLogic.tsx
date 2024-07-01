import { useEffect } from 'react';
import {
  clearFaultFunc,
  redTeamActive,
  blueTeamActive,
  redTeamActiveButton,
  blueTeamActiveButton,
  redTeamCollectButton,
  blueTeamCollectButton,
  redFaultButtonDisabledFunc,
  blueFaultButtonDisabledFunc,
} from '../store/slices/teamsState';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import useAnswerVisibilityChecks from './useAnswerVisibilityChecks';
import {
  showEndGameButtonFunc,
  showNextRoundButtonFunc,
  updateGameStatus,
} from '../store/slices/gameState';

const useBattleLogic = () => {
  const dispatch = useAppDispatch();
  const { blueTeam, redTeam } = useAppSelector((state) => state.teams);
  const { currentQuestion, gameStatus, roundNumber } = useAppSelector(
    (state) => state.gameState
  );
  const { questions } = useAppSelector((state) => state.globalState);
  const {
    firstAnswerVisibleAndOthersNot,
    twoAnswersVisible,
    anyAnswerVisible,
    allVisible,
  } = useAnswerVisibilityChecks(currentQuestion.answers);

  useEffect(() => {
    if (gameStatus === 'BATTLE') {
      if (firstAnswerVisibleAndOthersNot) {
        if (blueTeam.fault.length && !redTeam.isActive) {
          dispatch(updateGameStatus('GAME'));
          dispatch(redTeamActive(true));
          dispatch(clearFaultFunc());
        } else if (redTeam.fault.length && !blueTeam.isActive) {
          dispatch(updateGameStatus('GAME'));
          dispatch(blueTeamActive(true));
          dispatch(clearFaultFunc());
        } else if (!blueTeam.isActive && !redTeam.isActive) {
          dispatch(updateGameStatus('BOARD-BLOCKED'));
          dispatch(redTeamActiveButton(true));
          dispatch(blueTeamActiveButton(true));
        }
      } else if (blueTeam.fault.length === 1 && redTeam.fault.length === 1) {
        dispatch(updateGameStatus('BOARD-BLOCKED'));
      } else if (anyAnswerVisible) {


        if (blueTeam.fault.length || redTeam.fault.length) {
          dispatch(redFaultButtonDisabledFunc(true));
          dispatch(blueFaultButtonDisabledFunc(true));
          dispatch(updateGameStatus('BOARD-BLOCKED'));
          setTimeout(() => {
            dispatch(updateGameStatus('GAME'));
            if (blueTeam.fault.length) {
              dispatch(redTeamActive(true));
              dispatch(clearFaultFunc());
            } else if (redTeam.fault.length) {
              dispatch(blueTeamActive(true));
              dispatch(clearFaultFunc());
            }
            dispatch(clearFaultFunc());
            dispatch(redFaultButtonDisabledFunc(false));
            dispatch(blueFaultButtonDisabledFunc(false));
            dispatch(updateGameStatus('GAME'));
          }, 5000);
        } else if (blueTeam.fault.length === 1) {
          dispatch(redTeamActive(true));
          dispatch(clearFaultFunc());
        } else if (redTeam.fault.length === 1) {
          dispatch(blueTeamActive(true));
          dispatch(clearFaultFunc());
        } else if (twoAnswersVisible) {
          dispatch(redTeamActiveButton(true));
          dispatch(blueTeamActiveButton(true));
          dispatch(updateGameStatus('BOARD-BLOCKED'));
        }
      }
    } else if (gameStatus === 'GAME' && allVisible) {
      if (redTeam.isActive) {
        dispatch(redTeamCollectButton(true));
        dispatch(updateGameStatus('BOARD-BLOCKED'));
        dispatch(blueTeamActiveButton(false));
        dispatch(redTeamActiveButton(false));
        return;
      } else {
        dispatch(blueTeamCollectButton(true));
        dispatch(updateGameStatus('BOARD-BLOCKED'));
        dispatch(blueTeamActiveButton(false));
        dispatch(redTeamActiveButton(false));
        return;
      }
    } else if (gameStatus === 'SUMMARY-GAME') {
      dispatch(redTeamCollectButton(false));
      dispatch(blueTeamCollectButton(false));
      if (allVisible) {
        if (roundNumber < questions.length - 1) {
          dispatch(showNextRoundButtonFunc(true));
        } else {
          dispatch(showEndGameButtonFunc(true));
        }
      }
    } else if (
      gameStatus === 'BOARD-BLOCKED' &&
      (redTeam.fault.length || blueTeam.fault.length)
    ) {
      dispatch(blueTeamActiveButton(false));
      dispatch(redTeamActiveButton(false));
    }
  }, [
    dispatch,
    currentQuestion,
    gameStatus,
    anyAnswerVisible,
    twoAnswersVisible,
    firstAnswerVisibleAndOthersNot,
    blueTeam,
    redTeam,
    allVisible,
    roundNumber,
    questions,
  ]);
};

export default useBattleLogic;
