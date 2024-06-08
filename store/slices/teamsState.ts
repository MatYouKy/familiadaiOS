import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SliceName } from '../enums';
import { IFault, IGameTeams, ITeam } from '../../types/game.type';

const initialState: IGameTeams = {
  redTeam: {
    name: 'Czerwoni',
    fault: [],
    teamType: 'RED',
    totalScore: 0,
    isActive: false,
    extraGame: false,
    faultButtonDisabled: false,
    activeButton: false,
    collectButton: false
  },
  blueTeam: {
    name: 'Niebiescy',
    fault: [],
    teamType: 'BLUE',
    totalScore: 0,
    isActive: false,
    extraGame: false,
    faultButtonDisabled: false,
    activeButton: false,
    collectButton: false
  },
};

const teams = createSlice({
  name: SliceName.TEAM,
  initialState,
  reducers: {
    changeRedTeamName: (state, action: PayloadAction<ITeam['name']>) => {
      state.redTeam.name = action.payload;
    },
    changeBlueTeamName: (state, action: PayloadAction<ITeam['name']>) => {
      state.blueTeam.name = action.payload;
    },

    updateRedTotalScore: (state, action: PayloadAction<ITeam['totalScore']>) => {
      state.redTeam.totalScore += action.payload;
    },
    updateBlueTotalScore: (state, action: PayloadAction<ITeam['totalScore']>) => {
      state.blueTeam.totalScore += action.payload;
    },

    updateRedTeamChance: (state, action: PayloadAction<IFault>) => {
      state.redTeam.fault.push(action.payload);
    },
    updateBlueTeamChance: (state, action: PayloadAction<IFault>) => {
      state.blueTeam.fault.push(action.payload);
    },

    redTeamActive: (state, action: PayloadAction<boolean>) => {
      state.redTeam.isActive = action.payload;
    },
    blueTeamActive: (state, action: PayloadAction<ITeam['isActive']>) => {
      state.blueTeam.isActive = action.payload;
    },
    redFaultButtonDisabledFunc: (state, action: PayloadAction<boolean>) => {
      state.redTeam.faultButtonDisabled = action.payload;
    },
    blueFaultButtonDisabledFunc: (state, action: PayloadAction<boolean>) => {
      state.blueTeam.faultButtonDisabled = action.payload;
    },

    redTeamExtraGame: (state, action: PayloadAction<ITeam['extraGame']>) => {
      state.redTeam.extraGame = action.payload;
    },
    blueTeamExtraGame: (state, action: PayloadAction<ITeam['extraGame']>) => {
      state.blueTeam.extraGame = action.payload;
    },

    redTeamActiveButton: (state, action: PayloadAction<boolean>) => {
      state.redTeam.activeButton = action.payload;
    },
    blueTeamActiveButton: (state, action: PayloadAction<boolean>) => {
      state.blueTeam.activeButton = action.payload;
    },
    redTeamCollectButton: (state, action: PayloadAction<boolean>) => {
      state.redTeam.collectButton = action.payload;
    },
    blueTeamCollectButton: (state, action: PayloadAction<boolean>) => {
      state.blueTeam.collectButton = action.payload;
    },

    clearFaultFunc: (state) => {
      state.blueTeam.fault = [];
      state.redTeam.fault = [];
    },

    nextRoundReset: (state) => {
      state.redTeam.isActive = false;
      state.blueTeam.isActive = false;
    },
    startGameTeam: () => {
      return initialState;
    },

    resetTeams: (state) => {
      state.redTeam = {
        ...initialState.redTeam,
        totalScore: state.redTeam.totalScore,
      };
      state.blueTeam = {
        ...initialState.blueTeam,
        totalScore: state.blueTeam.totalScore,
      };
    },
  },
});

export const {
  startGameTeam,
  changeRedTeamName,
  changeBlueTeamName,
  updateRedTotalScore,
  updateBlueTotalScore,
  updateRedTeamChance,
  updateBlueTeamChance,
  nextRoundReset,
  resetTeams,
  redTeamActive,
  blueTeamActive,
  redTeamExtraGame,
  blueTeamExtraGame,
  clearFaultFunc,
  redFaultButtonDisabledFunc,
  blueFaultButtonDisabledFunc,
  redTeamActiveButton,
  blueTeamActiveButton,
  redTeamCollectButton,
  blueTeamCollectButton,
} = teams.actions;

export const TeamActions = teams.actions;

export default teams.reducer;
