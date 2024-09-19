import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@__store/hooks';
import { updateGameScore } from '@__store/slices/gameState';
import { updateSession } from '@__store/slices/globalStateReducer';

const useGameState = (setTotalScore: (score: number) => void) => {
  const dispatch = useAppDispatch();
  const { gameStatus } = useAppSelector((state) => state.gameState);

  useEffect(() => {
    if (gameStatus === 'SUMMARY-GAME') {
      setTotalScore(0);
      dispatch(updateGameScore(0));
      dispatch(updateSession(false)); // Zmieniamy sessionActive na false
    }
  }, [gameStatus, dispatch, setTotalScore]);

  return {
    gameStatus,
    dispatch,
  };
};

export default useGameState;
