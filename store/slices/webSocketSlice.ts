import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceName } from '../enums';

interface WebSocketState {
  status: 'connecting' | 'open' | 'closed' | 'error';
  messages: string[];
}

const initialState: WebSocketState = {
  status: 'connecting',
  messages: [],
};

const webSocketSlice = createSlice({
  name: SliceName.WEBSOCKET,
  initialState,
  reducers: {
    connectionStatusUpdated: (state, action: PayloadAction<WebSocketState['status']>) => {
      state.status = action.payload;
    },
    messageReceived: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { connectionStatusUpdated, messageReceived } = webSocketSlice.actions;

export default webSocketSlice.reducer;
