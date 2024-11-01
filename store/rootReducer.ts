import { combineReducers } from '@reduxjs/toolkit';

import globalState from './slices/globalStateReducer';
import teams from './slices/teamsState';
import gameState from './slices/gameState';
import webSocketSlice from './slices/webSocketSlice';
import competitions from './slices/competitionsStateSlice';
import snackbarAction from './slices/snackbarSlice';
import connectedDevices from './slices/devicesStateSlice';

const rootReducer = combineReducers({
  globalState,
  teams,
  gameState,
  webSocketSlice,
  competitions,
  snackbarAction,
  connectedDevices
});

export default rootReducer;