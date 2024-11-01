import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SliceName } from '../enums';
import { IFault, IGameTeams, ITeam } from '@__types/game.type';

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
    collectButton: false,
    stationActive: false
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
    collectButton: false,
    stationActive: false
  },
  teamSwap: false
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
    stationRedActive: (state, action: PayloadAction<boolean>) => {
      state.redTeam.stationActive = action.payload;
    },
    stationBlueActive: (state, action: PayloadAction<boolean>) => {
      state.blueTeam.stationActive = action.payload;
    },
    resetStations: (state) => {
      state.redTeam.stationActive = false;
      state.blueTeam.stationActive = false;
    },

    clearFaultFunc: (state) => {
      state.blueTeam.fault = [];
      state.redTeam.fault = [];
    },

    nextRoundReset: (state) => {
      state.redTeam.isActive = false;
      state.blueTeam.isActive = false;
    },
    startGameTeam: (state) => {
      state.blueTeam = initialState.blueTeam,
      state.redTeam = initialState.redTeam
    },
    swapTeamFunc: (state) => {
      state.teamSwap = !state.teamSwap;
    },

    resetTeams: (state) => {
      state.redTeam = {
        ...initialState.redTeam,
        totalScore: state.redTeam.totalScore,
        name: state.redTeam.name,
      };
      state.blueTeam = {
        ...initialState.blueTeam,
        totalScore: state.blueTeam.totalScore,
        name: state.blueTeam.name,
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
  stationRedActive,
  stationBlueActive,
  swapTeamFunc,
  resetStations,
} = teams.actions;

export const TeamActions = teams.actions;

export default teams.reducer;
