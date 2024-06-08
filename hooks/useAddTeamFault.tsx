import { useCallback } from 'react';
import { TeamType } from '../types/game.type';
import {
  blueTeamActive,
  blueTeamCollectButton,
  blueTeamExtraGame,
  clearFaultFunc,
  redTeamActive,
  redTeamCollectButton,
  redTeamExtraGame,
  updateBlueTeamChance,
  updateRedTeamChance,
} from '../store/slices/teamsState';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showNextBattleButtonFunc, updateGameStatus } from '../store/slices/gameState';
import useAnswerVisibilityChecks from './useAnswerVisibilityChecks';

const useAddTeamFault = () => {
  const dispatch = useAppDispatch();
  const { currentQuestion, gameStatus } = useAppSelector((state) => state.gameState);
  const { allVisible } = useAnswerVisibilityChecks(currentQuestion.answers);

  const sessionActive = useAppSelector((state) => state.globalState.sessionActive);

  const redTeam = useAppSelector((state) => state.teams.redTeam);
  const blueTeam = useAppSelector((state) => state.teams.blueTeam);

  const addTeamFault = useCallback(
    (teamType: TeamType) => {
      const currentTeam = teamType === 'BLUE' ? blueTeam : redTeam;
      const opposingTeam = teamType === 'BLUE' ? redTeam : blueTeam;

      if (gameStatus === 'BATTLE') {
        if (currentTeam.fault.length < 1) {
          dispatch(
            teamType === 'BLUE'
              ? updateBlueTeamChance({ fault: 'BATTLE' })
              : updateRedTeamChance({ fault: 'BATTLE' })
          );
          if (opposingTeam.fault.length === 1) {
            dispatch(showNextBattleButtonFunc(true));
            dispatch(updateGameStatus('BOARD-BLOCKED'));
          }
        }
      } else if (gameStatus === 'GAME') {
        if (!currentTeam.isActive) {
          return
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
            }
          } else if (
            currentTeam.extraGame &&
            currentTeam.fault.length < 1 &&
            opposingTeam.isActive
          ) {
            // Allow one fault for the non-active team with extraGame
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
        if (teamType === 'RED' && redTeam.fault.length < 1) {
          dispatch(updateRedTeamChance({ fault: 'BATTLE' }));
          dispatch(blueTeamCollectButton(true));
          dispatch(redTeamCollectButton(false));
          dispatch(updateGameStatus('BOARD-BLOCKED'));
        } else if (teamType === 'BLUE' && blueTeam.fault.length < 1) {
          dispatch(updateBlueTeamChance({ fault: 'BATTLE' }));
          dispatch(redTeamCollectButton(true));
          dispatch(blueTeamCollectButton(false));
          dispatch(updateGameStatus('BOARD-BLOCKED'));
        }
      }
    },
    [dispatch, gameStatus, sessionActive, redTeam, blueTeam, allVisible]
  );

  return addTeamFault;
};

export default useAddTeamFault;
