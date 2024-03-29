import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/types';

interface UserState {
  serverUsername?: string;
  token?: string;
  activeServerName?: string;
  activeServerOwner?: number;
  activeServer: number;
  activeChannel: number;
  activeVocalChannel: number;
  activePrivateChat: number;
  home: boolean;
  cameraChat: boolean;
  aiChat: boolean;
  me?: User;
  isMute: boolean;
  isMuteAudio: boolean;
  isConnected: boolean;
  activeVocalChannelServer: number;
  isCameraActive: boolean;
  aiMsg: string;
}

const initialUserState: UserState = {
  token: localStorage.getItem('token')
    ? (localStorage.getItem('token') as string)
    : undefined,
  activeServer: 0,
  activeVocalChannel: 0,
  activePrivateChat: 0,
  activeChannel: 0,
  home: false,
  isMute: false,
  aiChat: false,
  cameraChat: false,
  isMuteAudio: false,
  isConnected: false,
  isCameraActive: false,
  activeVocalChannelServer: 0,
  aiMsg: '',
  me: undefined,
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
      if (action.payload === 0) {
        const audio = new Audio();
      }
      state.activeVocalChannel = action.payload;
      if (action.payload !== 0) {
        state.activeVocalChannelServer = state.activeServer;
      } else {
        state.activeVocalChannelServer = 0;
      }
    },
    setActivePrivateChat: (state, action: PayloadAction<number>) => {
      state.activePrivateChat = action.payload;
    },
    setMe: (state, action: PayloadAction<User>) => {
      console.log(action.payload);
      state.me = action.payload;
    },
    setCameraChat: (state, action: PayloadAction<boolean>) => {
      state.cameraChat = action.payload;
    },
    setMute: (state) => {
      state.isMute = true;
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
      state.activeServer = 0;
      state.activeChannel = 0;
      state.activeVocalChannel = 0;
      state.aiMsg = '';
      state.activePrivateChat = 0;
    },
    disableCamera: (state) => {
      state.isCameraActive = false;
    },
    enableCamera: (state) => {
      state.isCameraActive = true;
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
  setCameraChat,
  setMe,
  setMute,
  setUnmute,
  setMuteAudio,
  setUnmuteAudio,
  setIsConnected,
  setAiMsg,
  enableCamera,
  disableCamera,
} = userSlice.actions;

export default userSlice.reducer;
