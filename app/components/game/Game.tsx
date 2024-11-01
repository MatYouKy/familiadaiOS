/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@__store/hooks';
import InitialGame from './initial-game/InitialGame';
import { StartGame } from './start-game/StartGame';
import WifiManager from 'react-native-wifi-reborn';

import {
  resetStations,
  resetTeams,
  startGameTeam,
  stationBlueActive,
  stationRedActive,
} from '@__store/slices/teamsState';
import { initialStateFunc } from '@__store/slices/gameState';
import useQuestionState from '@__hooks/useQuestionState';
import { EndGame } from './end-game/EndGame';
import {
  ConnectType,
  ITeam,
  IWebSocketMessage,
  WebsocketBoard,
  WebsocketTeam,
} from '@__types/game.type';
import GameLayout from './GameLayout';
import { DevicesType } from '@__types/connect.type';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';
import { useCustomWebsocket } from '@__hooks/useCustomWebsocket';
import { desktopActiveActionFunc, pulpitActiveActionFunc } from '@__store/slices/devicesStateSlice';

interface IGame {
  sendWebSocketMessage: (message: any) => void;
  websocketMessage?: IWebSocketMessage['payload'] | null;
  webSocketStatus: ConnectType;
  connectedDevices: {
    id: string;
    type: DevicesType;
  }[];
}
export const Game: FC<IGame> = ({
  sendWebSocketMessage: sendMessage,
  webSocketStatus: status,
  connectedDevices,
}) => {
  const { gameProgress } = useAppSelector((state) => state.globalState);
  const gameState = useAppSelector((state) => state.gameState);
  const { blueTeam, redTeam } = useAppSelector((state) => state.teams);

  const { questions } = useAppSelector((state) => state.globalState);
  const { roundNumber } = useAppSelector((state) => state.gameState);

  const { initializeQuestion } = useQuestionState();

  const teamsDataRef = useRef<{ redTeam: ITeam; blueTeam: ITeam }>({
    redTeam,
    blueTeam,
  });

  useEffect(() => {
    teamsDataRef.current = {
      ...teamsDataRef.current,
      blueTeam,
      redTeam,
    };
  }, [status, blueTeam, redTeam, gameState]);

  useEffect(() => {
    handleRefresh();
  }, [connectedDevices]);

  useEffect(() => {
    const isDesktopActive = connectedDevices.some(
      (device) => device.type === 'GAME-BOARD'
    );
    dispatch(desktopActiveActionFunc(isDesktopActive));
  }, [connectedDevices]);

  const dispatch = useAppDispatch();

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
          fault: teamsDataRef.current.blueTeam.fault,
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

  const { webSocketStatus, connectWebSocket, buttonState } = useCustomWebsocket(
    'PULPIT',
    '192.168.0.26',
    82
  );

  useEffect(() => {
    const checkSSIDAndConnect = async () => {
      try {
        const currentSSID = await WifiManager.getCurrentWifiSSID();
        if (currentSSID === 'FAMILIADA') {
          dispatch(
            snackbarActionFunc({
              message: 'Correct SSID detected, connecting WebSocket...',
              status: 'SUCCESS',
            })
          );
          connectWebSocket();
          dispatch(pulpitActiveActionFunc(true));
        } else {
          dispatch(
            snackbarActionFunc({
              message: 'Not connected to FAMILIADA network. WebSocket not connected.',
              status: 'ERROR',
            })
          );
          dispatch(pulpitActiveActionFunc(false));
        }
      } catch (error) {
        dispatch(pulpitActiveActionFunc(false));
      }
    };
    checkSSIDAndConnect();
  }, [connectWebSocket]);

  useEffect(() => {
    if (webSocketStatus === 'success') {
      if (buttonState.blueButton) {
        dispatch(stationBlueActive(true));
      } else {
        dispatch(stationBlueActive(false));
      }

      if (buttonState.redButton) {
        dispatch(stationRedActive(true));
      } else {
        dispatch(stationRedActive(false));
      }

      if (!buttonState.blueButton && !buttonState.redButton) {
        dispatch(resetStations());
      }
    }

    if (webSocketStatus === 'error') {
      dispatch(
        snackbarActionFunc({
          status: 'ERROR',
          message: 'Utracono połączenie ze stanowiskiem do Familiady',
        })
      );
    }
  }, [buttonState, webSocketStatus, dispatch, gameState, roundNumber]);

  useEffect(() => {
    const sendTeam: WebsocketTeam = {
      type: 'red-team',
      payload: {
        teamType: 'RED',
        totalScore: teamsDataRef.current.redTeam.totalScore,
        name: redTeam.name,
        fault: teamsDataRef.current.redTeam.fault,
        stationActive: teamsDataRef.current.redTeam.stationActive,
      },
    };

    if (status === 'success') {
      sendMessage(sendTeam);
    }
  }, [
    status,
    redTeam,
    sendMessage,
    teamsDataRef.current.redTeam.fault,
    gameState,
    roundNumber,
  ]);

  useEffect(() => {
    const sendTeam: WebsocketTeam = {
      type: 'blue-team',
      payload: {
        teamType: 'BLUE',
        totalScore: teamsDataRef.current.blueTeam.totalScore,
        name: teamsDataRef.current.blueTeam.name,
        fault: teamsDataRef.current.blueTeam.fault,
        stationActive: teamsDataRef.current.blueTeam.stationActive,
      },
    };

    if (status === 'success') {
      sendMessage(sendTeam);
    }
  }, [
    status,
    blueTeam,
    sendMessage,
    gameState,
    teamsDataRef.current.blueTeam.fault,
    gameState,
    roundNumber,
  ]);

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
