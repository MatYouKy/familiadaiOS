import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceName } from '../enums';
import { IConnect } from '@__types/game.type';

const initialState: IConnect = {
  status: 'pending',
  message: 'not connected with other device',
  ipAddress: 'http://localhost:2020',
};

const webSocketSlice = createSlice({
  name: SliceName.WEBSOCKET,
  initialState,
  reducers: {
    connectState: (state, action: PayloadAction<IConnect>) => {
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.ipAddress = action.payload.ipAddress;
    },
  },
});

export const { connectState } = webSocketSlice.actions;

export default webSocketSlice.reducer;
