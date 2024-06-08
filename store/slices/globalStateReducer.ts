import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SliceName } from '../enums';
import { GameProgress, IConnect, IGlobal, IQuestion } from '../../types/game.type';

const initialState: IGlobal = {
  ipAddress: 'http://localhost:3000',
  connected: {
    status: 'error',
    message: 'not connected with other device',
  },
  gameProgress: 'INIT',
  sessionActive: false,
  introMusic: false,
  questions: [],
};

const globalStateSlice = createSlice({
  name: SliceName.GLOBAL_STATE,
  initialState,
  reducers: {
    setIpAddress: (state, action: PayloadAction<string>) => {
      state.ipAddress = action.payload;
    },
    connected: (state, action: PayloadAction<IConnect>) => {
      state.connected = action.payload;
    },
    updateGameProgress: (state, action: PayloadAction<GameProgress>) => {
      state.gameProgress = action.payload;
    },
    updateSession: (state, action: PayloadAction<IGlobal['sessionActive']>) => {
      state.sessionActive = action.payload;
    },
    startGame: (state, action: PayloadAction<IQuestion[]>) => {
      state.questions = action.payload;
    },
    introMusicFunc: (state, action: PayloadAction<boolean>) => {
      state.introMusic = action.payload;
    },
  },
});

export const {
  setIpAddress,
  introMusicFunc,
  connected,
  updateGameProgress,
  updateSession,
  startGame,
} = globalStateSlice.actions;

export const GlobalStateActions = globalStateSlice.actions;

export default globalStateSlice.reducer;
