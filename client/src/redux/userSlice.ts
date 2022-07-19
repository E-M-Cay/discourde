import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Peer from 'peerjs';

interface UserState {
  rooms: string[];
  username: string;
  token?: string;
  activeServer?: number;
  user_id?: number;
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
    setActiveServer: (state, action: PayloadAction<number>) => {
      state.activeServer = action.payload;
    },

    setUserId: (state, action: PayloadAction<number>) => {
      state.user_id = action.payload
    }
  
  },
});

export const { joinRoomSuccess, setUsername, setToken, setActiveServer, setUserId } =
  userSlice.actions;

export default userSlice.reducer;
