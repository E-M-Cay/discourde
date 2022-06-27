import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Peer from 'peerjs';

interface UserState {
  rooms: string[];
  username: string;
  token?: string;
  stream?: MediaStream;
}

const initialUserState: UserState = {
  rooms: [],
  username: '',
};

export const userSlice = createSlice({
  initialState: initialUserState,
  name: 'user',
  reducers: {
    joinRoomSuccess: (state, action: PayloadAction<string>) => {
      state.rooms = [...state.rooms, action.payload];
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setStream: (state, action: PayloadAction<MediaStream>) => {
      state.stream = action.payload;
    },
  },
});

export const { joinRoomSuccess, setUsername, setToken, setStream } =
  userSlice.actions;

export default userSlice.reducer;
