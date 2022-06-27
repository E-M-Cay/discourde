import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PeerState {
  isConnecting: boolean;
  isConnected: boolean;
  peerId?: string;
}

const initialState: PeerState = {
  isConnecting: false,
  isConnected: false,
};

const peerSlice = createSlice({
  name: 'peer',
  initialState,
  reducers: {
    startConnecting: (state) => {
      console.log(state.isConnecting);
      state.isConnecting = true;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
      state.isConnecting = false;
    },
    setPeerId: (state, action: PayloadAction<string>) => {
      state.peerId = action.payload;
    },
  },
});

export const { startConnecting, connectionEstablished, setPeerId } =
  peerSlice.actions;

export default peerSlice.reducer;
