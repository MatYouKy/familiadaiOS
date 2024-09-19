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
  resetStations,
} from '@__store/slices/teamsState';
import { useAppDispatch, useAppSelector } from '@__store/hooks';
import useAnswerVisibilityChecks from './useAnswerVisibilityChecks';
import {
  showEndGameButtonFunc,
  showNextRoundButtonFunc,
  updateGameStatus,
} from '@__store/slices/gameState';

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
          // const timeout = setTimeout(() => {
            dispatch(redTeamActive(true));
            dispatch(resetStations());
            dispatch(updateGameStatus('GAME'));
            dispatch(clearFaultFunc());
          // }, 3000);
          // return () => clearTimeout(timeout);
        } else if (redTeam.fault.length && !blueTeam.isActive) {
          // const timeout = setTimeout(() => {
            dispatch(updateGameStatus('GAME'));
            dispatch(blueTeamActive(true));
            dispatch(clearFaultFunc());
            dispatch(resetStations());
          // }, 3000);
          // return () => clearTimeout(timeout);
        } else if (!blueTeam.isActive && !redTeam.isActive) {
          dispatch(redTeamActiveButton(true));
          dispatch(blueTeamActiveButton(true));
        }
      } else if (blueTeam.fault.length === 1 && redTeam.fault.length === 1) {
        dispatch(updateGameStatus('BOARD-BLOCKED'));
      } else if (anyAnswerVisible) {


        if (blueTeam.fault.length || redTeam.fault.length) {
          dispatch(redFaultButtonDisabledFunc(true));
          dispatch(blueFaultButtonDisabledFunc(true));
          // dispatch(updateGameStatus('BOARD-BLOCKED'));
          // const timeout = setTimeout(() => {
            dispatch(updateGameStatus('GAME'));
            if (blueTeam.fault.length) {
              dispatch(redTeamActive(true));
              dispatch(clearFaultFunc());
            } else if (redTeam.fault.length) {
              dispatch(blueTeamActive(true));
              dispatch(clearFaultFunc());
            }
            dispatch(resetStations());
            dispatch(clearFaultFunc());
            dispatch(redFaultButtonDisabledFunc(false));
            dispatch(blueFaultButtonDisabledFunc(false));
            dispatch(updateGameStatus('GAME'));
          // }, 3000);
          // return clearTimeout(timeout);
        } else if (blueTeam.fault.length === 1) {
          dispatch(redTeamActive(true));
          dispatch(clearFaultFunc());
          dispatch(resetStations());
        } else if (redTeam.fault.length === 1) {
          dispatch(blueTeamActive(true));
          dispatch(clearFaultFunc());
          dispatch(resetStations());
        } else if (twoAnswersVisible) {
          dispatch(redTeamActiveButton(true));
          dispatch(blueTeamActiveButton(true));
          dispatch(updateGameStatus('BOARD-BLOCKED'));
        }
      }
    } else if (gameStatus === 'GAME' && allVisible) {
      if (redTeam.isActive) {
        dispatch(updateGameStatus('BOARD-BLOCKED'));
        dispatch(redTeamCollectButton(true));
        dispatch(blueTeamActiveButton(false));
        dispatch(redTeamActiveButton(false));
      } else {
        dispatch(updateGameStatus('BOARD-BLOCKED'));
        dispatch(blueTeamCollectButton(true));
        dispatch(blueTeamActiveButton(false));
        dispatch(redTeamActiveButton(false));
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
