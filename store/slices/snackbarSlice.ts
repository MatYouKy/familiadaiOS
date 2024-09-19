import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SliceName } from '../enums';
import { ISnackbar } from '@__types/game.type';

const initialState: ISnackbar = {
  message: '',
  status: null,
  snackbarHideAfter: 3,
};

const snackbarSlice = createSlice({
  name: SliceName.GLOBAL_STATE,
  initialState,
  reducers: {
    snackbarActionFunc: (state, action: PayloadAction<ISnackbar>) => {
      state.message = action.payload.message;
      state.status = action.payload.status;
      state.snackbarHideAfter = action.payload.snackbarHideAfter
    },
    resetSnackbar: (state) => {
      state.message = initialState.message;
      state.status = initialState.status;
    },
  },
});

export const { snackbarActionFunc, resetSnackbar } = snackbarSlice.actions;

export const GlobalStateActions = snackbarSlice.actions;

export default snackbarSlice.reducer;
