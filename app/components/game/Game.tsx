/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useRef } from 'react';
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
import {
  ConnectType,
  IWebSocketMessage,
  WebsocketBoard,
  WebsocketTeam,
} from '@__types/game.type';
import GameLayout from './GameLayout';
// import usePulpitSocket from '@__hooks/usePulpitSocket';

interface IGame {
  sendWebSocketMessage: (message: any) => void;
  websocketMessage?: IWebSocketMessage['payload'] | null;
  webSocketStatus: ConnectType;
}
export const Game: FC<IGame> = ({
  sendWebSocketMessage: sendMessage,
  webSocketStatus: status,
}) => {
  const gameProgress = useAppSelector((state) => state.globalState.gameProgress);
  const gameState = useAppSelector((state) => state.gameState);
  const { blueTeam, redTeam } = useAppSelector((state) => state.teams);

  const { questions } = useAppSelector((state) => state.globalState);
  const { roundNumber } = useAppSelector((state) => state.gameState);

  const { initializeQuestion } = useQuestionState();

  const gameDataRef = useRef({
    redTeam,
    blueTeam,
    board: {
      answers: gameState.currentQuestion.answers,
      question: gameState.currentQuestion.question,
      score: gameState.score,
      roundNumber: gameState.roundNumber,
      gameProgress: gameProgress,
      gameStatus: gameState.gameStatus,
      introMusic: gameState.introMusic,
      stationActive: gameState.startCompetition,
    },
  });

  useEffect(() => {
    console.log('testowy effekt');
    gameDataRef.current = {
      ...gameDataRef.current,
      board: {
        ...gameDataRef.current.board,
        answers: gameState.currentQuestion.answers,
      },
      blueTeam,
      redTeam,
    };
  }, [status, blueTeam, redTeam, gameState.currentQuestion.answers]);

  const dispatch = useAppDispatch();

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
          fault: gameDataRef.current.blueTeam.fault,
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
        totalScore: gameDataRef.current.redTeam.totalScore,
        name: gameDataRef.current.redTeam.name,
        fault: gameDataRef.current.redTeam.fault,
        stationActive: gameDataRef.current.redTeam.stationActive,
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
        totalScore: gameDataRef.current.blueTeam.totalScore,
        name: gameDataRef.current.blueTeam.name,
        fault: gameDataRef.current.blueTeam.fault,
        stationActive: gameDataRef.current.blueTeam.stationActive,
      },
    };

    if (status === 'success') {
      console.log('sendMessage(blue-team)', sendTeam);
      sendMessage(sendTeam);
    }
  }, [status, blueTeam, sendMessage, gameState]);

  useEffect(() => {
    const sendBoard: WebsocketBoard = {
      type: 'board',
      payload: {
        answers: gameDataRef.current.board.answers,
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
