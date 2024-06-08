import { combineReducers } from '@reduxjs/toolkit';

import globalState from './slices/globalStateReducer';
import teams from './slices/teamsState';
import gameState from './slices/gameState';

const rootReducer = combineReducers({
  globalState,
  teams,
  gameState,
});

export default rootReducer;
