import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SliceName } from '../enums';
import { ICompetition, IManageCompetition, IQuestion } from '@__types/game.type';

const initialState: IManageCompetition = {
  currentCompetitions: [],
  editedCompetition: {
    competitionTitle: '',
    eventDate: '',
    id: '',
    questions: [],
  }
};

const competitionsStateSlice = createSlice({
  name: SliceName.GLOBAL_STATE,
  initialState,
  reducers: {
    updateCompetitionList: (
      state,
      action: PayloadAction<IManageCompetition['editedCompetition']>
    ) => {
      state.editedCompetition = action.payload;
    },
    setCompetitionList: (
      state,
      action: PayloadAction<IManageCompetition['currentCompetitions']>
    ) => {
      state.currentCompetitions = action.payload;
    },
    addCompetitionFunc: (
      state,
      action: PayloadAction<IManageCompetition['editedCompetition']>
    ) => {
      state.currentCompetitions = [...state.currentCompetitions, action.payload];
    },
    editCompetitionFunc: (
      state,
      action: PayloadAction<IManageCompetition['editedCompetition']>
    ) => {
      const updatedCompetition = state.currentCompetitions.map((competition) =>
        competition.id === action.payload.id ? action.payload : competition
      );

      state.currentCompetitions = updatedCompetition;
    },
    deleteCompetitionFunc: (state, action: PayloadAction<string>) => {
      const updatedCompetition = state.currentCompetitions.filter(
        (competition) => competition.id !== action.payload
      );

      state.currentCompetitions = updatedCompetition;
    },
    initializeCompetitionFunc: (state, action: PayloadAction<ICompetition>) => {
      state.editedCompetition = action.payload;
    },
    addQuestionToCompetitionFunc: (state, action: PayloadAction<IQuestion>) => {
      state.editedCompetition.questions = [
        ...state.editedCompetition.questions,
        action.payload,
      ];
    },
    editCompetitionTitle: (state, action: PayloadAction<string>) => {
      state.editedCompetition.competitionTitle = action.payload;
    },
    editCompetitionEventDate: (state, action: PayloadAction<string>) => {
      state.editedCompetition.eventDate = action.payload;
    },
    editQuestionFromCompetitionFunc: (state, action: PayloadAction<IQuestion>) => {
      const questionIndex = state.editedCompetition.questions.findIndex(
        (comp) => comp.id === action.payload.id
      );
      if (questionIndex !== -1) {
        state.editedCompetition.questions[questionIndex] = action.payload;
      }
    },
    deleteQuestionFromCompetitionFunc: (state, action: PayloadAction<string>) => {
      const filteredQuestion = state.editedCompetition.questions.filter(
        (question) => question.id !== action.payload
      );
      state.editedCompetition.questions = filteredQuestion;
    },
    resetStateFunc: (state) => {
      state.currentCompetitions = initialState.currentCompetitions;
      state.editedCompetition = initialState.editedCompetition;
    },
    resetEditCompetitionStore: (state) => {
      state.editedCompetition = initialState.editedCompetition;
    },
  },
});

export const {
  updateCompetitionList,
  setCompetitionList,
  addCompetitionFunc,
  editCompetitionFunc,
  deleteCompetitionFunc,
  initializeCompetitionFunc,
  addQuestionToCompetitionFunc,
  editQuestionFromCompetitionFunc,
  editCompetitionTitle,
  editCompetitionEventDate,
  deleteQuestionFromCompetitionFunc,
  resetEditCompetitionStore,
} = competitionsStateSlice.actions;

export const GlobalStateActions = competitionsStateSlice.actions;

export default competitionsStateSlice.reducer;
