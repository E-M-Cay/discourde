import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { User } from '../types/types';

interface UserState {
  username: string;
  serverUsername?: string;
  token?: string;
  activeServerName?: string;
  activeServerOwner?: number;
  activeServer?: number;
  activeChannel?: number;
  activeVocalChannel?: number;
  activePrivateChat?: number;
  home: boolean;
  me?: User;
  isMute: boolean;
  isMuteAudio: boolean;
  isConnected: boolean;
}

const initialUserState: UserState = {
  token: localStorage.getItem('token')
    ? (localStorage.getItem('token') as string)
    : undefined,
  username: '',
  home: true,
  isMute: false,
  isMuteAudio: false,
  isConnected: false,
};

export const userSlice = createSlice({
  initialState: initialUserState,
  name: 'user',
  reducers: {
    setIsHome: (state, action: PayloadAction<boolean>) => {
      state.home = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setServerUsername: (state, action: PayloadAction<string>) => {
      state.serverUsername = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      console.log('putain');
      state.token = action.payload;
    },
    setActiveServerName: (state, action: PayloadAction<string>) => {
      state.activeServerName = action.payload;
    },
    setActiveServerOwner: (state, action: PayloadAction<number>) => {
      state.activeServerOwner = action.payload;
    },
    setActiveServer: (state, action: PayloadAction<number>) => {
      state.activeServer = action.payload;
    },
    setActiveChannel: (state, action: PayloadAction<number>) => {
      state.activeChannel = action.payload;
    },

    setActiveVocalChannel: (state, action: PayloadAction<number>) => {
      state.activeVocalChannel = action.payload;
    },
    setActivePrivateChat: (state, action: PayloadAction<number>) => {
      state.activePrivateChat = action.payload;
    },
    setMe: (state, action: PayloadAction<User>) => {
      state.me = action.payload;
    },
    setMute: (state) => {
      // console.log('truc1');
      state.isMute = true;
    },
    setUnmute: (state) => {
      // console.log('truc2');
      state.isMute = false;
    },
    setMuteAudio: (state) => {
      state.isMuteAudio = true;
    },
    setUnmuteAudio: (state) => {
      state.isMuteAudio = false;
    },
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const {
  setIsHome,
  setUsername,
  setToken,
  setActiveServerName,
  setActiveServerOwner,
  setActiveServer,
  setActiveChannel,
  setServerUsername,
  setActiveVocalChannel,
  setActivePrivateChat,
  setMe,
  setMute,
  setUnmute,
  setMuteAudio,
  setUnmuteAudio,
  setIsConnected,
} = userSlice.actions;

export default userSlice.reducer;
