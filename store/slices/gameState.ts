import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SliceName } from '../enums';
import { GameStatus, IBoard, IQuestion } from '@__types/game.type';

const initialState: IBoard = {
  score: 0,
  currentQuestion: {
    answers: [],
    id: '',
    multiplier: 1,
    question: '',
  },
  gameStatus: 'BATTLE',
  roundNumber: 0,
  showNextBattleButton: false,
  showNextRoundButton: false,
  showEndGameButton: false,
  introMusic: false,
  startCompetition: false,
  boardBlocked: false,
};

const gameSlice = createSlice({
  name: SliceName.BOARD,
  initialState,
  reducers: {
    updateGameScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    updateCurrentQuestion: (state, action: PayloadAction<IQuestion>) => {
      state.currentQuestion = action.payload;
    },
    updateGameStatus: (state, action: PayloadAction<GameStatus>) => {
      state.gameStatus = action.payload;
    },
    showNextBattleButtonFunc: (state, action: PayloadAction<boolean>) => {
      state.showNextBattleButton = action.payload;
    },
    showNextRoundButtonFunc: (state, action: PayloadAction<boolean>) => {
      state.showNextRoundButton = action.payload;
    },
    showEndGameButtonFunc: (state, action: PayloadAction<boolean>) => {
      state.showEndGameButton = action.payload;
    },
    boardBlockedFunc: (state, action: PayloadAction<boolean>) => {
      state.boardBlocked = action.payload;
    },
    nextQuestion: (state) => {
      state.roundNumber += 1;
    },
    initialStateFunc: () => {
      return initialState;
    },
    introMusicFunc: (state, action: PayloadAction<boolean>) => {
      state.introMusic = action.payload;
    },
    startCompetitionFunc: (state, action: PayloadAction<boolean>) => {
      state.startCompetition = action.payload;
    },
  },
});

export const {
  updateGameScore,
  updateCurrentQuestion,
  nextQuestion,
  initialStateFunc,
  updateGameStatus,
  showNextBattleButtonFunc,
  showNextRoundButtonFunc,
  showEndGameButtonFunc,
  introMusicFunc,
  startCompetitionFunc,
  boardBlockedFunc,
} = gameSlice.actions;

export default gameSlice.reducer;
