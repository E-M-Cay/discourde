import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/types';

interface UserState {
  serverUsername?: string;
  token?: string;
  activeServerName?: string;
  activeServerOwner?: number;
  activeServer: number;
  activeChannel?: number;
  activeVocalChannel?: number;
  activePrivateChat?: number;
  home: boolean;
  aiChat: boolean;
  me?: User;
  isMute: boolean;
  isMuteAudio: boolean;
  isConnected: boolean;
  activeVocalChannelServer: number;
  aiMsg: string;
}

const initialUserState: UserState = {
  token: localStorage.getItem('token')
    ? (localStorage.getItem('token') as string)
    : undefined,
  activeServer: 0,
  home: false,
  isMute: false,
  aiChat: false,
  isMuteAudio: false,
  isConnected: false,
  activeVocalChannelServer: 0,
  aiMsg: '',
};

export const userSlice = createSlice({
  initialState: initialUserState,
  name: 'user',
  reducers: {
    setIsHome: (state, action: PayloadAction<boolean>) => {
      state.home = action.payload;
    },
    setAiChat: (state, action: PayloadAction<boolean>) => {
      state.aiChat = action.payload;
    },
    setAiMsg: (state, action: PayloadAction<string>) => {
      state.aiMsg = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      //console.log('putain');
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
      state.activeVocalChannelServer = state.activeServer;
    },
    setActivePrivateChat: (state, action: PayloadAction<number>) => {
      state.activePrivateChat = action.payload;
    },
    setMe: (state, action: PayloadAction<User>) => {
      state.me = action.payload;
    },
    setMute: (state) => {
      // //console.log('truc1');
      state.isMute = true;
    },
    setStatus: (state, action: PayloadAction<number>) => {
      if (state.me) {
        setMe({ ...state.me, status: action.payload });
      }
    },
    setUnmute: (state) => {
      // //console.log('truc2');
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
  setAiChat,
  setToken,
  setActiveServerName,
  setActiveServerOwner,
  setActiveServer,
  setActiveChannel,
  setActiveVocalChannel,
  setActivePrivateChat,
  setMe,
  setStatus,
  setMute,
  setUnmute,
  setMuteAudio,
  setUnmuteAudio,
  setIsConnected,
  setAiMsg,
} = userSlice.actions;

export default userSlice.reducer;
