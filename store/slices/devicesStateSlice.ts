import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceName } from '../enums';
import { IDevices } from '@__types/connect.type';

const initialState: IDevices = {
  desktopIsActive: false,
  pulpitIsActive: false,
};

const devicesStateSlice = createSlice({
  name: SliceName.WEBSOCKET,
  initialState,
  reducers: {
    desktopActiveActionFunc: (state, action: PayloadAction<boolean>) => {
      state.desktopIsActive = action.payload;
    },
    pulpitActiveActionFunc: (state, action: PayloadAction<boolean>) => {
      state.pulpitIsActive = action.payload;
    },
  },
});

export const { desktopActiveActionFunc, pulpitActiveActionFunc } =
  devicesStateSlice.actions;

export default devicesStateSlice.reducer;
