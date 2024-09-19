/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@__store/hooks';
import InitialGame from './initial-game/InitialGame';
import { StartGame } from './start-game/StartGame';

import {
  // resetStations,
  resetTeams,
  startGameTeam,
  // stationBlueActive,
  // stationRedActive,
} from '@__store/slices/teamsState';
import { initialStateFunc } from '@__store/slices/gameState';
import useQuestionState from '@__hooks/useQuestionState';
import { EndGame } from './end-game/EndGame';
import useWebSocket from '@__hooks/useWebSocket';
import { WebsocketBoard, WebsocketTeam } from '@__types/game.type';
import GameLayout from './GameLayout';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';
// import usePulpitSocket from '@__hooks/usePulpitSocket';

interface IGame {
  storedIp: string | null;
}
export const Game: FC<IGame> = ({ storedIp }) => {
  const gameProgress = useAppSelector((state) => state.globalState.gameProgress);
  const gameState = useAppSelector((state) => state.gameState);
  const { blueTeam, redTeam } = useAppSelector((state) => state.teams);

  const dispatch = useAppDispatch();

  const wsUrl = `ws://${storedIp}:2121`;

  const { status, sendMessage } = useWebSocket(wsUrl);

  // const { status: status2, message } = usePulpitSocket();

  const handleRefresh = () => {
    if (status === 'success') {
      const sendRedTeam: WebsocketTeam = {
        type: 'red-team',
        payload: {
          teamType: 'RED',
          totalScore: redTeam.totalScore,
          name: redTeam.name,
          fault: redTeam.fault,
          stationActive: redTeam.stationActive,
        },
      };
      const sendBlueTeam: WebsocketTeam = {
        type: 'blue-team',
        payload: {
          teamType: 'BLUE',
          totalScore: blueTeam.totalScore,
          name: blueTeam.name,
          fault: blueTeam.fault,
          stationActive: blueTeam.stationActive,
        },
      };

      const sendBoard: WebsocketBoard = {
        type: 'board',
        payload: {
          answers: gameState.currentQuestion.answers,
          question: gameState.currentQuestion.question,
          score: gameState.score,
          roundNumber: gameState.roundNumber,
          gameProgress: gameProgress,
          gameStatus: gameState.gameStatus,
          introMusic: gameState.introMusic,
          stationActive: gameState.startCompetition,
        },
      };
      sendMessage(sendRedTeam);
      sendMessage(sendBlueTeam);
      sendMessage(sendBoard);
    }
  };

  useEffect(() => {
    if (status === 'success') {
      dispatch(
        snackbarActionFunc({
          status: 'SUCCESS',
          message: 'Uzyskano połączenie z tablicą odpowiedzi teleturnieju',
        })
      );
    } else if (status === 'close') {
      dispatch(
        snackbarActionFunc({
          status: 'ERROR',
          message: 'Połączenie z tablicą odpowiedzi zostało zamknięte',
        })
      );
    } else if (status === 'error') {
      dispatch(
        snackbarActionFunc({
          status: 'ERROR',
          message: 'Wystąpił nieoczekiwany błąd z połączeniem tablicy wyników',
        })
      );
    } else if (status === 'pending') {
      dispatch(
        snackbarActionFunc({
          status: 'EDIT',
          message: 'Trwa nawiązywanie połączenia z tablicą wyników',
        })
      );
    }
  }, [status]);

  // useEffect(() => {
  //   const newMessage = message as unknown as { blueButton: boolean; redButton: boolean };

  //   if (status2 === 'success' && newMessage) {
  //     if (newMessage.blueButton) {
  //       dispatch(stationBlueActive(true));
  //     } else {
  //       dispatch(stationBlueActive(false));
  //     }

  //     if (newMessage.redButton) {
  //       dispatch(stationRedActive(true));
  //     } else {
  //       dispatch(stationRedActive(false));
  //     }

  //     if (!newMessage.blueButton && !newMessage.redButton) {
  //       dispatch(resetStations());
  //     }
  //   }

  //   if (status2 === 'error') {
  //     dispatch(
  //       snackbarActionFunc({
  //         status: 'ERROR',
  //         message: 'Utracono połączenie ze stanowiskiem do Familiady',
  //       })
  //     );
  //   }
  // }, [message, status2, dispatch]);

  useEffect(() => {
    const sendTeam: WebsocketTeam = {
      type: 'red-team',
      payload: {
        teamType: 'RED',
        totalScore: redTeam.totalScore,
        name: redTeam.name,
        fault: redTeam.fault,
        stationActive: redTeam.stationActive,
      },
    };

    if (status === 'success') {
      sendMessage(sendTeam);
    }
  }, [status, redTeam, sendMessage]);

  useEffect(() => {
    const sendTeam: WebsocketTeam = {
      type: 'blue-team',
      payload: {
        teamType: 'BLUE',
        totalScore: blueTeam.totalScore,
        name: blueTeam.name,
        fault: blueTeam.fault,
        stationActive: blueTeam.stationActive,
      },
    };

    if (status === 'success') {
      sendMessage(sendTeam);
    }
  }, [status, blueTeam, sendMessage, gameState]);

  useEffect(() => {
    const sendBoard: WebsocketBoard = {
      type: 'board',
      payload: {
        answers: gameState.currentQuestion.answers,
        question: gameState.currentQuestion.question,
        score: gameState.score,
        roundNumber: gameState.roundNumber,
        gameProgress: gameProgress,
        gameStatus: gameState.gameStatus,
        introMusic: gameState.introMusic,
        stationActive: gameState.startCompetition,
      },
    };

    if (status === 'success') {
      sendMessage(sendBoard);
    }
  }, [status, gameState, gameProgress, sendMessage]);

  const { questions } = useAppSelector((state) => state.globalState);
  const { roundNumber } = useAppSelector((state) => state.gameState);

  const { initializeQuestion } = useQuestionState();

  useEffect(() => {
    if (gameProgress === 'INIT') {
      dispatch(resetTeams());
      dispatch(startGameTeam());
      dispatch(initialStateFunc());
    }

    if (questions.length && roundNumber < questions.length) {
      initializeQuestion(questions[roundNumber]);
    }
  }, [questions, gameProgress, roundNumber, initializeQuestion, dispatch]);

  if (gameProgress === 'START') {
    return <StartGame />;
  }
  if (gameProgress === 'INIT') {
    return <InitialGame />;
  }
  if (gameProgress === 'END') {
    return <EndGame />;
  }

  return (
    <GameLayout blueTeam={blueTeam} redTeam={redTeam} handleRefresh={handleRefresh} />
  );
};
