import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SliceName } from '../enums';
import { GameProgress, IGlobal, IQuestion } from '@__types/game.type';

const initialState: IGlobal = {
  gameProgress: 'INIT',
  sessionActive: false,
  questions: [],
};

const globalStateSlice = createSlice({
  name: SliceName.GLOBAL_STATE,
  initialState,
  reducers: {
    updateGameProgress: (state, action: PayloadAction<GameProgress>) => {
      state.gameProgress = action.payload;
    },
    updateSession: (state, action: PayloadAction<IGlobal['sessionActive']>) => {
      state.sessionActive = action.payload;
    },
    startGame: (state, action: PayloadAction<IQuestion[]>) => {
      state.questions = action.payload;
    },
  },
});

export const { updateGameProgress, updateSession, startGame } =
  globalStateSlice.actions;

export const GlobalStateActions = globalStateSlice.actions;

export default globalStateSlice.reducer;
