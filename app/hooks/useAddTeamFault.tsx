import { useCallback } from 'react';
import { TeamType } from '@__types/game.type';
import {
  blueFaultButtonDisabledFunc,
  blueTeamActive,
  blueTeamCollectButton,
  blueTeamExtraGame,
  clearFaultFunc,
  redFaultButtonDisabledFunc,
  redTeamActive,
  redTeamCollectButton,
  redTeamExtraGame,
  updateBlueTeamChance,
  updateRedTeamChance,
} from '@__store/slices/teamsState';
import { useAppDispatch, useAppSelector } from '@__store/hooks';
import {
  boardBlockedFunc,
  showNextBattleButtonFunc,
  updateGameStatus,
} from '@__store/slices/gameState';
import useAnswerVisibilityChecks from './useAnswerVisibilityChecks';

const useAddTeamFault = () => {
  const dispatch = useAppDispatch();
  const { currentQuestion, gameStatus } = useAppSelector((state) => state.gameState);
  const { allVisible, anyAnswerVisible } = useAnswerVisibilityChecks(
    currentQuestion.answers
  );
  const sessionActive = useAppSelector((state) => state.globalState.sessionActive);

  const { redTeam, blueTeam } = useAppSelector((state) => state.teams);

  const addTeamFault = useCallback(
    (teamType: TeamType) => {
      const currentTeam = teamType === 'BLUE' ? blueTeam : redTeam;
      const opposingTeam = teamType === 'BLUE' ? redTeam : blueTeam;

      if (gameStatus === 'BATTLE') {
        if (!anyAnswerVisible) {
          if (opposingTeam.fault.length === 1) {
            dispatch(showNextBattleButtonFunc(true));
            dispatch(boardBlockedFunc(true));
            dispatch(redFaultButtonDisabledFunc(true));
            dispatch(blueFaultButtonDisabledFunc(true));
          }

          if (teamType === 'BLUE') {
            if (blueTeam.fault.length < 1) {
              dispatch(updateBlueTeamChance({ fault: 'BATTLE' }));
              dispatch(blueFaultButtonDisabledFunc(true));
            }
          } else {
            if (redTeam.fault.length < 1) {
              dispatch(updateRedTeamChance({ fault: 'BATTLE' }));
              dispatch(redFaultButtonDisabledFunc(true));
            }
          }
        } else if (currentTeam.fault.length < 1) {
          if (teamType === 'BLUE') {
            dispatch(updateBlueTeamChance({ fault: 'BATTLE' }));
            dispatch(redFaultButtonDisabledFunc(true));
            dispatch(blueFaultButtonDisabledFunc(true));
            dispatch(boardBlockedFunc(true));
            const timeout = setTimeout(() => {
              dispatch(redTeamActive(true));
              dispatch(updateGameStatus('GAME'));
              dispatch(redFaultButtonDisabledFunc(false));
              dispatch(boardBlockedFunc(false));
              dispatch(clearFaultFunc());
            }, 3000);
            return () => clearTimeout(timeout);
          } else {
            dispatch(updateRedTeamChance({ fault: 'BATTLE' }));
            dispatch(redFaultButtonDisabledFunc(true));
            dispatch(blueFaultButtonDisabledFunc(true));
            dispatch(boardBlockedFunc(true));
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
        if (!currentTeam.isActive) {
          return;
        }
        if (currentTeam.isActive && currentTeam.fault.length < 3) {
          dispatch(
            teamType === 'BLUE'
              ? updateBlueTeamChance({ fault: 'GAME' })
              : updateRedTeamChance({ fault: 'GAME' })
          );

          if (currentTeam.fault.length + 1 === 3) {
            dispatch(
              teamType === 'BLUE' ? redTeamExtraGame(true) : blueTeamExtraGame(true)
            );
            dispatch(
              teamType === 'RED'
                ? blueFaultButtonDisabledFunc(false)
                : redFaultButtonDisabledFunc(false)
            );
            dispatch(updateGameStatus('EXTRA-GAME'));
          }
        } else if (
          currentTeam.extraGame &&
          currentTeam.fault.length < 1 &&
          opposingTeam.isActive
        ) {
          dispatch(
            teamType === 'RED'
              ? updateRedTeamChance({ fault: 'BATTLE' })
              : updateBlueTeamChance({ fault: 'GAME' })
          );
          dispatch(
            teamType === 'RED' ? redTeamExtraGame(false) : blueTeamExtraGame(false)
          );
        } else if (currentTeam.fault.length < 1 && !sessionActive) {
          if (!opposingTeam.isActive) {
            if (teamType === 'RED') {
              dispatch(blueTeamActive(true));
            } else {
              dispatch(redTeamActive(true));
            }

            setTimeout(() => {
              dispatch(clearFaultFunc());
            }, 5000);
          }

          dispatch(
            teamType === 'RED'
              ? updateRedTeamChance({ fault: 'BATTLE' })
              : updateBlueTeamChance({ fault: 'BATTLE' })
          );
        }
      } else if (gameStatus === 'EXTRA-GAME') {
        if (opposingTeam.fault.length === 3) {
          if (opposingTeam.teamType === 'BLUE') {
            dispatch(blueTeamCollectButton(true));
            dispatch(updateRedTeamChance({ fault: 'BATTLE' }));
            dispatch(boardBlockedFunc(true));
          } else {
            dispatch(redTeamCollectButton(true));
            dispatch(updateBlueTeamChance({ fault: 'BATTLE' }));
            dispatch(boardBlockedFunc(true));
          }
        }
      }
    },
    [dispatch, gameStatus, sessionActive, redTeam, blueTeam, allVisible, anyAnswerVisible]
  );

  return addTeamFault;
};

export default useAddTeamFault;
