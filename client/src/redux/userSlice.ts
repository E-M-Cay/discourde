import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    username: string;
    serverUsername?: string;
    token?: string;
    activeServer?: number;
    user_id?: number;
    activeChannel?: number;
    activeVocalChannel?: number;
    home: boolean;
    privateChats: number[];
}

const initialUserState: UserState = {
    token: localStorage.getItem('token')
        ? (localStorage.getItem('token') as string)
        : undefined,
    username: '',
    home: true,
    privateChats: [],
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
            state.token = action.payload;
        },
        setActiveServer: (state, action: PayloadAction<number>) => {
            state.activeServer = action.payload;
        },
        setUserId: (state, action: PayloadAction<number>) => {
            state.user_id = action.payload;
        },
        setActiveChannel: (state, action: PayloadAction<number>) => {
            state.activeChannel = action.payload;
        },
        setActiveVocalChannel: (state, action: PayloadAction<number>) => {
            state.activeVocalChannel = action.payload;
        },
        addPrivateChat: (state, action: PayloadAction<number>) => {
            state.privateChats.push(action.payload);
        },
        setPrivateChat: (state, action: PayloadAction<number[]>) => {
            state.privateChats = action.payload;
        },
    },
});

export const {
    setIsHome,
    setUsername,
    setToken,
    setActiveServer,
    setUserId,
    setActiveChannel,
    setServerUsername,
    setActiveVocalChannel,
    addPrivateChat,
    setPrivateChat,
} = userSlice.actions;

export default userSlice.reducer;
